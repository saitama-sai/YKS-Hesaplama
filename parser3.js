const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'soz_data.txt');
const content = fs.readFileSync(dataFile, 'utf-8');

const sozPoints = [];

// Format: Puan: 413,379 | Sıralama: 8.816
const regexSOZ = /Puan:\s*([\d,]+)\s*\|\s*Sıralama:\s*([\d.]+)/g;
let match;
while ((match = regexSOZ.exec(content)) !== null) {
  const puanStr = match[1].replace(',', '.');
  const siralamaStr = match[2].replace(/\./g, '');
  if (puanStr !== '—' && siralamaStr !== '—' && siralamaStr !== 'Dolmadı') {
    sozPoints.push({
      puan: parseFloat(puanStr),
      siralama: parseInt(siralamaStr, 10)
    });
  }
}

console.log(`Extracted ${sozPoints.length} SOZ points.`);

const targetFile = path.join(__dirname, 'data', 'osym_dagilim_v2.json');
let dagilim = {};
if (fs.existsSync(targetFile)) {
  dagilim = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
}

if (!dagilim.SOZ) {
  dagilim.SOZ = [];
}

// Append and sort
dagilim.SOZ = [...dagilim.SOZ, ...sozPoints];

// Remove duplicates
const uniqueSOZ = [];
const seen = new Set();
for (const p of dagilim.SOZ) {
  const key = `${p.siralama}-${p.puan}`;
  if (!seen.has(key)) {
    seen.add(key);
    uniqueSOZ.push(p);
  }
}

dagilim.SOZ = uniqueSOZ;

// Sort by siralama ascending
dagilim.SOZ.sort((a, b) => a.siralama - b.siralama);

fs.writeFileSync(targetFile, JSON.stringify(dagilim, null, 2), 'utf-8');
console.log('Saved SOZ points to osym_dagilim_v2.json');
