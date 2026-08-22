'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trash2, Plus, TrendingUp } from 'lucide-react';
import Head from 'next/head';

export default function DenemeTakipPage() {
  const [denemeler, setDenemeler] = useState([]);
  const [isClient, setIsClient] = useState(false);
  
  // Form State
  const [isim, setIsim] = useState('');
  const [tytNet, setTytNet] = useState('');
  const [aytNet, setAytNet] = useState('');

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('yks_denemeler');
    if (saved) {
      try {
        setDenemeler(JSON.parse(saved));
      } catch (e) {
        console.error('Veri okunurken hata', e);
      }
    }
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!isim || (!tytNet && !aytNet)) return;

    const yeniDeneme = {
      id: Date.now().toString(),
      isim,
      tytNet: tytNet ? parseFloat(tytNet) : null,
      aytNet: aytNet ? parseFloat(aytNet) : null,
      tarih: new Date().toLocaleDateString('tr-TR')
    };

    const guncel = [...denemeler, yeniDeneme];
    setDenemeler(guncel);
    localStorage.setItem('yks_denemeler', JSON.stringify(guncel));
    
    setIsim('');
    setTytNet('');
    setAytNet('');
  };

  const handleDelete = (id) => {
    const guncel = denemeler.filter(d => d.id !== id);
    setDenemeler(guncel);
    localStorage.setItem('yks_denemeler', JSON.stringify(guncel));
  };

  if (!isClient) return <div style={{ minHeight: '100vh' }}></div>;

  return (
    <main className="container" style={{ maxWidth: '1200px', padding: '40px 20px', minHeight: '100vh' }}>
      <Head>
        <title>TYT & AYT Deneme Takip ve Analiz Grafiği | YKS Rehberim</title>
        <meta name="description" content="YKS (TYT ve AYT) deneme sınavı netlerinizi kaydedin, gelişim grafiğinizi oluşturun ve sınava kadarki performansınızı analiz edin." />
      </Head>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
          <TrendingUp size={36} color="var(--primary)" />
          Deneme Sınavı Takip Sistemi
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '10px' }}>
          Girdiğiniz her denemeyi buraya ekleyerek yıl sonuna kadar netlerinizin gelişimini grafiksel olarak takip edin.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }} className="responsive-grid-takip">
        
        {/* Form Alanı */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.25rem', color: 'var(--text-main)' }}>Yeni Deneme Ekle</h2>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Deneme Adı / Yayın</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Örn: 3D Yayınları TYT 1" 
                value={isim}
                onChange={(e) => setIsim(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>TYT Neti</label>
                <input 
                  type="number" 
                  step="0.25"
                  className="input-field" 
                  placeholder="Örn: 75.5" 
                  value={tytNet}
                  onChange={(e) => setTytNet(e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>AYT Neti</label>
                <input 
                  type="number" 
                  step="0.25"
                  className="input-field" 
                  placeholder="Örn: 45" 
                  value={aytNet}
                  onChange={(e) => setAytNet(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <Plus size={20} /> Kaydet ve Grafiği Güncelle
            </button>
          </form>

          {/* Geçmiş Denemeler Listesi */}
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Son Eklenenler</h3>
            {denemeler.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Henüz hiç deneme eklemediniz.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                {[...denemeler].reverse().map(d => (
                  <li key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem' }}>{d.isim}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.tarih} • {d.tytNet ? `TYT: ${d.tytNet}` : ''} {d.aytNet ? `AYT: ${d.aytNet}` : ''}</span>
                    </div>
                    <button onClick={() => handleDelete(d.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '5px' }} title="Sil">
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Grafik Alanı */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.25rem', color: 'var(--text-main)' }}>Gelişim Analizi</h2>
          
          <div style={{ flex: 1, minHeight: '400px', width: '100%' }}>
            {denemeler.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={denemeler} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="isim" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} domain={[0, 120]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e1e2d', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" name="TYT Net" dataKey="tytNet" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} activeDot={{ r: 8 }} />
                  <Line type="monotone" name="AYT Net" dataKey="aytNet" stroke="#ec4899" strokeWidth={3} dot={{ r: 5, fill: '#ec4899' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                Grafik oluşturulması için sol taraftan deneme ekleyin.
              </div>
            )}
          </div>
        </div>

      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .responsive-grid-takip {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
