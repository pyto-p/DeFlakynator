# Standard Library Imports
import json
import os
import re

# Third-Party Library Imports 
from codebleu import calc_codebleu
import torch
from transformers import RobertaForSequenceClassification, RobertaTokenizerFast, Trainer, TrainingArguments, AutoModel
import random
import numpy as np

# Local Relative Imports
from common.classification.dataset import load_dataset
from common.classification.preprocess import preprocess_data
from common.classification.tokenization import tokenize_data
from common.classification.prediction import predict_fix_category
from common.classification.metrics import compute_metrics
from common.generation.rag_generator import build_faiss_index, rag_generate_solution, setup_llama

torch.manual_seed(10)
random.seed(10)
np.random.seed(10)

device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

dataset_path = '../data/6000-merged_dataset.json'
raw_dataset = load_dataset(dataset_path)

save_directory = './trained_model/fft_unixcoder'

if os.path.exists(save_directory):
    print("Loading the saved fine-tuned model...")

    model = RobertaForSequenceClassification.from_pretrained(save_directory, num_labels=6)

    tokenizer = RobertaTokenizerFast.from_pretrained(save_directory)
    model.to(device)

else:
    dataset = preprocess_data(raw_dataset)

    dataset = dataset.train_test_split(test_size=0.2)

    unixcoder = "microsoft/unixcoder-base"
    tokenizer = RobertaTokenizerFast.from_pretrained(unixcoder)

    model = RobertaForSequenceClassification.from_pretrained(unixcoder, num_labels=6)

    model.to(device)

    tokenized_datasets = dataset.map(lambda x: tokenize_data(x, tokenizer), batched=True)

    training_args = TrainingArguments(
        output_dir="./results",
        eval_strategy="epoch",
        save_strategy="epoch",
        learning_rate=1e-5,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        num_train_epochs=10,
        weight_decay=0.01,
        logging_dir='./logs',
        logging_steps=10,
        save_steps=500,
        save_total_limit=2,
        load_best_model_at_end=True,
        metric_for_best_model="f1"
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_datasets["train"],
        eval_dataset=tokenized_datasets["test"],
        tokenizer=tokenizer,
        compute_metrics=compute_metrics
    )

    print("Training the model...")
    trainer.train()

    training_logs = trainer.state.log_history
    print(f"Training Log: {training_logs}")

    eval_results = trainer.evaluate()
    print(f"Evalution Results: {eval_results}")

    with open('./result_logs.json', 'w') as f:
        json.dump({'training_logs': training_logs, 'eval_results': eval_results}, f, indent=4)

    print("Saving the fine-tuned model...")
    model.save_pretrained(save_directory)
    tokenizer.save_pretrained(save_directory)

with open('./result_logs.json', 'r') as f:
    data = json.load(f)

print("Model is ready. You can now test the model by entering JavaScript test cases.")

while True: 
    user_input = input("\nEnter a JavaScript async wait flaky test case (or type 'exit' to quit):\n")

    if user_input.lower() == 'exit':
        break

    output = predict_fix_category(user_input, model, tokenizer, device)
    print(f"\nPredicted Fix Category: \n{output}")

    dataset = load_dataset('../data/6000-merged_dataset.json') 

    tokenizer = RobertaTokenizerFast.from_pretrained('microsoft/unixcoder-base')
    model = AutoModel.from_pretrained('microsoft/unixcoder-base')

    os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

    faiss_index, indexed_data = build_faiss_index(dataset, model, tokenizer, index_file="faiss_index.bin", data_file="indexed_data.pkl")

    llama_model = setup_llama()

    test_case = user_input

    fix_category = output

    try:
        generated_fix = rag_generate_solution(test_case, fix_category, model, tokenizer, faiss_index, indexed_data, llama_model)
  
        print(generated_fix)  

        print('\n\n')
        print("Enter your reference code (press Enter twice when done):")

        reference_code = []
        while True:
            line = input()
            if line == "":
                break
            reference_code.append(line)

        formatted_reference = "\n".join(reference_code)

        predicted_code = re.findall(r"```(.*?)```", generated_fix, re.DOTALL)

        if predicted_code:
            predicted_code = predicted_code[0].strip()
        else:
            predicted_code = ""

        predicted_code = predicted_code.replace('javascript', '')
        print('predicted: ', predicted_code)
        print('reference: ', formatted_reference)
        result = calc_codebleu([formatted_reference], [predicted_code], lang="javascript", weights=(0.10, 0.10, 0.40, 0.40), tokenizer=None)

        print('+------------------------------------------------------------+')
        print('Ngram Match Score: ' , result['ngram_match_score'] * 100 , '%')
        print('+------------------------------------------------------------+')
        print('Weighted Ngram Match Score: ' , result['weighted_ngram_match_score'] * 100 , '%')
        print('+------------------------------------------------------------+')
        print('Syntax Match : ' , result['syntax_match_score'] * 100 , '%')
        print('+------------------------------------------------------------+')
        print('Semantic Match: ' , result['dataflow_match_score'] * 100 , '%')
        print('+------------------------------------------------------------+')
        print('Codebleu Score: ' , result['codebleu'] * 100 , '%')
        print('+------------------------------------------------------------+')

    except Exception as e:
        print(f"Error in generating fix: {e}")