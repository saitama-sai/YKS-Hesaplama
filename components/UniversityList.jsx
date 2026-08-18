'use client';
import { useState, useEffect } from 'react';
import styles from './UniversityList.module.css';

import AdBanner from './AdBanner';

export default function UniversityList({ searchTerm }) {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchUniversities = async (query, pageNum, reset = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/universities?query=${encodeURIComponent(query)}&page=${pageNum}&limit=50`);
      const data = await res.json();
      
      if (reset) {
        setUniversities(data.data);
      } else {
        setUniversities(prev => [...prev, ...data.data]);
      }
      
      setHasMore(data.page < data.totalPages);
    } catch (error) {
      console.error('Veri çekilemedi:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchUniversities(searchTerm, 1, true);
  }, [searchTerm]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUniversities(searchTerm, nextPage, false);
  };

  return (
    <div className={styles.listContainer}>
      <h3 className={styles.title}>
        "{searchTerm}" İçin Sonuçlar (En Yüksek Puandan En Düşüğe)
      </h3>

      <div className={styles.grid}>
        {universities.map((uni, index) => (
          <div key={uni.id || index}>
            <div className={`glass-panel ${styles.uniCard}`}>
              <div className={styles.logoPlaceholder}>
                {uni.uni.substring(0, 1)}
              </div>

              <div className={styles.infoCol}>
                <h4 className={styles.uniName}>{uni.uni}</h4>
                <p className={styles.department}>{uni.bolum}</p>
                <div className={styles.details}>
                  <span className={styles.tag}>{uni.puanTuru || '-'}</span>
                  <span className={styles.tag}>Kontenjan: {uni.kontenjan || '-'}</span>
                </div>
              </div>
              
              <div className={styles.scoreCol}>
                <div className={styles.statBox}>
                  <span className={styles.scoreLabel}>Başarı Sırası (ÖSYM)</span>
                  <span className={styles.scoreValue}>
                    {uni.siralama ? uni.siralama.toLocaleString('tr-TR') : '-'}
                  </span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.scoreLabel}>Taban Puan</span>
                  <span className={styles.scoreValue}>
                    {uni.puan ? parseFloat(uni.puan).toFixed(2) : '-'}
                  </span>
                </div>
              </div>
            </div>
            {/* Show an ad banner every 10 results */}
            {(index + 1) % 10 === 0 && <AdBanner />}
          </div>
        ))}
        {universities.length === 0 && !loading && (
          <div className={styles.emptyState}>
            Kayıt bulunamadı. Lütfen başka bir bölüm arayın.
          </div>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--primary)' }}>
          Yükleniyor...
        </div>
      )}

      {hasMore && !loading && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button onClick={loadMore} className="btn-primary">
            Daha Fazla Göster
          </button>
        </div>
      )}
    </div>
  );
}
