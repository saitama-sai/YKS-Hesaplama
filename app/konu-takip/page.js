'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { CheckCircle2, Circle, BookOpen, GraduationCap } from 'lucide-react';

const KONULAR = {
  TYT: {
    'Türkçe': [
      'Sözcükte Anlam', 'Cümlede Anlam', 'Paragrafta Anlam', 'Ses Bilgisi',
      'Yazım Kuralları', 'Noktalama İşaretleri', 'Sözcük Türleri', 'Cümle Ögeleri', 'Fiiller'
    ],
    'Matematik': [
      'Temel Kavramlar', 'Sayı Basamakları', 'Bölünebilme', 'EBOB-EKOK', 
      'Rasyonel Sayılar', 'Basit Eşitsizlikler', 'Mutlak Değer', 'Üslü Sayılar', 
      'Köklü Sayılar', 'Çarpanlara Ayırma', 'Oran Orantı', 'Problemler'
    ],
    'Geometri': [
      'Doğruda ve Üçgende Açılar', 'Dik ve Özel Üçgenler', 'Dik Üçgende Trigonometrik Bağıntılar', 
      'Üçgende Alan', 'Çokgenler ve Dörtgenler', 'Çember ve Daire', 'Katı Cisimler'
    ],
    'Fizik': [
      'Fizik Bilimine Giriş', 'Madde ve Özellikleri', 'Hareket ve Kuvvet', 
      'İş, Güç ve Enerji', 'Isı ve Sıcaklık', 'Basınç ve Kaldırma Kuvveti', 'Optik'
    ],
    'Kimya': [
      'Kimya Bilimi', 'Atom ve Periyodik Sistem', 'Kimyasal Türler Arası Etkileşimler', 
      'Maddenin Halleri', 'Doğa ve Kimya', 'Kimya Her Yerde', 'Karışımlar'
    ],
    'Biyoloji': [
      'Yaşam Bilimi Biyoloji', 'Hücre', 'Canlılar Dünyası', 'Hücre Bölünmeleri', 
      'Kalıtım', 'Ekosistem Ekolojisi'
    ]
  },
  AYT: {
    'Matematik': [
      'Polinomlar', '2. Dereceden Denklemler', 'Karmaşık Sayılar', 'Eşitsizlikler',
      'Logaritma', 'Diziler', 'Trigonometri', 'Limit', 'Türev', 'İntegral'
    ],
    'Fizik': [
      'Vektörler', 'Bağıl Hareket', 'Newton’un Hareket Yasaları', 'Bir Boyutta Sabit İvmeli Hareket',
      'Atışlar', 'İtme ve Çizgisel Momentum', 'Denge ve Tork', 'Basit Makineler',
      'Elektrik ve Manyetizma'
    ],
    'Kimya': [
      'Kuantum Modeli', 'Gazlar', 'Sıvı Çözeltiler', 'Kimyasal Tepkimelerde Enerji',
      'Kimyasal Tepkimelerde Hız', 'Kimyasal Denge', 'Asit-Baz Dengesi', 'Kimya ve Elektrik', 'Organik Kimya'
    ],
    'Biyoloji': [
      'Sinir Sistemi', 'Endokrin Sistem', 'Duyu Organları', 'Destek ve Hareket Sistemi',
      'Sindirim Sistemi', 'Dolaşım Sistemi', 'Solunum Sistemi', 'Boşaltım Sistemi', 'Bitki Biyolojisi'
    ]
  }
};

export default function KonuTakipPage() {
  const [completed, setCompleted] = useState({});
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('TYT'); // TYT veya AYT

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('yks_konular');
    if (saved) {
      try {
        setCompleted(JSON.parse(saved));
      } catch (e) {
        console.error('Veri okunurken hata', e);
      }
    }
  }, []);

  const toggleKonu = (exam, subject, topic) => {
    const key = `${exam}-${subject}-${topic}`;
    const newCompleted = { ...completed, [key]: !completed[key] };
    setCompleted(newCompleted);
    localStorage.setItem('yks_konular', JSON.stringify(newCompleted));
  };

  const calculateProgress = (exam, subject) => {
    const topics = KONULAR[exam][subject];
    const total = topics.length;
    const finished = topics.filter(t => completed[`${exam}-${subject}-${t}`]).length;
    return { finished, total, percentage: Math.round((finished / total) * 100) };
  };

  if (!isClient) return <div style={{ minHeight: '100vh' }}></div>;

  return (
    <main className="container" style={{ maxWidth: '1200px', padding: '40px 20px', minHeight: '100vh' }}>
      <Head>
        <title>YKS Konu Takip Çizelgesi | YKS Rehberim</title>
        <meta name="description" content="TYT ve AYT konularını takip edin, ilerlemenizi yüzde olarak görün." />
      </Head>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
          <BookOpen size={36} color="var(--primary)" />
          YKS Konu Takip Çizelgesi
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '10px' }}>
          Çalıştığın konuları işaretle, YKS müfredatında yüzde kaç ilerlediğini anlık olarak gör.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
        <button 
          onClick={() => setActiveTab('TYT')}
          className="btn-primary" 
          style={{ background: activeTab === 'TYT' ? 'var(--primary)' : 'rgba(255,255,255,0.1)', minWidth: '150px' }}
        >
          TYT Konuları
        </button>
        <button 
          onClick={() => setActiveTab('AYT')}
          className="btn-primary" 
          style={{ background: activeTab === 'AYT' ? 'var(--primary)' : 'rgba(255,255,255,0.1)', minWidth: '150px' }}
        >
          AYT Konuları
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {Object.entries(KONULAR[activeTab]).map(([subject, topics]) => {
          const progress = calculateProgress(activeTab, subject);
          return (
            <div key={subject} className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{subject}</h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                  %{progress.percentage}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '20px', overflow: 'hidden' }}>
                <div style={{ width: `${progress.percentage}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }}></div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, overflowY: 'auto', maxHeight: '250px' }} className="custom-scrollbar">
                {topics.map((topic) => {
                  const isChecked = completed[`${activeTab}-${subject}-${topic}`];
                  return (
                    <li 
                      key={topic} 
                      onClick={() => toggleKonu(activeTab, subject, topic)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        padding: '10px', 
                        cursor: 'pointer',
                        borderRadius: '6px',
                        transition: 'background 0.2s',
                        background: isChecked ? 'rgba(99, 102, 241, 0.05)' : 'transparent'
                      }}
                      className="hover-bg"
                    >
                      {isChecked ? <CheckCircle2 size={20} color="var(--primary)" /> : <Circle size={20} color="var(--text-muted)" />}
                      <span style={{ color: isChecked ? 'var(--text-main)' : 'var(--text-muted)', textDecoration: isChecked ? 'line-through' : 'none' }}>
                        {topic}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <style>{`
        .hover-bg:hover {
          background: rgba(255,255,255,0.05) !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
        }
      `}</style>
    </main>
  );
}
