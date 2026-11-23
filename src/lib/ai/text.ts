const STOPWORDS = new Set(
  'a an the and or for of to in on with is are i me my you your it this that what which do does can how some something ceva un o si sau pentru de la cu in pe este sunt eu imi vreau ma care ce cum am'.split(' '),
);

/** Lowercase, remove diacritics (ă→a, ș→s) and punctuation. */
export function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, ' ');
}

/** Very small "stemmer": coffees → coffee, grinders → grinder. Good enough for a demo. */
const stem = (w: string) => (w.length > 4 && w.endsWith('es') ? w.slice(0, -2) : w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w);

export function tokenize(text: string): string[] {
  return normalize(text)
    .split(/[\s-]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w) && !/^\d+$/.test(w))
    .map(stem);
}
