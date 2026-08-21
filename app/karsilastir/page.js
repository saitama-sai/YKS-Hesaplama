'use client';

import { useCompare } from '@/context/CompareContext';
import Link from 'next/link';
import styles from './Karsilastir.module.css';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (!compareList || compareList.length === 0) {
    return (
      <main className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h1 className="page-title">Bölüm Karşılaştırma</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '30px' }}>
          Henüz karşılaştırmak için bir bölüm eklemediniz.
        </p>
        <Link href="/" className="btn-primary">
          Bölüm Ara & Ekle
        </Link>
      </main>
    );
  }

  // Row definitions for what to compare
  const rows = [
    { label: 'Üniversite', key: 'uni' },
    { label: 'Bölüm', key: 'bolum' },
    { label: 'Puan Türü', key: 'puanTuru' },
    { label: 'Başarı Sırası', key: 'siralama', format: (val) => val ? val.toLocaleString('tr-TR') : '-' },
    { label: 'Taban Puan', key: 'puan', format: (val) => val ? parseFloat(val).toFixed(2) : '-' },
    { label: 'Kontenjan', key: 'kontenjan' },
    { label: 'Üniversite Türü', key: 'tur', format: (val) => val === 'Devlet' ? 'Devlet' : 'Vakıf / Kıbrıs' }, // basic approximation
  ];

  return (
    <main className="container" style={{ padding: '40px 20px', maxWidth: '1400px' }}>
      <div className={styles.header}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Bölüm Karşılaştırma</h1>
        <button onClick={clearCompare} className="btn-primary" style={{ backgroundColor: 'var(--danger)' }}>
          Listeyi Temizle
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.compareTable}>
          <thead>
            <tr>
              <th className={styles.labelCol}>Özellik</th>
              {compareList.map((item, idx) => (
                <th key={idx} className={styles.itemCol}>
                  <div className={styles.thContent}>
                    <span className={styles.thTitle}>{item.uni}</span>
                    <button onClick={() => removeFromCompare(item.id)} className={styles.removeBtn} title="Çıkar">
                      X
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td className={styles.labelCell}>{row.label}</td>
                {compareList.map((item, colIdx) => (
                  <td key={colIdx} className={styles.valueCell}>
                    {row.format ? row.format(item[row.key]) : (item[row.key] || '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Link href="/" className="btn-primary">
          Daha Fazla Bölüm Ekle
        </Link>
      </div>
    </main>
  );
}
