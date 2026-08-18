export default function sitemap() {
  const baseUrl = 'https://yks-hesaplama.vercel.app'; // İleride gerçek domainle değişebilir

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
