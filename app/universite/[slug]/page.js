import { getUniqueUniversities, getVeriler } from '@/utils/data';
import Link from 'next/link';

export async function generateStaticParams() {
  const universities = getUniqueUniversities();
  return universities.map((uni) => ({
    slug: uni.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const universities = getUniqueUniversities();
  const university = universities.find(u => u.slug === slug);
  
  const title = university ? `${university.name} 2026 Taban Puanları ve Başarı Sıralamaları` : 'Üniversite Bulunamadı';
  
  return {
    title,
    description: `2026 YKS güncel ${university?.name || ''} taban puanları, başarı sıralamaları ve kontenjan bilgileri detaylı tablosu.`,
    alternates: {
      canonical: `https://yks-hesaplama.vercel.app/universite/${slug}`,
    }
  };
}

export default async function UniversityPage({ params }) {
  const { slug } = await params;
  const universities = getUniqueUniversities();
  const university = universities.find(u => u.slug === slug);

  if (!university) {
    return (
      <main className="container">
        <div style={{ paddingTop: '60px', textAlign: 'center' }}>
          <h1 className="page-title">Üniversite Bulunamadı</h1>
          <Link href="/" className="btn-primary">Anasayfaya Dön</Link>
        </div>
      </main>
    );
  }

  const allData = getVeriler();
  // Filter departments for this university
  const departments = allData
    .filter(item => item.uni === university.name)
    .sort((a, b) => (parseFloat(b.puan) || 0) - (parseFloat(a.puan) || 0));

  return (
    <main className="container" style={{ maxWidth: '1400px' }}>
      <div style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        <h1 className="page-title" style={{ fontSize: '2rem', color: 'var(--primary)' }}>
          {university.name}
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1.1rem' }}>
          2026 Yılı Güncel Taban Puanları ve Başarı Sıralamaları
        </p>

        <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '16px' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '16px', fontWeight: '600' }}>Bölüm</th>
                <th style={{ padding: '16px', fontWeight: '600', width: '100px' }}>Puan Türü</th>
                <th style={{ padding: '16px', fontWeight: '600', width: '120px' }}>Kontenjan</th>
                <th style={{ padding: '16px', fontWeight: '600', width: '150px' }}>Taban Puan</th>
                <th style={{ padding: '16px', fontWeight: '600', width: '150px' }}>Başarı Sırası</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease' }}>
                  <td style={{ padding: '16px', color: 'var(--text-main)', fontWeight: '500' }}>
                    {dept.bolum}
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
                      {dept.puanTuru || '-'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{dept.kontenjan || '-'}</td>
                  <td style={{ padding: '16px', color: 'var(--success)', fontWeight: '600' }}>{dept.puan || '-'}</td>
                  <td style={{ padding: '16px', color: 'var(--text-main)', fontWeight: '600' }}>
                    {dept.siralama ? dept.siralama.toLocaleString('tr-TR') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
