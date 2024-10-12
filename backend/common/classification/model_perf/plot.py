import json
from training_loss import plot_training_loss
from eval_loss import plot_eval_loss
from eval_metrics import plot_eval_metrics
from training_latency import plot_training_latency
from testing_latency import plot_testing_latency

with open('../../../unixcoder-fft/result_logs.json', 'r') as f:
    fft_data = json.load(f)

with open('../../../unixcoder-peft/result_logs.json', 'r') as f:
    peft_data = json.load(f)

fft_training_logs = fft_data['training_logs']
fft_eval_results = fft_data['eval_results']
peft_training_logs = peft_data['training_logs']
peft_eval_results = peft_data['eval_results']

plot_training_loss(fft_training_logs, peft_training_logs)
plot_eval_loss(fft_training_logs, peft_training_logs)
plot_eval_metrics(fft_eval_results, peft_eval_results)
plot_training_latency(fft_training_logs, peft_training_logs)
plot_testing_latency(fft_eval_results, peft_eval_results)