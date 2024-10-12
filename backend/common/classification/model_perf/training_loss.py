import matplotlib.pyplot as plt

def plot_training_loss(fft_training_logs, peft_training_logs):
    fft_epochs = [log['epoch'] for log in fft_training_logs if 'loss' in log]
    fft_losses = [log['loss'] for log in fft_training_logs if 'loss' in log]

    peft_epochs = [log['epoch'] for log in peft_training_logs if 'loss' in log]
    peft_losses = [log['loss'] for log in peft_training_logs if 'loss' in log]

    plt.figure(figsize=(10, 6))

    plt.plot(fft_epochs, fft_losses, marker='o', linestyle='-', color='b', label='FFT Training Loss')

    plt.plot(peft_epochs, peft_losses, marker='x', linestyle='--', color='g', label='PEFT Training Loss')

    plt.xlabel('Epoch')
    plt.ylabel('Training Loss')
    plt.title('Training Loss per Epoch Comparison (FFT vs PEFT)')
    plt.grid(True)
    plt.legend()

    plt.savefig('./plots/training_loss.png')

    plt.show()
