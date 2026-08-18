import { NextResponse } from 'next/server';
import veriler from '@/data/veriler.json';

export const dynamic = 'force-dynamic';

export async function GET() {
  const bolumler = new Set();
  
  veriler.forEach(item => {
    if (item.bolum) {
      // Sadece ana bölüm adını almak için parantez içi ifadeleri temizliyoruz
      const baseName = item.bolum.replace(/\(.*\)/g, '').trim();
      if (baseName) {
        bolumler.add(baseName);
      }
    }
  });

  const sortedBolumler = Array.from(bolumler).sort((a, b) => a.localeCompare(b, 'tr'));

  return NextResponse.json({
    success: true,
    data: sortedBolumler
  });
}
