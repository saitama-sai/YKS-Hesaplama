const fs = require('fs');
const xlsx = require('xlsx');

const workbook = xlsx.readFile('2yil.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const verilerFile = 'data/veriler.json';
const veriler = JSON.parse(fs.readFileSync(verilerFile, 'utf-8'));

let added = 0;
// Data starts at row 3 (index 2), but let's just skip until we see numbers
for (let i = 2; i < data.length; i++) {
  const row = data[i];
  if (!row || row.length < 9) continue;
  
  const idStr = row[0];
  if (!idStr || isNaN(parseInt(idStr, 10))) continue; // Valid program kod
  
  const id = parseInt(idStr, 10);
  const uni = row[2];
  const bolum = row[4];
  let puanTuru = row[5];
  const kontenjanStr = row[6];
  const puanStr = row[8];
  
  if (puanTuru && puanTuru.trim() === 'TYT') {
    let puan = parseFloat(puanStr);
    if (isNaN(puan)) puan = null;
    
    let kontenjan = parseInt(kontenjanStr, 10);
    if (isNaN(kontenjan)) kontenjan = null;

    // Check if already exists
    if (!veriler.some(v => v.id === id)) {
      veriler.push({
        id,
        uni,
        bolum,
        kontenjan,
        puan,
        siralama: null, // No exact ranking data for 2-year programs base scores
        puanTuru: 'TYT'
      });
      added++;
    }
  }
}

fs.writeFileSync(verilerFile, JSON.stringify(veriler, null, 2));
console.log(`Added ${added} 2-year programs to veriler.json`);
