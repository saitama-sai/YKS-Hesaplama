'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Target, Search, CheckCircle2 } from 'lucide-react';

export default function HedefNetPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [targetUni, setTargetUni] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simülasyon State
  const [obp, setObp] = useState(85);
  const [tytNet, setTytNet] = useState(50);
  const [aytNet, setAytNet] = useState(30);

  // Arama İşlemi
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setLoading(true);
        try {
          const res = await fetch(`/api/universities?query=${encodeURIComponent(searchTerm)}&limit=10`);
          const data = await res.json();
          setSearchResults(data.data || []);
        } catch (e) {
          console.error(e);
        }
        setLoading(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const selectTarget = (uni) => {
    setTargetUni(uni);
    setSearchTerm('');
    setSearchResults([]);
  };

  // Puan Hesaplama (Yaklaşık Formül: 100 Taban + TYT*1.333 + AYT*3 + OBP*0.6)
  const currentScore = 100 + (tytNet * 1.3333) + (aytNet * 3) + (obp * 0.6);
  const targetScore = targetUni ? parseFloat(targetUni.puan) : 0;
  
  const diff = targetScore - currentScore;
  const isReached = currentScore >= targetScore;
  const progress = targetScore > 0 ? Math.min((currentScore / targetScore) * 100, 100) : 0;

  return (
    <main className="container" style={{ maxWidth: '900px', padding: '40px 20px', minHeight: '100vh' }}>
      <Head>
        <title>Hedef Net Sihirbazı | YKS Rehberim</title>
        <meta name="description" content="Hayalinizdeki üniversite bölümünü seçin, kazanmak için kaç TYT ve AYT netine ihtiyacınız olduğunu simüle edin." />
      </Head>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
          <Target size={36} color="var(--primary)" />
          Hedef Net Sihirbazı
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '10px' }}>
          Kazanmak istediğin bölümü seç, kaç net yapman gerektiğini öğren.
        </p>
      </div>

      <div className="glass-panel" style={{ marginBottom: '30px', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>1. Hedefini Seç</h2>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0 15px' }}>
            <Search size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Üniversite veya bölüm ara... (Örn: Boğaziçi Bilgisayar)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '15px', outline: 'none' }}
            />
          </div>
          
          {loading && <div style={{ position: 'absolute', top: '100%', right: '15px', marginTop: '10px', color: 'var(--primary)' }}>Aranıyor...</div>}
          
          {searchResults.length > 0 && (
            <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1e1e2d', border: '1px solid #333', borderRadius: '8px', marginTop: '5px', maxHeight: '300px', overflowY: 'auto', listStyle: 'none', padding: 0, zIndex: 20 }}>
              {searchResults.map(uni => (
                <li key={uni.id} onClick={() => selectTarget(uni)} style={{ padding: '15px', borderBottom: '1px solid #333', cursor: 'pointer', transition: 'background 0.2s' }} className="hover-result">
                  <div style={{ fontWeight: 'bold' }}>{uni.uni}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{uni.bolum} • {uni.puanTuru} • Puan: {uni.puan}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {targetUni && (
          <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid var(--primary)' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Seçilen Hedef</div>
            <h3 style={{ margin: '0 0 5px 0', color: 'var(--text-main)' }}>{targetUni.uni}</h3>
            <div style={{ color: 'var(--primary-light)', fontWeight: 'bold' }}>{targetUni.bolum}</div>
            <div style={{ marginTop: '10px', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
              Taban Puan: {targetUni.puan}
            </div>
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ opacity: targetUni ? 1 : 0.5, pointerEvents: targetUni ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '30px' }}>2. Net Simülasyonu</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label>Diploma Notu (OBP)</label>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{obp}</span>
            </div>
            <input type="range" min="50" max="100" value={obp} onChange={(e) => setObp(Number(e.target.value))} className="custom-slider" />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label>TYT Neti (Max 120)</label>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{tytNet}</span>
            </div>
            <input type="range" min="0" max="120" step="0.25" value={tytNet} onChange={(e) => setTytNet(Number(e.target.value))} className="custom-slider" />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label>AYT Neti (Max 80)</label>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{aytNet}</span>
            </div>
            <input type="range" min="0" max="80" step="0.25" value={aytNet} onChange={(e) => setAytNet(Number(e.target.value))} className="custom-slider" />
          </div>
        </div>

        <div style={{ padding: '30px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ marginBottom: '15px', color: 'var(--text-muted)' }}>Tahmini Puanınız</div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: isReached ? 'var(--success)' : 'var(--text-main)', marginBottom: '20px' }}>
            {currentScore.toFixed(2)}
          </div>

          <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden', marginBottom: '15px' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: isReached ? 'var(--success)' : 'var(--primary)', transition: 'width 0.3s ease, background 0.3s' }}></div>
          </div>

          {isReached ? (
            <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <CheckCircle2 size={24} />
              Tebrikler! Hedefinize ulaştınız.
            </div>
          ) : (
            <div style={{ color: 'var(--danger)', fontSize: '1.1rem' }}>
              Hedefinize ulaşmak için <strong style={{ fontSize: '1.3rem' }}>{diff.toFixed(2)}</strong> puana daha ihtiyacınız var.
            </div>
          )}
        </div>
      </div>

      <style>{`
        .hover-result:hover { background: rgba(99, 102, 241, 0.2); }
        .custom-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: rgba(255,255,255,0.1);
          outline: none;
        }
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
