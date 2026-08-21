import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.05)', padding: '30px 0', backgroundColor: 'rgba(17, 24, 39, 0.8)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/hakkimizda" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='var(--primary)'} onMouseOut={e => e.target.style.color='var(--text-muted)'}>
            Hakkımızda
          </Link>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <Link href="/iletisim" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='var(--primary)'} onMouseOut={e => e.target.style.color='var(--text-muted)'}>
            İletişim
          </Link>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} YKS Rehberim. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
