import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getData() {
  const filePath = path.join(process.cwd(), 'data', 'veriler.json');
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Veri okunurken hata oluştu:', error);
    return [];
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.toLocaleLowerCase('tr-TR') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  const allData = getData();

  // Arama mantığı: Eğer query varsa bolum içinde geçiyor mu diye bak. (İstersek uni de aranabilir)
  let filteredData = allData;
  if (query) {
    filteredData = allData.filter((item) => 
      item.bolum?.toLocaleLowerCase('tr-TR').includes(query) || 
      item.uni?.toLocaleLowerCase('tr-TR').includes(query)
    );
  }

  // Puana göre yüksekten düşüğe sıralama
  filteredData.sort((a, b) => {
    const puanA = parseFloat(a.puan) || 0;
    const puanB = parseFloat(b.puan) || 0;
    return puanB - puanA;
  });

  // Sayfalama (Pagination)
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return NextResponse.json({
    total: filteredData.length,
    page,
    limit,
    totalPages: Math.ceil(filteredData.length / limit),
    data: paginatedData
  });
}
