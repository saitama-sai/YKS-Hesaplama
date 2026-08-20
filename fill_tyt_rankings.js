const fs = require('fs');

const dagilim = JSON.parse(fs.readFileSync('data/osym_dagilim_v2.json', 'utf8'));
const veriler = JSON.parse(fs.readFileSync('data/veriler.json', 'utf8'));

function hesaplaSiralama(puan, alanKey) {
  const alanData = dagilim[alanKey];
  if (!alanData || alanData.length === 0) return null;
  
  if (puan >= alanData[0].puan) return alanData[0].siralama;
  if (puan <= alanData[alanData.length - 1].puan) return alanData[alanData.length - 1].siralama;

  for (let i = 0; i < alanData.length - 1; i++) {
    let ust = alanData[i];
    let alt = alanData[i+1];

    if (puan <= ust.puan && puan > alt.puan) {
      let puanFarki = ust.puan - alt.puan;         
      let kisiFarki = alt.siralama - ust.siralama;       
      let puanFazlasi = puan - alt.puan;           
      
      let oran = puanFazlasi / puanFarki;          
      let iyilesenKisi = oran * kisiFarki;         
      
      let tahminiSira = alt.siralama - iyilesenKisi;  
      
      return Math.round(tahminiSira);
    }
  }
  return null;
}

let updated = 0;
for (let i = 0; i < veriler.length; i++) {
  if (veriler[i].puanTuru === 'TYT' && veriler[i].puan) {
    const calc = hesaplaSiralama(veriler[i].puan, 'TYT');
    if (calc !== null) {
      veriler[i].siralama = calc;
      updated++;
    }
  }
}

fs.writeFileSync('data/veriler.json', JSON.stringify(veriler, null, 2));
console.log(`Updated rankings for ${updated} TYT programs.`);
