import pandas as pd
import json
import re

def normalize(text):
    if not isinstance(text, str): return ""
    text = text.lower()
    text = text.replace('ı', 'i').replace('i̇', 'i').replace('ğ', 'g')
    text = text.replace('ü', 'u').replace('ş', 's').replace('ö', 'o').replace('ç', 'c')
    # Remove all non-alphanumeric chars
    text = re.sub(r'[^a-z0-9]', '', text)
    return text

csv_path = r"C:\Users\sait\.cache\kagglehub\datasets\yakupie\2022-2025-yks-niversite-baar-sralamalar\versions\1\data.csv"
veriler_path = r"data\veriler.json"
output_path = r"data\historical_data.json"

print("Loading Kaggle CSV...")
# Some records might not have siralama or puan
df = pd.read_csv(csv_path, encoding='utf-8', encoding_errors='replace')

# Create a dictionary for quick lookup from Kaggle data
# Key: normalized(universite + bolum), Value: dict of years {2022: siralama, 2023: siralama...}
kaggle_dict = {}

for _, row in df.iterrows():
    uni = normalize(row['universite'])
    bolum = normalize(row['bolum'])
    yil = int(row['yil'])
    siralama = row['siralama']
    
    # If siralama is NaN, we can keep it as None
    if pd.isna(siralama) or siralama == "Dolmadý" or siralama == "Dolmadı" or siralama == "---":
        siralama = None
    else:
        try:
            siralama = int(float(siralama))
        except:
            siralama = None

    key = f"{uni}_{bolum}"
    if key not in kaggle_dict:
        kaggle_dict[key] = {}
    kaggle_dict[key][yil] = siralama

print("Loading veriler.json...")
with open(veriler_path, 'r', encoding='utf-8') as f:
    veriler = json.load(f)

print("Merging data...")
historical_data = []

for item in veriler:
    uni_norm = normalize(item.get('uni', ''))
    bolum_norm = normalize(item.get('bolum', ''))
    key = f"{uni_norm}_{bolum_norm}"
    
    history = {
        "2022": None,
        "2023": None,
        "2024": None,
        "2025": None,
        "2026": item.get('siralama', None)
    }
    
    if key in kaggle_dict:
        k_data = kaggle_dict[key]
        history["2022"] = k_data.get(2022, None)
        history["2023"] = k_data.get(2023, None)
        history["2024"] = k_data.get(2024, None)
        history["2025"] = k_data.get(2025, None)
    
    # We only include it if it has at least one year of data (it always has 2026, but just to be sure)
    historical_item = {
        "id": item.get('id'),
        "uni": item.get('uni'),
        "bolum": item.get('bolum'),
        "puanTuru": item.get('puanTuru'),
        "history": history
    }
    historical_data.append(historical_item)

print(f"Total merged items: {len(historical_data)}")

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(historical_data, f, ensure_ascii=False, indent=2)

print("Done!")
