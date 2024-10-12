def tokenize_data(data, tokenizer):
     inputs = tokenizer(data["input"], max_length=512, padding="max_length", truncation=True)

     inputs["labels"] = data["label"]

     return inputs