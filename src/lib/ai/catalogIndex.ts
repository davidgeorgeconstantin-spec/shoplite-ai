import { FAQ } from '@/data/faq';
import { PRODUCTS } from '@/data/products';
import type { FaqEntry, Product } from '@/types';
import { TfIdfIndex } from './tfidf';

export const productText = (p: Product) =>
  [p.name, p.name, p.category, p.description, p.tags.join(' '), p.compareAtPrice ? 'sale discount' : '', p.tags.includes('gift') ? 'gift present cadou' : ''].join(' ');

export const faqText = (f: FaqEntry) => [f.question, f.answer, f.keywords.join(' '), f.keywords.join(' ')].join(' ');

// Built once when the module loads (12 products + 6 FAQs → instant).
export const productIndex = new TfIdfIndex(PRODUCTS, productText);
export const faqIndex = new TfIdfIndex(FAQ, faqText);
