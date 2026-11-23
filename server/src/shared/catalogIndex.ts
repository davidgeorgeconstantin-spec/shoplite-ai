// Copied from the frontend (src/) so both sides use the same retrieval rules.
import { FAQ } from './faq.js';
import { PRODUCTS } from './products.js';
import type { FaqEntry, Product } from './types.js';
import { TfIdfIndex } from './tfidf.js';

export const productText = (p: Product) =>
  [p.name, p.name, p.category, p.description, p.tags.join(' '), p.compareAtPrice ? 'sale discount' : '', p.tags.includes('gift') ? 'gift present cadou' : ''].join(' ');

export const faqText = (f: FaqEntry) => [f.question, f.answer, f.keywords.join(' '), f.keywords.join(' ')].join(' ');

// Built once when the module loads (12 products + 6 FAQs → instant).
export const productIndex = new TfIdfIndex(PRODUCTS, productText);
export const faqIndex = new TfIdfIndex(FAQ, faqText);
