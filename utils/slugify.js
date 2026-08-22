export function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9 -]/g, '') // Harf, rakam, boşluk ve tire dışındakileri sil
    .replace(/\s+/g, '-') // Boşlukları tireye çevir
    .replace(/-+/g, '-') // Tekrar eden tireleri tek tire yap
    .trim();
}
