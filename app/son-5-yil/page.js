'use client';

import { useState, useEffect } from 'react';
import styles from './Son5Yil.module.css';

export default function Son5YilPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (query = '', pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/historical?query=${encodeURIComponent(query)}&page=${pageNum}&limit=50`);
      const result = await res.json();
      setData(result.data || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error('Veri çekilirken hata oluştu', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData('', 1);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData(searchTerm, 1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      fetchData(searchTerm, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatRank = (rank) => {
    if (rank === null || rank === undefined) return '-';
    return rank.toLocaleString('tr-TR');
  };

  return (
    <main className="container" style={{ paddingTop: '40px', paddingBottom: '60px', maxWidth: '1400px' }}>
      <h1 className="page-title">Son 5 Yıl Başarı Sıralaması</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px', fontSize: '1.1rem' }}>
        Üniversite bölümlerinin 2022'den günümüze kadarki başarı sıralaması geçmişini inceleyin.
      </p>

      <form onSubmit={handleSearch} className="search-container" style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="Üniversite veya bölüm ara... (Örn: Boğaziçi Bilgisayar)" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn-primary">Ara</button>
      </form>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Yükleniyor...</div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Sonuç bulunamadı.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Üniversite</th>
                <th style={{ width: '25%' }}>Bölüm</th>
                <th>Tür</th>
                <th>2022</th>
                <th>2023</th>
                <th>2024</th>
                <th>2025</th>
                <th className={styles.currentYear}>2026</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className={styles.uniName}>{item.uni}</td>
                  <td className={styles.bolumName}>{item.bolum}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{item.puanTuru}</td>
                  <td>{formatRank(item.history["2022"])}</td>
                  <td>{formatRank(item.history["2023"])}</td>
                  <td>{formatRank(item.history["2024"])}</td>
                  <td>{formatRank(item.history["2025"])}</td>
                  <td className={styles.currentYearValue}>{formatRank(item.history["2026"])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination" style={{ marginTop: '30px' }}>
          <button 
            className="btn-primary" 
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || loading}
            style={{ opacity: page === 1 ? 0.5 : 1 }}
          >
            Önceki
          </button>
          <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>
            Sayfa {page} / {totalPages}
          </span>
          <button 
            className="btn-primary" 
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || loading}
            style={{ opacity: page === totalPages ? 0.5 : 1 }}
          >
            Sonraki
          </button>
        </div>
      )}
    </main>
  );
}
