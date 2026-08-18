const fs = require('fs');

const text = fs.readFileSync('data/user_points.txt', 'utf8');
const osymData = JSON.parse(fs.readFileSync('data/osym_dagilim.json', 'utf8'));

const regex = /Puan:\s*([\d,]+)\s*\|\s*Sıralama:\s*([\d.]+)/g;
let match;
const newPoints = [];

while ((match = regex.exec(text)) !== null) {
  let puanStr = match[1].replace(',', '.');
  let siralamaStr = match[2].replace(/\./g, '');
  
  let puan = parseFloat(puanStr);
  let siralama = parseInt(siralamaStr, 10);
  
  if (!isNaN(puan) && !isNaN(siralama)) {
    newPoints.push({ say: siralama, puan: puan });
  }
}

console.log("Extracted valid points from user text: " + newPoints.length);

let allPointsMap = new Map();

for (let p of osymData) {
  allPointsMap.set(p.say, p.puan);
}

let updatedCount = 0;
for (let p of newPoints) {
  if (allPointsMap.has(p.say) && allPointsMap.get(p.say) === p.puan) {
    continue;
  }
  allPointsMap.set(p.say, p.puan);
  updatedCount++;
}

console.log("Added/Updated points in the map: " + updatedCount);

const finalData = [];
for (let [say, puan] of allPointsMap.entries()) {
  finalData.push({ say, puan });
}

finalData.sort((a, b) => a.say - b.say);

fs.writeFileSync('data/osym_dagilim.json', JSON.stringify(finalData, null, 2));
console.log("Saved total anchor points to osym_dagilim.json: " + finalData.length);
