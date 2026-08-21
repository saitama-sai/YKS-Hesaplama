import pandas as pd
import json

csv_path = r"C:\Users\sait\.cache\kagglehub\datasets\yakupie\2022-2025-yks-niversite-baar-sralamalar\versions\1\data.csv"
veriler_path = r"data\veriler.json"

try:
    df = pd.read_csv(csv_path, encoding='utf-8', encoding_errors='replace')
    print("Columns:", df.columns.tolist())
    print("Total rows:", len(df))
    print("Years available:", df['yil'].unique().tolist())
    print("Sample bolum:", df['bolum'].head(3).tolist())
except Exception as e:
    print("Error:", e)
