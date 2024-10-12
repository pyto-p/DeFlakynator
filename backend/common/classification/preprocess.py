from datasets import Dataset

def preprocess_data(data):
    category_map = {
        "Add Mock": 0,
        "Add/Adjust Wait": 1,
        "Widen Assertion": 2,
        "Handle Timeout": 3,
        "Isolate State": 4,
        "Manage Resource": 5
    }
    
    inputs = [item['input'] for item in data]
    
    outputs = [category_map[item['output'].split(":")[0].strip()] for item in data]

    return Dataset.from_dict({'input': inputs, 'label': outputs})
