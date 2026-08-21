'use client';

import { useState, useEffect } from 'react';
import UniversityList from '@/components/UniversityList';
import styles from './Harmanla.module.css';

export default function HarmanlaPage() {
  const [professions, setProfessions] = useState([]);
  const [selectedProfessions, setSelectedProfessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch all professions on mount
  useEffect(() => {
    fetch('/api/professions')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProfessions(data.data);
        }
      });
  }, []);

  const addProfession = (prof) => {
    if (!selectedProfessions.includes(prof)) {
      setSelectedProfessions([...selectedProfessions, prof]);
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const removeProfession = (prof) => {
    setSelectedProfessions(selectedProfessions.filter(p => p !== prof));
  };

  const filteredProfessions = professions.filter(p => 
    p.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR')) &&
    !selectedProfessions.includes(p)
  );

  return (
    <main className="container" style={{ paddingTop: '40px', paddingBottom: '60px', maxWidth: '1400px' }}>
      <h1 className="page-title">Bölüm Harmanla</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px', fontSize: '1.1rem' }}>
        Farklı bölümleri tek bir listede sıralayarak kıyaslayın (Örn: Uçak Mühendisliği ve Havacılık Uzay).
      </p>

      <div className={styles.blendContainer}>
        <div className={styles.inputWrapper}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Bölüm Ara & Ekle..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />
          {showDropdown && searchTerm.length > 1 && (
            <div className={styles.dropdown}>
              {filteredProfessions.length > 0 ? (
                filteredProfessions.map(prof => (
                  <div 
                    key={prof} 
                    className={styles.dropdownItem}
                    onClick={() => addProfession(prof)}
                  >
                    {prof}
                  </div>
                ))
              ) : (
                <div className={styles.dropdownItem} style={{ color: 'var(--text-muted)' }}>
                  Sonuç bulunamadı
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.selectedTags}>
          {selectedProfessions.map(prof => (
            <div key={prof} className={styles.tag}>
              <span>{prof}</span>
              <button onClick={() => removeProfession(prof)} className={styles.tagRemove}>X</button>
            </div>
          ))}
        </div>
      </div>

      {selectedProfessions.length > 0 ? (
        <div style={{ marginTop: '40px' }}>
          {/* We pass a comma-separated query. The API handles it! */}
          <UniversityList searchTerm={selectedProfessions.join(', ')} />
        </div>
      ) : (
        <div className={styles.emptyState}>
          Lütfen listelemek istediğiniz bölümleri yukarıdan seçin.
        </div>
      )}
    </main>
  );
}
