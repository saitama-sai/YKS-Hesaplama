'use client';
import { useState, useEffect } from 'react';
import styles from './ProfessionSidebar.module.css';

export default function ProfessionSidebar({ onSelectProfession, selectedProfession }) {
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    fetch('/api/professions')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProfessions(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Bölümler yüklenirken hata oluştu:', err);
        setLoading(false);
      });
  }, []);

  const filteredProfessions = professions.filter(p => 
    p.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <aside className={`glass-panel ${styles.sidebar}`}>
      <h3 className={styles.title}>Bölümler (A-Z)</h3>
      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Bölüm filtrele..." 
          className="input-field"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      
      <div className={styles.listContainer}>
        {loading ? (
          <div className={styles.loading}>Yükleniyor...</div>
        ) : (
          <ul className={styles.professionList}>
            <li>
              <button 
                className={`${styles.professionBtn} ${selectedProfession === '' ? styles.active : ''}`}
                onClick={() => onSelectProfession('')}
              >
                Tüm Bölümler
              </button>
            </li>
            {filteredProfessions.map((prof, idx) => (
              <li key={idx}>
                <button 
                  className={`${styles.professionBtn} ${selectedProfession === prof ? styles.active : ''}`}
                  onClick={() => onSelectProfession(prof)}
                  title={prof}
                >
                  {prof}
                </button>
              </li>
            ))}
            {filteredProfessions.length === 0 && !loading && (
              <li className={styles.noResult}>Sonuç bulunamadı</li>
            )}
          </ul>
        )}
      </div>
    </aside>
  );
}
