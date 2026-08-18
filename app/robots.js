export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://kazanabilirsin.vercel.app/sitemap.xml',
  }
}
