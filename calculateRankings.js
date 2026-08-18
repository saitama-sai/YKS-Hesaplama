const fs = require('fs');
const path = require('path');

const verilerPath = path.join(__dirname, 'data', 'veriler.json');
const osymPath = path.join(__dirname, 'data', 'osym_dagilim_v2.json');

const rawData = JSON.parse(fs.readFileSync(verilerPath, 'utf8'));
const osymDataObj = JSON.parse(fs.readFileSync(osymPath, 'utf8'));

// Her bir puan türü (SAY, EA vs.) için listeyi kendi içinde sıralayalım (Puan yüksekten düşüğe)
for (let key in osymDataObj) {
  if (Array.isArray(osymDataObj[key])) {
    osymDataObj[key].sort((a, b) => b.puan - a.puan);
  }
}

// Puan türü tahmin fonksiyonu
function guessPuanTuru(bolum) {
  const b = bolum.toLocaleLowerCase('tr-TR');
  if (b.includes('mühendis') || b.includes('tıp') || b.includes('diş') || b.includes('eczacılık') || b.includes('mimarlık') || b.includes('hemşire') || b.includes('matematik') || b.includes('biyoloji') || b.includes('fizik') || b.includes('kimya')) {
    return 'SAY';
  }
  if (b.includes('hukuk') || b.includes('psikoloji') || b.includes('işletme') || b.includes('iktisat') || b.includes('rehberlik') || b.includes('siyaset') || b.includes('uluslararası ilişkiler') || b.includes('maliye')) {
    return 'EA';
  }
  if (b.includes('tarih') || b.includes('coğrafya') || b.includes('türkçe') || b.includes('edebiyat') || b.includes('gazetecilik') || b.includes('halkla ilişkiler') || b.includes('radyo') || b.includes('ilahiyat')) {
    return 'SOZ';
  }
  if (b.includes('ingilizce') || b.includes('almanca') || b.includes('fransızca') || b.includes('mütercim') || b.includes('dil')) {
    return 'DIL';
  }
  return 'SAY'; 
}

// Lineer İnterpolasyon Fonksiyonu
function calculateRanking(puan, puanTuru) {
  puan = parseFloat(puan);
  if (isNaN(puan) || puan <= 0) return 0;
  
  // Eğer bu puan türü için dağılım verimiz yoksa (ör: SOZ, DIL), fallback olarak SAY kullanalım
  let curve = osymDataObj[puanTuru];
  if (!curve || curve.length === 0) {
    curve = osymDataObj['SAY'];
  }
  if (!curve || curve.length === 0) return 0;

  // Puan tablodaki en yüksek değerden bile yüksekse
  if (puan >= curve[0].puan) {
    return curve[0].siralama || 1;
  }

  // Puan tablodaki en düşük değerden bile düşükse
  const lastIndex = curve.length - 1;
  if (puan <= curve[lastIndex].puan) {
    return curve[lastIndex].siralama;
  }

  // Arada bir değerse interpolasyon yap
  for (let i = 0; i < curve.length - 1; i++) {
    const upperPoint = curve[i];
    const lowerPoint = curve[i + 1];

    if (puan <= upperPoint.puan && puan >= lowerPoint.puan) {
      const puanFarki = upperPoint.puan - lowerPoint.puan;
      const upperSiralama = upperPoint.siralama;
      const lowerSiralama = lowerPoint.siralama;

      if (puanFarki === 0) return upperSiralama;

      const userPuanFarki = upperPoint.puan - puan;
      const siralamaFarki = lowerSiralama - upperSiralama;

      const oransalSiralama = (userPuanFarki / puanFarki) * siralamaFarki;
      return Math.round(upperSiralama + oransalSiralama);
    }
  }

  return 0; // Bulunamazsa
}

console.log("81.000 veri için sıralamalar hesaplanıyor...");

// Tüm verilere siralama ekle
const updatedData = rawData.map(item => {
  const puanTuru = guessPuanTuru(item.bolum);
  const siralama = calculateRanking(item.puan, puanTuru);
  return {
    ...item,
    siralama: siralama,
    puanTuru: puanTuru.toUpperCase()
  };
});

fs.writeFileSync(verilerPath, JSON.stringify(updatedData, null, 2));

console.log("Hesaplama tamamlandı ve data/veriler.json dosyasına yazıldı.");
console.log("Örnek Veriler:");
console.log(updatedData.slice(0, 5));
