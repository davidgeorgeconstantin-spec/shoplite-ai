import type { Category } from '@/types';
import { normalize } from './text';

export interface ShoppingQuery {
  maxPrice?: number;
  minPrice?: number;
  category?: Category;
  wantsGift: boolean;
  wantsSale: boolean;
}

const CATEGORY_HINTS: [RegExp, Category][] = [
  [/\b(grinder|kettle|dripper|scale|rasnita|cantar|ibric|equipment|gear|brew)/, 'equipment'],
  [/\b(t-?shirt|tee|tricou|apron|sort|clothes|haine|wear)/, 'apparel'],
  [/\b(mug|cana|home|casa)/, 'home'],
  [/\b(bean|boabe|roast|espresso|decaf|cafea boabe)/, 'coffee'],
];

/** Pulls structured filters out of a free-text question: "gift for a coffee lover under 200 lei". */
export function parseShoppingQuery(text: string): ShoppingQuery {
  const t = normalize(text);
  const under = t.match(/\b(?:under|below|less than|max|sub|maxim|pana la)\s*(\d+)/);
  const over = t.match(/\b(?:over|above|more than|min|peste|minim)\s*(\d+)/);
  const category = CATEGORY_HINTS.find(([re]) => re.test(t))?.[1];
  return {
    maxPrice: under ? Number(under[1]) : undefined,
    minPrice: over ? Number(over[1]) : undefined,
    category,
    wantsGift: /\b(gift|present|cadou|birthday|zi de nastere)/.test(t),
    wantsSale: /\b(sale|discount|deal|cheap|ieftin|reducere|oferta)/.test(t),
  };
}

export type Intent = 'greeting' | 'faq' | 'product' | 'unknown';

export function detectIntent(text: string): Intent {
  const t = normalize(text).trim();
  if (/^(hi|hello|hey|salut|buna|neata|servus)\b/.test(t) && t.split(/\s+/).length <= 3) return 'greeting';
  if (/\b(ship|deliver|livrare|return|retur|refund|pay|plata|roast|contact|ground|macinat)/.test(t)) return 'faq';
  if (t.length > 0) return 'product';
  return 'unknown';
}
