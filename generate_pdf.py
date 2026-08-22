import json
from fpdf import FPDF

with open('data/veriler.json', 'r', encoding='utf-8') as f:
    v = json.load(f)

# Filter: State Uni (id starts with 10), 2-Year (TYT), siralama is not None, and DOES NOT contain 'KKTC'
filtered = [
    x for x in v 
    if str(x['id']).startswith('10') 
    and x['puanTuru'] == 'TYT' 
    and isinstance(x['siralama'], (int, float))
    and 'KKTC' not in x.get('bolum', '').upper()
    and 'KKTC' not in x.get('uni', '').upper()
]

# Sort by siralama descending (highest numerical value means lowest ranking)
filtered.sort(key=lambda x: x['siralama'], reverse=True)

# Get top 100
top100 = filtered[:100]

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, 'Devlet Üniversiteleri - En Düşük Sıralamalı 2 Yıllık Bölümler (KKTC Hariç)', 0, 1, 'C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Sayfa {self.page_no()}/{{nb}}', 0, 0, 'C')

pdf = PDF(orientation='L') # Landscape for wide table
pdf.add_font('Arial', '', r'C:\Windows\Fonts\arial.ttf', uni=True)
pdf.add_font('Arial', 'B', r'C:\Windows\Fonts\arialbd.ttf', uni=True)
pdf.add_font('Arial', 'I', r'C:\Windows\Fonts\ariali.ttf', uni=True)
pdf.alias_nb_pages()
pdf.add_page()
pdf.set_font('Arial', 'B', 10)

# Table Header
col_widths = [10, 100, 100, 30, 30]
headers = ['Sıra', 'Üniversite', 'Bölüm', 'Sıralama', 'Puan']

for i in range(len(headers)):
    pdf.cell(col_widths[i], 10, headers[i], 1, 0, 'C')
pdf.ln()

pdf.set_font('Arial', '', 9)

# Table Body
for i, x in enumerate(top100, 1):
    sira_fmt = f"{x['siralama']:,.0f}".replace(',', '.')
    puan_fmt = f"{x['puan']:.5f}".replace('.', ',') if isinstance(x['puan'], (int, float)) else str(x['puan'])
    
    # We might need to handle long text. MultiCell is better but harder in a row. 
    # Let's truncate strings if they are too long for single line cell to avoid breaking the table, 
    # or just use short versions.
    uni_name = x['uni'][:60]
    bolum_name = x['bolum'][:60]

    pdf.cell(col_widths[0], 8, str(i), 1, 0, 'C')
    pdf.cell(col_widths[1], 8, uni_name, 1, 0, 'L')
    pdf.cell(col_widths[2], 8, bolum_name, 1, 0, 'L')
    pdf.cell(col_widths[3], 8, sira_fmt, 1, 0, 'R')
    pdf.cell(col_widths[4], 8, puan_fmt, 1, 1, 'R')

pdf_output_path = r'C:\Users\sait\.gemini\antigravity-ide\brain\05c3c921-2db5-4cc8-992a-7dcd7cc16ea1\Devlet_2Yil_KKTC_Haric.pdf'
pdf.output(pdf_output_path)
print("PDF generated successfully.")
