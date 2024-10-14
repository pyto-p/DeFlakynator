import os
import re
import torch
from transformers import RobertaForSequenceClassification, RobertaTokenizerFast, AutoModel
from codebleu import calc_codebleu
from common.classification.dataset import load_dataset
from common.classification.prediction import predict_fix_category
from common.generation.rag_generator import build_faiss_index, rag_generate_solution, setup_llama
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

# Load the fine-tuned model and tokenizer
model, tokenizer = None, None

# Load the fine-tuned model and tokenizer
def load_model_and_tokenizer():
    global model, tokenizer
    save_directory = './trained_model_og/peft_unixcoder'

    if os.path.exists(save_directory):
        print("Loading the saved fine-tuned model...")
        model = RobertaForSequenceClassification.from_pretrained(save_directory, num_labels=6).to(device)
        tokenizer = RobertaTokenizerFast.from_pretrained(save_directory)
        print("Model and tokenizer are ready for use.")
    else:
        raise FileNotFoundError("Fine-tuned model not found. Train the model before using the API.")
    
# Home route for API
@app.route('/')
def home():
    return "Welcome to the UnixCoder Prediction API (Version 2)!"

# API endpoint for prediction and fix generation
@app.route('/api/predict', methods=['POST'])
def api_predict():
    try:
        data = request.json
        js_code = data.get('code')
        reference_code = data.get('reference_code')

        if not js_code:
            return jsonify({"error": "No JavaScript code provided"}), 400

        # Predict fix category
        fix_category = predict_fix_category(js_code, model, tokenizer, device)

        # Load the dataset for embeddings
        dataset = load_dataset("../data/6000-merged_dataset.json")

        # Load UniXCoder for embeddings
        embedding_tokenizer = RobertaTokenizerFast.from_pretrained('microsoft/unixcoder-base')
        embedding_model = AutoModel.from_pretrained('microsoft/unixcoder-base')

        # Set the environment variable to avoid OpenMP conflict
        os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

        # Build or load the FAISS index and dataset
        faiss_index, indexed_data = build_faiss_index(dataset, embedding_model, embedding_tokenizer, index_file="faiss_index.bin", data_file="indexed_data.pkl")

        # Setup LLaMA model via Ollama
        llama_model = setup_llama()

        # Generate the fix using the full RAG pipeline
        generated_fix = rag_generate_solution(js_code, fix_category, embedding_model, embedding_tokenizer, faiss_index, indexed_data, llama_model)

        # Extract predicted code from the generated fix
        predicted_code = re.findall(r"```(.*?)```", generated_fix, re.DOTALL)

        # Initialize predicted_code safely
        if predicted_code:
            predicted_code = predicted_code[0].strip()  # Take the first block and strip whitespace
        else:
            predicted_code = ""  # Handle case where no code block is found

        predicted_code = predicted_code.replace('javascript', '')
        print('predicted: ', predicted_code)

        # If reference_code is provided, calculate CodeBLEU
        if reference_code:
            formatted_reference = reference_code.strip()  # Strip reference code only if provided
            print("Formatted Reference Code:", formatted_reference)  # Log formatted reference code
            print("Predicted Code:", predicted_code)

            # Calculate CodeBLEU
            print("Calculating CodeBLEU...")
            result = calc_codebleu([formatted_reference], [predicted_code], lang="javascript", weights=(0.10, 0.10, 0.40, 0.40), tokenizer=None)

            # Check the result
            if any(value is None for value in result.values()):
                raise ValueError("CodeBLEU calculation returned None values.")

            # Print CodeBLEU result for debugging
            print("CodeBLEU Result:", result)

            # Include CodeBLEU results in the response
            response = {
                "predictedCategory": fix_category,
                "generatedFix": generated_fix,
                "codebleu": {
                    "ngram_match_score": result['ngram_match_score'],
                    "weighted_ngram_match_score": result['weighted_ngram_match_score'],
                    "syntax_match": result['syntax_match_score'],
                    "semantic_match": result['dataflow_match_score'],
                    "codebleu_score": result['codebleu']
                }
            }
        else:
            # If no reference_code is provided, omit the CodeBLEU calculation from the response
            response = {
                "predictedCategory": fix_category,
                "generatedFix": generated_fix,
                "codebleu": None  # CodeBLEU won't be calculated
            }

        return jsonify(response)

    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Log the error message
        return jsonify({"error": str(e)}), 500

# Main entry point for the Flask app
if __name__ == '__main__':
    load_model_and_tokenizer()
    app.run(debug=True, host='0.0.0.0', port=5005)