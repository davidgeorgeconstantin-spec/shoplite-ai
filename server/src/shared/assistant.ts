// Copied from the frontend (src/) so both sides use the same retrieval rules.
import type { Product } from './types.js';
import { formatMoney } from './money.js';
import { faqIndex } from './catalogIndex.js';
import { detectIntent } from './intent.js';
import { smartSearch } from './smartSearch.js';

export interface AssistantReply {
  text: string;
  products: Product[];
  sources: string[];
}

/**
 * DEMO MODE assistant — rule-based, no AI model.
 * Same shape as a real RAG pipeline: 1) detect intent, 2) retrieve documents, 3) compose an answer
 * ONLY from what was retrieved (so it never "invents" products or policies).
 */
export function answer(question: string): AssistantReply {
  const intent = detectIntent(question);

  if (intent === 'greeting')
    return { text: "Hi! I'm the ShopLite demo assistant. Ask me for a recommendation (\"a gift under 200 lei\") or about shipping and returns.", products: [], sources: [] };

  if (intent === 'faq') {
    const [hit] = faqIndex.search(question, 1);
    if (hit) return { text: hit.item.answer, products: [], sources: [`FAQ: ${hit.item.question}`] };
  }

  const { filters, results } = smartSearch(question);
  const top = results.filter((r) => r.product.stock > 0).slice(0, 3);
  if (top.length === 0) {
    const [faq] = faqIndex.search(question, 1);
    if (faq) return { text: faq.item.answer, products: [], sources: [`FAQ: ${faq.item.question}`] };
    return { text: "I couldn't find anything matching that in the catalog. Try asking about coffee, brewing gear, mugs or gifts.", products: [], sources: [] };
  }

  const constraints = [filters.maxPrice && `under ${filters.maxPrice} RON`, filters.category, filters.wantsGift && 'good as a gift', filters.wantsSale && 'on sale'].filter(Boolean);
  const intro = constraints.length ? `Here ${top.length === 1 ? 'is' : 'are'} my top pick${top.length === 1 ? '' : 's'} (${constraints.join(', ')}):` : 'Based on your question, I would recommend:';
  const lines = top.map(({ product: p }) => `• ${p.name} — ${formatMoney(p.price)}. ${p.description}`);
  const tip = top[0]!.product.price < 200 ? 'Tip: shipping is free over 200 RON.' : 'This one already qualifies for free shipping.';

  return { text: [intro, ...lines, tip].join('\n'), products: top.map((r) => r.product), sources: top.map((r) => `Product: ${r.product.name}`) };
}
