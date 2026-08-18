'use client';
import { useState } from 'react';
import styles from './ScoreCalculator.module.css';
import osymData from '@/data/osym_dagilim.json';

// Lineer İnterpolasyon Algoritması
function hesaplaSiralama(puan, alan) {
  if (puan >= osymData[0].puan) return osymData[0][alan];
  if (puan <= osymData[osymData.length - 1].puan) return osymData[osymData.length - 1][alan];

  for (let i = 0; i < osymData.length - 1; i++) {
    let ust = osymData[i];
    let alt = osymData[i+1];

    if (puan <= ust.puan && puan > alt.puan) {
      let puanFarki = ust.puan - alt.puan;         
      let kisiFarki = alt[alan] - ust[alan];       
      let puanFazlasi = puan - alt.puan;           
      
      let oran = puanFazlasi / puanFarki;          
      let iyilesenKisi = oran * kisiFarki;         
      
      let tahminiSira = alt[alan] - iyilesenKisi;  
      
      return Math.round(tahminiSira);
    }
  }
  return 0;
}

export default function ScoreCalculator({ onCalculate }) {
  const [diploma, setDiploma] = useState(85);
  const [netler, setNetler] = useState({
    tyt_turkce: 30,
    tyt_sosyal: 15,
    tyt_mat: 25,
    tyt_fen: 15,
    ayt_mat: 30,
    ayt_fizik: 10,
    ayt_kimya: 10,
    ayt_biyoloji: 10
  });

  const handleChange = (e) => {
    setNetler({
      ...netler,
      [e.target.name]: parseFloat(e.target.value) || 0
    });
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    
    // 1. Ham Puan Hesaplama
    let tyt_net_puani = (netler.tyt_turkce * 3.3) + (netler.tyt_mat * 3.3) + 
                        (netler.tyt_sosyal * 3.4) + (netler.tyt_fen * 3.4);
    let tyt_ham = 100 + tyt_net_puani;

    // AYT Sayısal 
    let ayt_say_net_puani = (netler.ayt_mat * 3.0) + (netler.ayt_fizik * 2.85) + 
                            (netler.ayt_kimya * 3.07) + (netler.ayt_biyoloji * 3.07);
    
    let say_ham = 100 + (tyt_net_puani * 0.4) + (ayt_say_net_puani * 2.0); 

    // 2. OBP Ekleme (Diploma * 5 * 0.12 = Diploma * 0.6)
    let obp_katkisi = diploma * 0.6; 
    
    let tyt_yerlestirme = Math.max(115, Math.min(560, tyt_ham + obp_katkisi));
    let say_yerlestirme = Math.max(115, Math.min(560, say_ham + obp_katkisi));

    // 3. Sıralama Hesaplama
    let siralamaTYT = hesaplaSiralama(tyt_yerlestirme, 'tyt');
    let siralamaSAY = hesaplaSiralama(say_yerlestirme, 'say');

    onCalculate({
      puan: say_yerlestirme.toFixed(4),
      siralama: siralamaSAY
    });
  };

  return (
    <div className={`glass-panel ${styles.calculatorCard}`} style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className={styles.header}>
        <h2 className="gradient-text">YKS Sayısal Sıralama Hesaplama</h2>
        <p>2026 ÖSYM yığınsal dağılım verileri ve lineer interpolasyon ile nokta atışı tahmin.</p>
      </div>

      <form onSubmit={handleCalculate} className={styles.formGroup}>
        <div className={styles.inputContainer} style={{ marginBottom: '30px' }}>
          <label className="input-label" htmlFor="diploma">Diploma Notu (OBP İçin)</label>
          <input 
            type="number" id="diploma" className="input-field" 
            value={diploma} onChange={(e) => setDiploma(parseFloat(e.target.value) || 0)}
            step="0.1" min="50" max="100" required
          />
        </div>

        <h3 style={{ color: 'var(--text-main)', marginBottom: '15px' }}>TYT Netleri</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <div className={styles.inputContainer}>
            <label className="input-label">Türkçe</label>
            <input type="number" name="tyt_turkce" className="input-field" value={netler.tyt_turkce} onChange={handleChange} step="0.25" min="-10" max="40" />
          </div>
          <div className={styles.inputContainer}>
            <label className="input-label">Sosyal</label>
            <input type="number" name="tyt_sosyal" className="input-field" value={netler.tyt_sosyal} onChange={handleChange} step="0.25" min="-5" max="20" />
          </div>
          <div className={styles.inputContainer}>
            <label className="input-label">Matematik</label>
            <input type="number" name="tyt_mat" className="input-field" value={netler.tyt_mat} onChange={handleChange} step="0.25" min="-10" max="40" />
          </div>
          <div className={styles.inputContainer}>
            <label className="input-label">Fen</label>
            <input type="number" name="tyt_fen" className="input-field" value={netler.tyt_fen} onChange={handleChange} step="0.25" min="-5" max="20" />
          </div>
        </div>

        <h3 style={{ color: 'var(--text-main)', marginBottom: '15px' }}>AYT Sayısal Netleri</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <div className={styles.inputContainer}>
            <label className="input-label">Matematik</label>
            <input type="number" name="ayt_mat" className="input-field" value={netler.ayt_mat} onChange={handleChange} step="0.25" min="-10" max="40" />
          </div>
          <div className={styles.inputContainer}>
            <label className="input-label">Fizik</label>
            <input type="number" name="ayt_fizik" className="input-field" value={netler.ayt_fizik} onChange={handleChange} step="0.25" min="-3" max="14" />
          </div>
          <div className={styles.inputContainer}>
            <label className="input-label">Kimya</label>
            <input type="number" name="ayt_kimya" className="input-field" value={netler.ayt_kimya} onChange={handleChange} step="0.25" min="-3" max="13" />
          </div>
          <div className={styles.inputContainer}>
            <label className="input-label">Biyoloji</label>
            <input type="number" name="ayt_biyoloji" className="input-field" value={netler.ayt_biyoloji} onChange={handleChange} step="0.25" min="-3" max="13" />
          </div>
        </div>

        <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
          Yerleştirme Puanını ve Sıralamayı Hesapla
        </button>
      </form>
    </div>
  );
}
