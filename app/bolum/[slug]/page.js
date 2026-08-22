import { getUniqueProfessions, getVeriler } from '@/utils/data';
import Link from 'next/link';
import { slugify } from '@/utils/slugify';

export async function generateStaticParams() {
  const professions = getUniqueProfessions();
  return professions.map((prof) => ({
    slug: prof.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const professions = getUniqueProfessions();
  const profession = professions.find(p => p.slug === slug);
  
  const title = profession ? `${profession.name} 2026 Taban Puanları ve Sıralama` : 'Bölüm Bulunamadı';
  
  return {
    title,
    description: `2026 YKS güncel ${profession?.name || ''} bölümü üniversite taban puanları, başarı sıralamaları ve kontenjanları.`,
    alternates: {
      canonical: `https://yks-hesaplama.vercel.app/bolum/${slug}`,
    }
  };
}

export default async function ProfessionPage({ params }) {
  const { slug } = await params;
  const professions = getUniqueProfessions();
  const profession = professions.find(p => p.slug === slug);

  if (!profession) {
    return (
      <main className="container">
        <div style={{ paddingTop: '60px', textAlign: 'center' }}>
          <h1 className="page-title">Bölüm Bulunamadı</h1>
          <Link href="/" className="btn-primary">Anasayfaya Dön</Link>
        </div>
      </main>
    );
  }

  const allData = getVeriler();
  // Filter all entries that match this base profession name
  const universitiesOffering = allData
    .filter(item => item.bolum && item.bolum.replace(/\(.*\)/g, '').trim() === profession.name)
    .sort((a, b) => (parseFloat(b.puan) || 0) - (parseFloat(a.puan) || 0));

  return (
    <main className="container" style={{ maxWidth: '1400px' }}>
      <div style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        <h1 className="page-title" style={{ fontSize: '2.2rem', color: 'var(--primary)' }}>
          {profession.name} Taban Puanları ve Sıralamaları
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1.1rem' }}>
          2026 YKS güncel {profession.name} bölümü olan üniversiteler listesi.
        </p>

        <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '16px' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px', fontWeight: '600' }}>Üniversite</th>
                <th style={{ padding: '16px', fontWeight: '600' }}>Bölüm Detayı</th>
                <th style={{ padding: '16px', fontWeight: '600', width: '100px' }}>Puan Türü</th>
                <th style={{ padding: '16px', fontWeight: '600', width: '120px' }}>Kontenjan</th>
                <th style={{ padding: '16px', fontWeight: '600', width: '150px' }}>Taban Puan</th>
                <th style={{ padding: '16px', fontWeight: '600', width: '150px' }}>Başarı Sırası</th>
              </tr>
            </thead>
            <tbody>
              {universitiesOffering.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease' }}>
                  <td style={{ padding: '16px', fontWeight: '600' }}>
                    <Link href={`/universite/${slugify(item.uni)}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }} className="hover-underline">
                      {item.uni}
                    </Link>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                    {item.bolum}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      background: 'rgba(99, 102, 241, 0.1)', 
                      color: 'var(--primary)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      {item.puanTuru || '-'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{item.kontenjan || '-'}</td>
                  <td style={{ padding: '16px', color: 'var(--success)', fontWeight: '600' }}>{item.puan || '-'}</td>
                  <td style={{ padding: '16px', color: 'var(--text-main)', fontWeight: '600' }}>
                    {item.siralama ? item.siralama.toLocaleString('tr-TR') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .hover-underline:hover {
          text-decoration: underline;
          color: var(--primary);
        }
      `}</style>
    </main>
  );
}
