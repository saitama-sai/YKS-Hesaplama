'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCompare } from '@/context/CompareContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const { compareList } = useCompare();

  return (
    <nav className={`glass-panel ${styles.navbar}`}>
      <div className={styles.logo}>
        <Link href="/">
          <span className="gradient-text" style={{ fontWeight: '800', fontSize: '1.4rem' }}>
            YKS Rehberim
          </span>
        </Link>
      </div>
      <div className={styles.navLinks}>
        <Link 
          href="/" 
          className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}
        >
          Bölüm Sıralamaları
        </Link>
        <Link 
          href="/hesapla" 
          className={`${styles.navLink} ${pathname === '/hesapla' ? styles.active : ''}`}
        >
          Puan Hesapla
        </Link>
        <Link 
          href="/karsilastir" 
          className={`${styles.navLink} ${pathname === '/karsilastir' ? styles.active : ''}`}
        >
          Karşılaştır {compareList?.length > 0 && <span className={styles.badge}>{compareList.length}</span>}
        </Link>
      </div>
    </nav>
  );
}
