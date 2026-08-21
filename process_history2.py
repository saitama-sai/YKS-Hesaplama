import pandas as pd
import json
import re

def normalize_uni(text):
    if not isinstance(text, str): return ""
    # Remove text in parentheses, e.g., (İSTANBUL)
    text = re.sub(r'\(.*?\)', '', text)
    text = text.lower()
    text = text.replace('ı', 'i').replace('i̇', 'i').replace('ğ', 'g')
    text = text.replace('ü', 'u').replace('ş', 's').replace('ö', 'o').replace('ç', 'c')
    text = re.sub(r'[^a-z0-9]', '', text)
    return text

def normalize_bolum(text):
    if not isinstance(text, str): return ""
    text = text.lower()
    # Remove things like (4 Yıllık), (5 Yıllık), (2 Yıllık)
    text = re.sub(r'\(\d\s*yıllık\)', '', text)
    
    # Sort the words to handle cases like "Tıp (İngilizce) (Burslu)" vs "Tıp (Burslu) (İngilizce)"
    # We can just extract all parts: base name + parens, normalize them and sort them.
    text = text.replace('ı', 'i').replace('i̇', 'i').replace('ğ', 'g')
    text = text.replace('ü', 'u').replace('ş', 's').replace('ö', 'o').replace('ç', 'c')
    
    # Find base text and parentheses texts
    base = re.sub(r'\(.*?\)', '', text)
    parens = re.findall(r'\((.*?)\)', text)
    
    base_norm = re.sub(r'[^a-z0-9]', '', base)
    parens_norm = sorted([re.sub(r'[^a-z0-9]', '', p) for p in parens])
    
    return base_norm + "".join(parens_norm)

csv_path = r"C:\Users\sait\.cache\kagglehub\datasets\yakupie\2022-2025-yks-niversite-baar-sralamalar\versions\1\data.csv"
veriler_path = r"data\veriler.json"
output_path = r"data\historical_data.json"

print("Loading Kaggle CSV...")
df = pd.read_csv(csv_path, encoding='utf-8')

kaggle_dict = {}

for _, row in df.iterrows():
    uni = normalize_uni(row['universite'])
    bolum = normalize_bolum(row['bolum'])
    yil = int(row['yil'])
    siralama = row['siralama']
    
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
matches = 0

for item in veriler:
    uni_norm = normalize_uni(item.get('uni', ''))
    bolum_norm = normalize_bolum(item.get('bolum', ''))
    key = f"{uni_norm}_{bolum_norm}"
    
    history = {
        "2022": None,
        "2023": None,
        "2024": None,
        "2025": None,
        "2026": item.get('siralama', None)
    }
    
    if key in kaggle_dict:
        matches += 1
        k_data = kaggle_dict[key]
        history["2022"] = k_data.get(2022, None)
        history["2023"] = k_data.get(2023, None)
        history["2024"] = k_data.get(2024, None)
        history["2025"] = k_data.get(2025, None)
    
    historical_item = {
        "id": item.get('id'),
        "uni": item.get('uni'),
        "bolum": item.get('bolum'),
        "puanTuru": item.get('puanTuru'),
        "history": history
    }
    historical_data.append(historical_item)

print(f"Total merged items: {len(historical_data)}")
print(f"Successful matches with Kaggle data: {matches}")

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(historical_data, f, ensure_ascii=False, indent=2)

print("Done!")
