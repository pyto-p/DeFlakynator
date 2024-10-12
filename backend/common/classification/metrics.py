import torch
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

def compute_metrics(eval_pred):
    logits, labels = eval_pred

    logits = torch.tensor(logits)

    predictions = torch.argmax(logits, dim=-1)
    # breakpoint()

    accuracy = accuracy_score(labels, predictions.numpy())

    precision, recall, f1, _ = precision_recall_fscore_support(labels, predictions.numpy(), average='weighted')
    
    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1': f1,
    }