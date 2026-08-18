'use client';
import { useState } from 'react';
import UniversityList from '@/components/UniversityList';
import ProfessionSidebar from '@/components/ProfessionSidebar';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('Bilgisayar');
  const [inputValue, setInputValue] = useState('Bilgisayar');

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(inputValue);
  };

  const handleProfessionSelect = (prof) => {
    setInputValue(prof);
    setSearchTerm(prof);
  };

  return (
    <main className="container" style={{ maxWidth: '1400px' }}>
      <div style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '2.5rem' }}>
          Üniversite ve Bölüm Sıralamaları
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px', fontSize: '1.1rem' }}>
          A'dan Z'ye bölümleri seçin veya arama yapın.
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Örn: Yazılım Mühendisliği, Hukuk, Koç Üniversitesi..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
            Ara
          </button>
        </form>
        
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0 }}>
            <ProfessionSidebar 
              selectedProfession={searchTerm} 
              onSelectProfession={handleProfessionSelect} 
            />
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <UniversityList searchTerm={searchTerm} />
          </div>
        </div>

      </div>
    </main>
  );
}
