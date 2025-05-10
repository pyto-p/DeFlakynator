import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

# Load dataset
file_path = '/mnt/data/AllDataFinal.csv'
data = pd.read_csv(file_path)

# 1. Descriptive Analysis
def descriptive_analysis(df):
    print("\nDescriptive Analysis:\n")
    print("\nColumn Data Types:\n", df.dtypes)
    print("\nSummary Statistics for Numerical Columns:\n", df.describe())
    print("\nFixCategory Distribution:\n", df['FixCategory'].value_counts())

descriptive_analysis(data)

# 2. Stratified Sampling
stratified_sample = data.groupby('FixCategory', group_keys=False).apply(lambda x: x.sample(frac=0.2, random_state=42))
stratified_sample.to_csv("Stratified_Sample.csv", index=False)
print("\nStratified sample saved as 'Stratified_Sample.csv'.")

# 3. Random Sampling
random_sample = data.sample(frac=0.2, random_state=42)
random_sample.to_csv("Random_Sample.csv", index=False)
print("\nRandom sample saved as 'Random_Sample.csv'.")

# 4. Train-Test Split (Cross-validation-like split)
def split_data(df, test_size=0.2):
    train, test = train_test_split(df, test_size=test_size, random_state=42, stratify=df['FixCategory'])
    return train, test

train_data, test_data = split_data(data)
train_data.to_csv("Train_Data.csv", index=False)
test_data.to_csv("Test_Data.csv", index=False)
print("\nTrain and Test data saved as 'Train_Data.csv' and 'Test_Data.csv'.")