import matplotlib.pyplot as plt
import numpy as np

def plot_eval_metrics(fft_eval_results, peft_eval_results):
    metrics = ['Accuracy', 'Precision', 'Recall', 'F1-Score']
    
    fft_values = [
        fft_eval_results['eval_accuracy'],
        fft_eval_results['eval_precision'],
        fft_eval_results['eval_recall'],
        fft_eval_results['eval_f1']
    ]

    peft_values = [
        peft_eval_results['eval_accuracy'],
        peft_eval_results['eval_precision'],
        peft_eval_results['eval_recall'],
        peft_eval_results['eval_f1']
    ]

    fft_values_percentage = [value * 100 for value in fft_values]
    peft_values_percentage = [value * 100 for value in peft_values]

    bar_width = 0.35
    index = np.arange(len(metrics))

    plt.figure(figsize=(10, 6))

    bars_fft = plt.bar(index, fft_values_percentage, bar_width, color='b', label='FFT')

    bars_peft = plt.bar(index + bar_width, peft_values_percentage, bar_width, color='g', label='PEFT')

    for bar, value in zip(bars_fft, fft_values_percentage):
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width() / 2, height / 2, f"{value:.2f}%", ha='center', va='center', color='white', fontsize=10)

    for bar, value in zip(bars_peft, peft_values_percentage):
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width() / 2, height / 2, f"{value:.2f}%", ha='center', va='center', color='white', fontsize=10)

    plt.xlabel('Metrics')
    plt.ylabel('Percentage [%]')
    plt.title('Evaluation Metrics Comparison (FFT vs PEFT)')
    plt.xticks(index + bar_width / 2, metrics)
    plt.legend()

    plt.savefig('./plots/eval_metrics.png')

    plt.show()