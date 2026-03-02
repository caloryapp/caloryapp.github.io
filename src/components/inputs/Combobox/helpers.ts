export const normalizeText = (text: string) =>
  text
    .normalize('NFD') // separate letters from accents
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
