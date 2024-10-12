import matplotlib.pyplot as plt
import numpy as np

def plot_training_latency(fft_training_logs, peft_training_logs):
    fft_train_runtime = [log['train_runtime'] for log in fft_training_logs if 'train_runtime' in log][0]
    fft_train_steps_per_second = [log['train_steps_per_second'] for log in fft_training_logs if 'train_steps_per_second' in log][0]

    peft_train_runtime = [log['train_runtime'] for log in peft_training_logs if 'train_runtime' in log][0]
    peft_train_steps_per_second = [log['train_steps_per_second'] for log in peft_training_logs if 'train_steps_per_second' in log][0]

    fig, ax1 = plt.subplots(figsize=(10, 6))

    bar_width = 0.35
    index = np.arange(1)

    bars_fft_runtime = ax1.bar(index, fft_train_runtime, bar_width, color='b', label='FFT Runtime')
    
    bars_peft_runtime = ax1.bar(index + bar_width, peft_train_runtime, bar_width, color='g', label='PEFT Runtime')

    ax1.set_ylabel('Train Runtime (seconds)', color='b')
    ax1.tick_params(axis='y', labelcolor='b')

    ax2 = ax1.twinx()

    bars_fft_steps = ax2.bar(index + 2 * bar_width, fft_train_steps_per_second, bar_width, color='b', label='FFT Steps/Sec')
    
    bars_peft_steps = ax2.bar(index + 3 * bar_width, peft_train_steps_per_second, bar_width, color='g', label='PEFT Steps/Sec')

    ax2.set_ylabel('Train Steps Per Second', color='g')
    ax2.tick_params(axis='y', labelcolor='g')

    for bar, value in zip(bars_fft_runtime, [fft_train_runtime]):
        ax1.text(bar.get_x() + bar.get_width() / 2, bar.get_height() / 2, f'{value:.2f}', ha='center', va='center', color='white', fontsize=12)

    for bar, value in zip(bars_peft_runtime, [peft_train_runtime]):
        ax1.text(bar.get_x() + bar.get_width() / 2, bar.get_height() / 2, f'{value:.2f}', ha='center', va='center', color='white', fontsize=12)

    for bar, value in zip(bars_fft_steps, [fft_train_steps_per_second]):
        ax2.text(bar.get_x() + bar.get_width() / 2, bar.get_height() / 2, f'{value:.2f}', ha='center', va='center', color='white', fontsize=12)

    for bar, value in zip(bars_peft_steps, [peft_train_steps_per_second]):
        ax2.text(bar.get_x() + bar.get_width() / 2, bar.get_height() / 2, f'{value:.2f}', ha='center', va='center', color='white', fontsize=12)

    plt.title('Training Runtime and Steps per Second (FFT vs PEFT)')
    plt.grid(True)

    plt.savefig('./plots/training_latency.png')

    plt.show()
