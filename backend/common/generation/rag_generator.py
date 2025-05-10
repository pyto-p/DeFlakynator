import torch
import faiss
import subprocess
import os
import pickle
from transformers import AutoTokenizer, AutoModel

# RAG Generator utility functions

def save_faiss_index(index, file_path):
    """
    Save the FAISS index to disk.

    Args:
        index (faiss.IndexFlatL2): The FAISS index to save.
        file_path (str): The path where the index should be saved.
    """
    print(f"Saving FAISS index to {file_path}...")
    faiss.write_index(index, file_path)
    print("FAISS index saved.")

def load_faiss_index(file_path):
    """
    Load the FAISS index from disk.

    Args:
        file_path (str): The path to the FAISS index file.

    Returns:
        faiss.IndexFlatL2: The loaded FAISS index.
    """
    print(f"Loading FAISS index from {file_path}...")
    index = faiss.read_index(file_path)
    print("FAISS index loaded.")
    return index

def save_indexed_data(data, file_path):
    """
    Save indexed data (dataset) to disk.

    Args:
        data (List[Dict]): The indexed dataset.
        file_path (str): The path where the indexed data should be saved.
    """
    print(f"Saving indexed dataset to {file_path}...")
    with open(file_path, 'wb') as f:
        pickle.dump(data, f)
    print("Indexed dataset saved.")

def load_indexed_data(file_path):
    """
    Load indexed data (dataset) from disk.

    Args:
        file_path (str): The path to the indexed dataset file.

    Returns:
        List[Dict]: The loaded indexed dataset.
    """
    print(f"Loading indexed dataset from {file_path}...")
    with open(file_path, 'rb') as f:
        data = pickle.load(f)
    print("Indexed dataset loaded.")
    return data

def build_faiss_index(dataset, model, tokenizer, index_file="faiss_index.bin", data_file="indexed_data.pkl"):
    """
    Build or load a FAISS index for efficient retrieval of similar examples.

    Args:
        dataset (List[Dict]): The dataset with input examples.
        model: The pre-trained model for generating embeddings.
        tokenizer: The tokenizer paired with the model.
        index_file (str): The path where the FAISS index will be saved/loaded.
        data_file (str): The path where the indexed dataset will be saved/loaded.

    Returns:
        faiss.IndexFlatL2: The FAISS index.
        indexed_data (List[Dict]): The original dataset, ordered as in the FAISS index.
    """
    # Check if the FAISS index and dataset already exist
    if os.path.exists(index_file) and os.path.exists(data_file):
        index = load_faiss_index(index_file)
        indexed_data = load_indexed_data(data_file)
        print("Loaded existing FAISS index and dataset.")
        return index, indexed_data

    # Otherwise, build a new FAISS index
    print("Building FAISS index...")
    index = faiss.IndexFlatL2(768)  # Assuming model embeddings are 768-dimensional
    indexed_data = []

    for example in dataset:
        input_text = example['input']
        # Tokenize and create embeddings
        inputs = tokenizer(input_text, return_tensors="pt", padding=True, truncation=True, max_length=512)
        with torch.no_grad():
            embeddings = model(**inputs).last_hidden_state[:, 0, :].cpu().numpy()  # CLS token embedding
        index.add(embeddings)
        indexed_data.append(example)

    print(f"FAISS index built with {len(indexed_data)} examples.")
    
    # Save the FAISS index and indexed dataset to disk for future use
    save_faiss_index(index, index_file)
    save_indexed_data(indexed_data, data_file)

    return index, indexed_data


def setup_llama():
    """
    Initializes and returns the LLaMA model name for usage via Ollama's CLI.

    Returns:
        A string representing the LLaMA model name (e.g., 'tinyllama').
    """
    model_name = "llama3.1"  # Model name as used in the Ollama CLI
    print(f"Using LLaMA model: {model_name}")
    return model_name


