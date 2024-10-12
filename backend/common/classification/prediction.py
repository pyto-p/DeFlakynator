import torch

def predict_fix_category(input_text, model, tokenizer, device):
    inputs = tokenizer(input_text, return_tensors="pt", max_length=512, padding="max_length", truncation=True).to(device)
    outputs = model(**inputs)
    predicted_category = torch.argmax(outputs.logits, dim=1).item()

    # Convert numerical label back to category name
    category_map = {
        0: "Add Mock",
        1: "Add/Adjust Wait",
        2: "Widen Assertion",
        3: "Handle Timeout",
        4: "Isolate State",
        5: "Manage Resource"
    }
    
    return category_map[predicted_category]