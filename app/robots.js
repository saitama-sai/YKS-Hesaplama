export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://yks-hesaplama.vercel.app/sitemap.xml',
  }
}
