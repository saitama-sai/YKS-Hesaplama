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
        <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '2.5rem' }}>
          YKS Puanını Hesapla
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '50px', fontSize: '1.1rem' }}>
          Netlerinizi girerek tahmini YKS puanınızı öğrenebilirsiniz.
        </p>

        <ScoreCalculator onCalculate={handleScoreCalculation} />

        {calculatedScore && calculatedScore.puan > 0 && (
          <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', marginTop: '40px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Yerleştirme Puanı (OBP Dahil)</h2>
            <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--success)' }}>
              {calculatedScore.puan}
            </div>
            
            <h2 style={{ fontSize: '1.5rem', marginTop: '20px', marginBottom: '10px' }}>Tahmini Başarı Sırası (Y-SAY)</h2>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>
              {calculatedScore.siralama ? calculatedScore.siralama.toLocaleString('tr-TR') : '-'}
            </div>

            <p style={{ color: 'var(--text-muted)', marginTop: '20px' }}>
              Bu puan ve sıralama ile "Bölüm Sıralamaları" sekmesinden size uygun üniversiteleri inceleyebilirsiniz.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
