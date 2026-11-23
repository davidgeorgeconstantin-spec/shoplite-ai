// Copied from the frontend (src/) so both sides use the same retrieval rules.
import { PRODUCTS } from './products.js';
import type { Product } from './types.js';
import { productIndex } from './catalogIndex.js';
import { parseShoppingQuery, type ShoppingQuery } from './intent.js';

export interface SmartResult {
  product: Product;
  score: number;
  reasons: string[];
}

/** Hybrid search: structured filters (price, category) + TF-IDF relevance + small boosts. */
export function smartSearch(query: string, products: Product[] = PRODUCTS): { filters: ShoppingQuery; results: SmartResult[] } {
  const filters = parseShoppingQuery(query);
  const relevance = new Map(productIndex.search(query, 50, 0).map((r) => [r.item.id, r.score]));

  const results = products
    .filter((p) => (filters.maxPrice === undefined || p.price <= filters.maxPrice) && (filters.minPrice === undefined || p.price >= filters.minPrice))
    .filter((p) => !filters.category || p.category === filters.category)
    .map((p) => {
      const reasons: string[] = [];
      let score = relevance.get(p.id) ?? 0;
      if (filters.maxPrice !== undefined) reasons.push(`under ${filters.maxPrice} RON`);
      if (filters.category) reasons.push(p.category);
      if (filters.wantsGift && p.tags.includes('gift')) {
        score += 0.4;
        reasons.push('great gift');
      }
      if (filters.wantsSale && p.compareAtPrice) {
        score += 0.4;
        reasons.push('on sale');
      }
      if (p.stock === 0) score -= 0.3;
      score += p.rating / 50; // tie-breaker: better rated first
      return { product: p, score, reasons };
    })
    .filter((r) => r.score > 0.1 || filters.maxPrice !== undefined || filters.category !== undefined)
    .sort((a, b) => b.score - a.score);

  return { filters, results };
}
