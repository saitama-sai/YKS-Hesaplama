const fs = require('fs');
const filePath = 'data/osym_dagilim_v2.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const tytRaw = `550 112
530 2045
510 8638
490 22600
470 45313
450 76021
430 115071
410 163211
390 225038
370 305570
350 412011
330 553526
310 735519
290 961261
270 1219171
250 1499060
230 1782951
210 2033331
190 2166477
170 2186977
150 2187734
130 2187742
115 2187743`;

const tytData = tytRaw.split('\n').map(line => {
  const [puan, siralama] = line.split(' ').map(Number);
  return { puan, siralama };
});

tytData.sort((a, b) => a.siralama - b.siralama);

data.TYT = tytData;
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('TYT data added successfully!');
