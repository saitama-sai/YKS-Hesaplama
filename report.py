import json

with open('data/veriler.json', 'r', encoding='utf-8') as f:
    v = json.load(f)

# Filter: State Uni (id starts with 10), 2-Year (TYT), and siralama is not None
filtered = [x for x in v if str(x['id']).startswith('10') and x['puanTuru'] == 'TYT' and isinstance(x['siralama'], (int, float))]

# Sort by siralama descending (highest numerical value means lowest ranking)
filtered.sort(key=lambda x: x['siralama'], reverse=True)

# Get top 100
top100 = filtered[:100]

md = '# Devlet Üniversiteleri - En Düşük Sıralamalı 2 Yıllık (Ön Lisans) Bölümler\n\n'
md += 'Aşağıdaki tabloda, Devlet Üniversitelerindeki 2 yıllık (TYT puan türüyle öğrenci alan) ve başarı sıralaması en düşük olan (sıralama numarası en yüksek olan) son 100 bölüm listelenmiştir.\n\n'
md += '| Sıra | Üniversite | Bölüm | Sıralama | Puan |\n'
md += '|:---:|---|---|---:|---:|\n'

for i, x in enumerate(top100, 1):
    sira_fmt = f"{x['siralama']:,.0f}".replace(',', '.')
    puan_fmt = f"{x['puan']:.5f}".replace('.', ',') if isinstance(x['puan'], (int, float)) else str(x['puan'])
    md += f"| {i} | {x['uni']} | {x['bolum']} | {sira_fmt} | {puan_fmt} |\n"

with open(r'C:\Users\sait\.gemini\antigravity-ide\brain\05c3c921-2db5-4cc8-992a-7dcd7cc16ea1\lowest_ranking_2yr_state.md', 'w', encoding='utf-8') as f:
    f.write(md)

print("Report generated successfully.")
