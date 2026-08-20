'use client';
import { useState } from 'react';
import ScoreCalculator from '@/components/ScoreCalculator';

export default function Hesapla() {
  const [calculatedScore, setCalculatedScore] = useState(0);

  const handleScoreCalculation = (score) => {
    setCalculatedScore(score);
  };

  return (
    <main className="container">
      <div style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <h1 className="page-title">
          YKS Puanını Hesapla
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '50px', fontSize: '1.1rem' }}>
          Netlerinizi girerek tahmini YKS puanınızı öğrenebilirsiniz.
        </p>

        <ScoreCalculator onCalculate={handleScoreCalculation} />

        {calculatedScore && calculatedScore.SAY && (
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem' }}>Hesaplama Sonuçları</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              
              {/* TYT Kartı */}
              <div className="glass-panel" style={{ padding: '25px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--text-muted)' }}>TYT (Y-TYT)</h3>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>
                  {calculatedScore.TYT?.puan || '-'}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', marginTop: '10px' }}>
                  {calculatedScore.TYT?.siralama ? calculatedScore.TYT.siralama.toLocaleString('tr-TR') : '-'}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px' }}>Tahmini Sıralama</div>
              </div>

              {/* Sayısal Kartı */}
              <div className="glass-panel" style={{ padding: '25px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--text-muted)' }}>SAYISAL (Y-SAY)</h3>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>
                  {calculatedScore.SAY.puan}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', marginTop: '10px' }}>
                  {calculatedScore.SAY.siralama ? calculatedScore.SAY.siralama.toLocaleString('tr-TR') : '-'}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px' }}>Tahmini Sıralama</div>
              </div>

              {/* Eşit Ağırlık Kartı */}
              <div className="glass-panel" style={{ padding: '25px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--text-muted)' }}>EŞİT AĞIRLIK (Y-EA)</h3>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>
                  {calculatedScore.EA.puan}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', marginTop: '10px' }}>
                  {calculatedScore.EA.siralama ? calculatedScore.EA.siralama.toLocaleString('tr-TR') : '-'}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px' }}>Tahmini Sıralama</div>
              </div>

              {/* Sözel Kartı */}
              <div className="glass-panel" style={{ padding: '25px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: 'var(--text-muted)' }}>SÖZEL (Y-SÖZ)</h3>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>
                  {calculatedScore.SOZ.puan}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', marginTop: '10px' }}>
                  {calculatedScore.SOZ.siralama ? calculatedScore.SOZ.siralama.toLocaleString('tr-TR') : '-'}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px' }}>Tahmini Sıralama</div>
              </div>

            </div>
            
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '30px' }}>
              Bu puan ve sıralamalar ile "Bölüm Sıralamaları" sekmesinden size uygun üniversiteleri inceleyebilirsiniz.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
