import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getHistoricalData() {
  const filePath = path.join(process.cwd(), 'data', 'historical_data.json');
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

  const allData = getHistoricalData();

  let filteredData = allData;
  if (query) {
    const queries = query.split(',').map(q => q.trim()).filter(Boolean);
    let combinedResults = [];

    queries.forEach(q => {
      const exactMatches = allData.filter((item) => {
        const baseName = (item.bolum || '').replace(/\(.*\)/g, '').trim().toLocaleLowerCase('tr-TR');
        return baseName === q;
      });

      if (exactMatches.length > 0) {
        combinedResults.push(...exactMatches);
      } else {
        const partialMatches = allData.filter((item) => 
          item.bolum?.toLocaleLowerCase('tr-TR').includes(q) || 
          item.uni?.toLocaleLowerCase('tr-TR').includes(q)
        );
        combinedResults.push(...partialMatches);
      }
    });

    const uniqueMap = new Map();
    combinedResults.forEach(item => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });
    filteredData = Array.from(uniqueMap.values());
  }

  // Sort by 2026 ranking (ascending - lowest rank first, ignoring nulls)
  filteredData.sort((a, b) => {
    const rankA = a.history["2026"] || 9999999;
    const rankB = b.history["2026"] || 9999999;
    return rankA - rankB;
  });

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
