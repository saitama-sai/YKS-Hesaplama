const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'ea_data.txt');
const content = fs.readFileSync(dataFile, 'utf-8');

const eaPoints = [];

// Parse Hukuk (and similar) blocks
// Format: Puan: 529,302 | Sıralama: 105
const regexHukuk = /Puan:\s*([\d,]+)\s*\|\s*Sıralama:\s*([\d.]+)/g;
let match;
while ((match = regexHukuk.exec(content)) !== null) {
  const puanStr = match[1].replace(',', '.');
  const siralamaStr = match[2].replace(/\./g, '');
  if (puanStr !== '—' && siralamaStr !== '—' && siralamaStr !== 'Dolmadı') {
    eaPoints.push({
      puan: parseFloat(puanStr),
      siralama: parseInt(siralamaStr, 10)
    });
  }
}

// Parse İşletme blocks
// Format involves:
// <kontenjan>\t<puan2026>\n<puan2025>\n<puan2024>\n<puan2023>\t<siralama2026>\n<siralama2025>...
// It usually looks like \t([0-9,]+)\n([0-9,]+|—|Dolmadı)\n([0-9,]+|—|Dolmadı)\n([0-9,]+|—|Dolmadı)\t([0-9.]+)\n([0-9.]+|—|Dolmadı)
const regexIsletme = /\t([\d,]+)\n([\d,Dolmadı—\n]+)\t([\d.]+)\n/g;
// Wait, the regex might be tricky. Let's look at the structure specifically:
// 21\t526,26\n517,801\n513,539\n531,087\t136\n165\n277\n172
const blocks = content.split('İşletme');
for (let i = 1; i < blocks.length; i++) {
  const block = blocks[i];
  // extract \t followed by puan followed by \n
  // Actually, let's just find all matches of \t([\d,]+)\n
  // And the corresponding siralamas.
  // We can just extract the first floating point number after a tab that is followed by a newline, 
  // but it's safer to just extract 2026 data:
  const match2026 = block.match(/\t([\d,]+)\n/);
  if (match2026) {
    const puanStr = match2026[1].replace(',', '.');
    // For siralama, it's after the next \t which might be after 3 newlines
    const siralamaMatch = block.match(/\t([\d,]+)(?:\n[^\t]+)*\t([\d.]+)\n/);
    if (siralamaMatch) {
      const siralamaStr = siralamaMatch[2].replace(/\./g, '');
      if (!isNaN(parseFloat(puanStr)) && !isNaN(parseInt(siralamaStr, 10))) {
        eaPoints.push({
          puan: parseFloat(puanStr),
          siralama: parseInt(siralamaStr, 10)
        });
      }
    }
  }
}

// Also just brute force find any \tPuan\n and \tSiralama\n just in case the above doesn't catch all
// We'll write a more robust regex for the İşletme table:
// \t([\d,]+)\n([^\t]+)\t([\d.]+)\n
const regexTable = /\t([\d,]+)\n(?:[\s\S]*?)\t([\d.]+)\n/g;
let match3;
while ((match3 = regexTable.exec(content)) !== null) {
   const puan = parseFloat(match3[1].replace(',', '.'));
   const siralama = parseInt(match3[2].replace(/\./g, ''), 10);
   if (!isNaN(puan) && !isNaN(siralama) && siralama > 0) {
       // Only add if not duplicate
       if (!eaPoints.some(p => p.puan === puan && p.siralama === siralama)) {
          eaPoints.push({ puan, siralama });
       }
   }
}


console.log(`Extracted ${eaPoints.length} EA points.`);

const targetFile = path.join(__dirname, 'data', 'osym_dagilim_v2.json');
let dagilim = {};
if (fs.existsSync(targetFile)) {
  dagilim = JSON.parse(fs.readFileSync(targetFile, 'utf-8'));
}

if (!dagilim.EA) {
  dagilim.EA = [];
}

// Append and sort
dagilim.EA = [...dagilim.EA, ...eaPoints];

// Remove duplicates
const uniqueEA = [];
const seen = new Set();
for (const p of dagilim.EA) {
  const key = `${p.siralama}-${p.puan}`;
  if (!seen.has(key)) {
    seen.add(key);
    uniqueEA.push(p);
  }
}

dagilim.EA = uniqueEA;

// Sort by siralama ascending
dagilim.EA.sort((a, b) => a.siralama - b.siralama);

fs.writeFileSync(targetFile, JSON.stringify(dagilim, null, 2), 'utf-8');
console.log('Saved EA points to osym_dagilim_v2.json');
