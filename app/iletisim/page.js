'use client';

export default function IletisimPage() {
  return (
    <main className="container" style={{ paddingTop: '60px', paddingBottom: '60px', maxWidth: '800px' }}>
      <div className="glass-panel" style={{ padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
        <h1 className="page-title" style={{ marginBottom: '20px' }}>İletişim</h1>
        
        <div style={{ color: 'var(--text-main)', lineHeight: '1.7', fontSize: '1.1rem', marginBottom: '30px' }}>
          <p>
            Platformla ilgili geri bildirimleriniz, önerileriniz veya iş birlikleri için benimle LinkedIn üzerinden iletişime geçebilirsiniz.
          </p>
        </div>

        <a 
          href="https://www.linkedin.com/in/sait-kavako%C4%9Flu-617719289/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ display: 'inline-block', fontSize: '1.1rem', padding: '12px 24px', backgroundColor: '#0077b5', border: 'none' }}
        >
          LinkedIn Profilim
        </a>
      </div>
    </main>
  );
}
