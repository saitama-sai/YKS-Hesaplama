import fs from 'fs';
import path from 'path';
import { slugify } from './slugify';

// Geliştirme ortamında veya build sırasında veri okumak için
export function getVeriler() {
  const filePath = path.join(process.cwd(), 'data', 'veriler.json');
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Veriler okunamadı:', error);
    return [];
  }
}

export function getUniqueUniversities() {
  const data = getVeriler();
  const unis = new Map();
  
  data.forEach(item => {
    if (item.uni) {
      const slug = slugify(item.uni);
      if (!unis.has(slug)) {
        unis.set(slug, { name: item.uni, slug });
      }
    }
  });
  
  return Array.from(unis.values());
}

export function getUniqueProfessions() {
  const data = getVeriler();
  const bolumler = new Map();
  
  data.forEach(item => {
    if (item.bolum) {
      const baseName = item.bolum.replace(/\(.*\)/g, '').trim();
      const slug = slugify(baseName);
      if (baseName && !bolumler.has(slug)) {
        bolumler.set(slug, { name: baseName, slug });
      }
    }
  });
  
  return Array.from(bolumler.values());
}
