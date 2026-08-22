import { blogs } from '@/utils/blogs';
import Link from 'next/link';
import Head from 'next/head';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Blog & YKS Rehberi | YKS Hesaplama',
  description: 'YKS tercihleri, üniversite kayıtları, çalışma taktikleri ve eğitim dünyasından güncel haberler.',
};

export default function BlogIndexPage() {
  return (
    <main className="container" style={{ maxWidth: '1000px', padding: '40px 20px', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
          <BookOpen size={36} color="var(--primary)" />
          YKS ve Tercih Rehberi
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '10px' }}>
          Üniversite yolculuğunuzda size rehberlik edecek en güncel yazılar ve ipuçları.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        {blogs.map(blog => (
          <article key={blog.id} className="glass-panel" style={{ padding: '30px', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
            <Link href={`/blog/${blog.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '500' }}>
                <Calendar size={18} />
                <time>{new Date(blog.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              </div>

              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: '0' }}>{blog.title}</h2>
              
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.05rem', margin: '0' }}>
                {blog.summary}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginTop: '10px', fontWeight: 'bold' }}>
                Devamını Oku <ArrowRight size={20} />
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