def retrieve_relevant_cases(test_case, model, tokenizer, faiss_index, indexed_data, k=5):
    """
    Retrieve the top k relevant examples from the FAISS index based on the test case.

    Args:
        test_case (str): The input test case to match against the dataset.
        model: The pre-trained model for generating embeddings.
        tokenizer: The tokenizer paired with the model.
        faiss_index (faiss.IndexFlatL2): The FAISS index containing dataset embeddings.
        indexed_data (List[Dict]): The original dataset entries.
        k (int): Number of relevant examples to retrieve.

    Returns:
        List[Dict]: The top k retrieved examples from the dataset.
    """
    print("Retrieving relevant cases...")
    
    # Get the embedding for the test case
    inputs = tokenizer(test_case, return_tensors="pt", padding=True, truncation=True, max_length=512)
    with torch.no_grad():
        query_embedding = model(**inputs).last_hidden_state[:, 0, :].cpu().numpy()

    # Search FAISS index for nearest neighbors
    distances, indices = faiss_index.search(query_embedding, k)

    # Retrieve the corresponding examples from the indexed data
    retrieved_examples = [indexed_data[i] for i in indices[0]]
    
    print(f"Retrieved {len(retrieved_examples)} relevant cases.")
    return retrieved_examples


def create_prompt(retrieved_examples, test_case, fix_category):
    """
    Create a concise prompt for Ollama to focus only on generating the necessary fix without unnecessary details.
    """
    prompt = f"""You are an expert code repair assistant specializing in fixing flaky async/await tests. 
    Please apply the {fix_category} method to resolve the issue in the provided test case: {test_case}. 
    Make the fixed version of the flaky test similar to the fixed version of {retrieved_examples} but not very smilar please. 
    Follow this format in your response: 
    
    ``` <javascript>
    The fixed flaky test goes here. Please don't make any code comments inside.
    ```

    ***Explanation:*** Include a brief 3rd POV 2-sentence explanation of how the chosen fix category improves the reliability of the test.
    """
    
    print("Prompt created for Ollama.")
    return prompt


def generate_fix(model_name, prompt):
    """
    Generate a fix using the Ollama model by passing the prompt via stdin.

    Args:
        model_name (str): The name of the model to run.
        prompt (str): The input prompt for the model.

    Returns:
        str: The generated output from the model.
    """
    try:
        print("Generating fix with Ollama...")
        
        # Use the 'ollama run' command and pass the prompt via stdin, ensuring UTF-8 encoding
        command = ["ollama", "run", model_name]
        
        # Run the command and pipe the prompt via stdin, ensuring UTF-8 encoding
        result = subprocess.run(command, input=prompt, capture_output=True, text=True, encoding='utf-8')

        if result.returncode != 0:
            # Handle error case
            print(f"Error from Ollama CLI: {result.stderr}")
            raise Exception(f"Ollama CLI error: {result.stderr.strip()}")

        # Display the result.stdout without any prefix
        return result.stdout.strip()

    except Exception as e:
        print(f"Error during fix generation: {e}")
        return f"Failed to generate fix: {str(e)}"


def rag_generate_solution(test_case, fix_category, model, tokenizer, faiss_index, indexed_data, llama_model):
    """
    Run the full RAG pipeline to generate a fix for the test case.
    
    Args:
        test_case (str): The input test case to fix.
        model: The pre-trained model for generating embeddings.
        tokenizer: The tokenizer paired with the model.
        faiss_index (faiss.IndexFlatL2): The FAISS index containing dataset embeddings.
        indexed_data (List[Dict]): The original dataset entries.
        llama_model: The name of the LLaMA model (used by the Ollama CLI).

    Returns:
        str: The generated fix for the input test case.
    """
    print(f"Generating fix for the test case: {test_case}")

    # Step 1: Retrieve relevant cases
    retrieved_examples = retrieve_relevant_cases(test_case, model, tokenizer, faiss_index, indexed_data)

    if not retrieved_examples:
        print("No relevant examples retrieved. Aborting fix generation.")
        return "No fix could be generated due to lack of relevant examples."

    # Step 2: Create the prompt for LLaMA
    prompt = create_prompt(retrieved_examples, test_case, fix_category)
    
    # Step 3: Generate the fix using LLaMA
    try:
        generated_fix = generate_fix(llama_model, prompt)
    except Exception as e:
        print(f"Error during fix generation: {e}")
        return f"Failed to generate fix: {str(e)}"
    
    return generated_fix