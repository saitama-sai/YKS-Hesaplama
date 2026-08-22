'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCompare } from '@/context/CompareContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const { compareList } = useCompare();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          href="/son-5-yil" 
          className={`${styles.navLink} ${pathname === '/son-5-yil' ? styles.active : ''}`}
        >
          Son 5 Yıl
        </Link>
        <Link 
          href="/harmanla" 
          className={`${styles.navLink} ${pathname === '/harmanla' ? styles.active : ''}`}
        >
          Bölüm Harmanla
        </Link>
        <Link 
          href="/blog" 
          className={`${styles.navLink} ${pathname.startsWith('/blog') ? styles.active : ''}`}
        >
          Blog
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
        <div className={styles.dropdown} ref={dropdownRef}>
          <button 
            className={styles.navLink} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', width: '100%' }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Öğrenci Araçları ▾
          </button>
          <div className={`${styles.dropdownContent} ${dropdownOpen ? styles.show : ''}`}>
            <Link href="/hedef-net" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>🎯 Hedef Net Sihirbazı</Link>
            <Link href="/deneme-takip" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>📈 Deneme Takip</Link>
            <Link href="/konu-takip" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>📚 Konu Çizelgesi</Link>
            <Link href="/pomodoro" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>⏱️ Pomodoro & Sayaç</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
