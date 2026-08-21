'use client';

export default function HakkimizdaPage() {
  return (
    <main className="container" style={{ paddingTop: '60px', paddingBottom: '60px', maxWidth: '800px' }}>
      <div className="glass-panel" style={{ padding: '40px', borderRadius: '16px' }}>
        <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '24px' }}>Hakkımızda</h1>
        
        <div style={{ color: 'var(--text-main)', lineHeight: '1.7', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p>
            Merhaba! YKS Rehberim, üniversite adaylarının tercih döneminde en doğru kararları alabilmesi için geliştirilmiş bağımsız bir platformdur. 
            Amacımız, karmaşık ve dağınık YKS taban puanları ve başarı sıralamaları verilerini en anlaşılır, modern ve kullanıcı dostu şekilde sizlere sunmaktır.
          </p>
          
          <p>
            ÖSYM'nin yayınladığı güncel verileri ve yığınsal dağılım istatistiklerini kullanarak geliştirdiğimiz özel matematiksel modeller sayesinde, 
            tercih listelerinizi daha isabetli hazırlamanıza yardımcı oluyoruz. Özelliklerimiz arasında bölüm harmanlama, çoklu karşılaştırma ve 
            kendi puanınıza göre detaylı sıralama tahmini yapabilme imkanı bulunmaktadır.
          </p>
          
          <p>
            YKS tercih serüveninizde yanınızda olmaktan mutluluk duyuyoruz. Başarılar!
          </p>
        </div>
      </div>
    </main>
  );
}
