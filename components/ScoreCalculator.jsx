'use client';
import { useState } from 'react';
import styles from './ScoreCalculator.module.css';
import osymData from '@/data/osym_dagilim_v2.json';

// Lineer İnterpolasyon Algoritması
function hesaplaSiralama(puan, alanKey) {
  const alanData = osymData[alanKey];
  if (!alanData || alanData.length === 0) return 0;
  
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
  return 0;
}

export default function ScoreCalculator({ onCalculate }) {
  const [diploma, setDiploma] = useState(85);
  const [netler, setNetler] = useState({
    tyt_turkce: 0,
    tyt_sosyal: 0,
    tyt_mat: 0,
    tyt_fen: 0,
    ayt_mat: 0,
    ayt_fizik: 0,
    ayt_kimya: 0,
    ayt_biyoloji: 0,
    ayt_edebiyat: 0,
    ayt_tarih1: 0,
    ayt_cografya1: 0,
    ayt_tarih2: 0,
    ayt_cografya2: 0,
    ayt_felsefe: 0,
    ayt_din: 0
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

    // AYT Sayısal, EA, SOZ
    let ayt_say_net_puani = (netler.ayt_mat * 3.0) + (netler.ayt_fizik * 2.85) + 
                            (netler.ayt_kimya * 3.07) + (netler.ayt_biyoloji * 3.07);
    
    let ayt_ea_net_puani = (netler.ayt_mat * 3.0) + (netler.ayt_edebiyat * 3.0) + 
                           (netler.ayt_tarih1 * 2.8) + (netler.ayt_cografya1 * 3.33);

    let ayt_soz_net_puani = (netler.ayt_edebiyat * 3.0) + (netler.ayt_tarih1 * 2.8) + (netler.ayt_cografya1 * 3.33) +
                            (netler.ayt_tarih2 * 2.91) + (netler.ayt_cografya2 * 2.91) + 
                            (netler.ayt_felsefe * 3.0) + (netler.ayt_din * 3.33);

    let say_ham = 100 + (tyt_net_puani * 0.4) + ayt_say_net_puani;
    let ea_ham = 100 + (tyt_net_puani * 0.4) + ayt_ea_net_puani;
    let soz_ham = 100 + (tyt_net_puani * 0.4) + ayt_soz_net_puani;

    // 2. OBP Ekleme (Diploma * 5 * 0.12 = Diploma * 0.6)
    let obp_katkisi = diploma * 0.6; 
    
    let say_yerlestirme = Math.max(115, Math.min(560, say_ham + obp_katkisi));
    let ea_yerlestirme = Math.max(115, Math.min(560, ea_ham + obp_katkisi));
    let soz_yerlestirme = Math.max(115, Math.min(560, soz_ham + obp_katkisi));
    let tyt_yerlestirme = Math.max(115, Math.min(560, tyt_ham + obp_katkisi));

    // 3. Sıralama Hesaplama
    let siralamaSAY = hesaplaSiralama(say_yerlestirme, 'SAY');
    let siralamaEA = hesaplaSiralama(ea_yerlestirme, 'EA');
    let siralamaSOZ = hesaplaSiralama(soz_yerlestirme, 'SOZ');
    let siralamaTYT = hesaplaSiralama(tyt_yerlestirme, 'TYT');

    onCalculate({
      SAY: { puan: say_yerlestirme.toFixed(4), siralama: siralamaSAY },
      EA: { puan: ea_yerlestirme.toFixed(4), siralama: siralamaEA },
      SOZ: { puan: soz_yerlestirme.toFixed(4), siralama: siralamaSOZ },
      TYT: { puan: tyt_yerlestirme.toFixed(4), siralama: siralamaTYT }
    });
  };

  return (
    <div className={`glass-panel ${styles.calculatorCard}`} style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className={styles.header}>
        <h2 className="gradient-text">YKS Puan ve Sıralama Hesaplama</h2>
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

        <h3 style={{ color: 'var(--text-main)', marginBottom: '15px' }}>AYT Edebiyat - Sosyal 1 Netleri</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <div className={styles.inputContainer}>
            <label className="input-label">Edebiyat</label>
            <input type="number" name="ayt_edebiyat" className="input-field" value={netler.ayt_edebiyat} onChange={handleChange} step="0.25" min="-6" max="24" />
          </div>
          <div className={styles.inputContainer}>
            <label className="input-label">Tarih-1</label>
            <input type="number" name="ayt_tarih1" className="input-field" value={netler.ayt_tarih1} onChange={handleChange} step="0.25" min="-2.5" max="10" />
          </div>
          <div className={styles.inputContainer}>
            <label className="input-label">Coğrafya-1</label>
            <input type="number" name="ayt_cografya1" className="input-field" value={netler.ayt_cografya1} onChange={handleChange} step="0.25" min="-1.5" max="6" />
          </div>
        </div>

        <h3 style={{ color: 'var(--text-main)', marginBottom: '15px' }}>AYT Sosyal 2 Netleri</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <div className={styles.inputContainer}>
            <label className="input-label">Tarih-2</label>
            <input type="number" name="ayt_tarih2" className="input-field" value={netler.ayt_tarih2} onChange={handleChange} step="0.25" min="-2.75" max="11" />
          </div>
          <div className={styles.inputContainer}>
            <label className="input-label">Coğrafya-2</label>
            <input type="number" name="ayt_cografya2" className="input-field" value={netler.ayt_cografya2} onChange={handleChange} step="0.25" min="-2.75" max="11" />
          </div>
          <div className={styles.inputContainer}>
            <label className="input-label">Felsefe Grubu</label>
            <input type="number" name="ayt_felsefe" className="input-field" value={netler.ayt_felsefe} onChange={handleChange} step="0.25" min="-3" max="12" />
          </div>
          <div className={styles.inputContainer}>
            <label className="input-label">Din Kültürü</label>
            <input type="number" name="ayt_din" className="input-field" value={netler.ayt_din} onChange={handleChange} step="0.25" min="-1.5" max="6" />
          </div>
        </div>

        <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
          Yerleştirme Puanını ve Sıralamayı Hesapla
        </button>
      </form>
    </div>
  );
}
