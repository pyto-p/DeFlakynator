import matplotlib.pyplot as plt

def plot_eval_loss(fft_training_logs, peft_training_logs):
    fft_epochs = [log['epoch'] for log in fft_training_logs if 'eval_loss' in log]
    fft_eval_losses = [log['eval_loss'] for log in fft_training_logs if 'eval_loss' in log]

    peft_epochs = [log['epoch'] for log in peft_training_logs if 'eval_loss' in log]
    peft_eval_losses = [log['eval_loss'] for log in peft_training_logs if 'eval_loss' in log]

    plt.figure(figsize=(10, 6))

    plt.plot(fft_epochs, fft_eval_losses, marker='o', linestyle='-', color='b', label='FFT Eval Loss')

    plt.plot(peft_epochs, peft_eval_losses, marker='x', linestyle='--', color='g', label='PEFT Eval Loss')

    plt.xlabel('Epoch')
    plt.ylabel('Evaluation Loss')
    plt.title('Evaluation Loss per Epoch Comparison (FFT vs PEFT)')
    plt.grid(True)
    plt.legend()

    plt.savefig('./plots/evaluation_loss.png')

    plt.show()