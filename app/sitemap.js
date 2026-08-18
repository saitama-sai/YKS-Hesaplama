export default function sitemap() {
  const baseUrl = 'https://kazanabilirsin.vercel.app'; // İleride gerçek domainle değişecek

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/hesapla`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
