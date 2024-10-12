import matplotlib.pyplot as plt
import numpy as np

def plot_testing_latency(fft_eval_results, peft_eval_results):
    fft_test_runtime = fft_eval_results['eval_runtime']
    fft_test_steps_per_second = fft_eval_results['eval_steps_per_second']

    peft_test_runtime = peft_eval_results['eval_runtime']
    peft_test_steps_per_second = peft_eval_results['eval_steps_per_second']

    fig, ax1 = plt.subplots(figsize=(10, 6))

    bar_width = 0.35
    index = np.arange(1)

    bars_fft_runtime = ax1.bar(index, fft_test_runtime, bar_width, color='b', label='FFT Runtime')

    bars_peft_runtime = ax1.bar(index + bar_width, peft_test_runtime, bar_width, color='g', label='PEFT Runtime')

    ax1.set_ylabel('Test Runtime (seconds)', color='b')
    ax1.tick_params(axis='y', labelcolor='b')

    ax2 = ax1.twinx()

    bars_fft_steps = ax2.bar(index + 2 * bar_width, fft_test_steps_per_second, bar_width, color='b', label='FFT Steps/Sec')

    bars_peft_steps = ax2.bar(index + 3 * bar_width, peft_test_steps_per_second, bar_width, color='g', label='PEFT Steps/Sec')

    ax2.set_ylabel('Test Steps Per Second', color='g')
    ax2.tick_params(axis='y', labelcolor='g')

    for bar, value in zip(bars_fft_runtime, [fft_test_runtime]):
        ax1.text(bar.get_x() + bar.get_width() / 2, bar.get_height() / 2, f'{value:.2f}', ha='center', va='center', color='white', fontsize=12)

    for bar, value in zip(bars_peft_runtime, [peft_test_runtime]):
        ax1.text(bar.get_x() + bar.get_width() / 2, bar.get_height() / 2, f'{value:.2f}', ha='center', va='center', color='white', fontsize=12)

    for bar, value in zip(bars_fft_steps, [fft_test_steps_per_second]):
        ax2.text(bar.get_x() + bar.get_width() / 2, bar.get_height() / 2, f'{value:.2f}', ha='center', va='center', color='white', fontsize=12)

    for bar, value in zip(bars_peft_steps, [peft_test_steps_per_second]):
        ax2.text(bar.get_x() + bar.get_width() / 2, bar.get_height() / 2, f'{value:.2f}', ha='center', va='center', color='white', fontsize=12)

    plt.title('Testing Runtime and Steps per Second (FFT vs PEFT)')
    plt.grid(True)

    plt.savefig('./plots/testing_latency.png')

    plt.show()
