import { blogs } from '@/utils/blogs';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) return { title: 'Bulunamadı' };

  return {
    title: `${blog.title} | YKS Rehberim`,
    description: blog.summary,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    notFound();
  }

  // Markdown-vari basit parse
  const renderContent = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return <h2 key={index} style={{ color: 'var(--primary)', marginTop: '30px', marginBottom: '15px' }}>{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} style={{ color: 'var(--text-main)', marginTop: '20px', marginBottom: '10px' }}>{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('* **')) {
        const strongTextMatch = line.match(/\* \*\*(.*?)\*\*(.*)/);
        if (strongTextMatch) {
          return (
            <li key={index} style={{ marginBottom: '10px', marginLeft: '20px', listStyleType: 'disc' }}>
              <strong>{strongTextMatch[1]}</strong>{strongTextMatch[2]}
            </li>
          );
        }
      }
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ') || line.startsWith('6. ') || line.startsWith('7. ')) {
        const numMatch = line.match(/(\d+\.) (.*)/);
        if (numMatch) {
          // Check if there is bold text inside
          let text = numMatch[2];
          let boldPart = null;
          let rest = text;
          const boldMatch = text.match(/\*\*(.*?)\*\*(.*)/);
          if (boldMatch) {
            boldPart = boldMatch[1];
            rest = boldMatch[2];
          }
          return (
            <div key={index} style={{ marginBottom: '10px', marginLeft: '20px', display: 'flex', gap: '10px' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{numMatch[1]}</span>
              <span>{boldPart ? <strong>{boldPart}</strong> : null}{rest}</span>
            </div>
          );
        }
      }
      if (line.startsWith('*Not:')) {
        return <p key={index} style={{ fontStyle: 'italic', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--warning)' }}>{line.replace('*', '').replace('*', '')}</p>;
      }
      if (line === '---') {
        return <hr key={index} style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '40px 0' }} />;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Handle links [text](url)
      if (line.includes('](')) {
        const linkMatch = line.match(/(.*?)\[(.*?)\]\((.*?)\)(.*)/);
        if (linkMatch) {
          return (
            <p key={index} style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
              {linkMatch[1]}
              <a href={linkMatch[3]} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{linkMatch[2]}</a>
              {linkMatch[4]}
            </p>
          );
        }
      }
      
      return <p key={index} style={{ lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '15px' }}>{line}</p>;
    });
  };

  return (
    <main className="container" style={{ maxWidth: '800px', padding: '40px 20px', minHeight: '100vh' }}>
      <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', marginBottom: '30px', fontWeight: '500' }}>
        <ArrowLeft size={18} /> Tüm Yazılara Dön
      </Link>

      <article className="glass-panel" style={{ padding: '40px', borderRadius: '16px' }}>
        <header style={{ marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '500', marginBottom: '15px' }}>
            <Calendar size={18} />
            <time>{new Date(blog.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-main)', lineHeight: '1.3', margin: 0 }}>
            {blog.title}
          </h1>
        </header>
        
        <div className="blog-content" style={{ fontSize: '1.1rem' }}>
          {renderContent(blog.content)}
        </div>
      </article>
      
      <style>{`
        .blog-content strong { color: var(--text-main); }
      `}</style>
    </main>
  );
}
