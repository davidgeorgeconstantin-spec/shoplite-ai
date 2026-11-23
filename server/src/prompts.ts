import { faqIndex, productIndex } from './shared/catalogIndex.js';
import type { DescribeInput } from './shared/describe.js';
import { formatMoney } from './shared/money.js';

/**
 * RAG step 1+2: retrieve relevant products/FAQs and put them in the prompt.
 * The model is told to answer ONLY from this context — this reduces hallucinations.
 */
export function buildChatPrompt(question: string): { system: string; context: string; sources: string[] } {
  const products = productIndex.search(question, 4);
  const faqs = faqIndex.search(question, 2);
  const context = [
    ...products.map(({ item: p }) => `PRODUCT ${p.name} | ${formatMoney(p.price)} | category ${p.category} | stock ${p.stock} | ${p.description}`),
    ...faqs.map(({ item: f }) => `FAQ ${f.question} → ${f.answer}`),
  ].join('\n');
  const system = [
    'You are the shopping assistant of ShopLite, a demo coffee store.',
    'Answer in the language of the question (English or Romanian), in at most 4 short sentences.',
    'Use ONLY the context below. If the answer is not in the context, say you do not know.',
    'Never invent products, prices or policies. Prices are in RON.',
  ].join(' ');
  return { system, context, sources: [...products.map((r) => `Product: ${r.item.name}`), ...faqs.map((r) => `FAQ: ${r.item.question}`)] };
}

export function buildDescribePrompt(input: DescribeInput): string {
  return `Write a ${input.tone} e-commerce product description (max 60 words) for "${input.name}" in category "${input.category}". Key features: ${input.features.join('; ')}. Do not invent features that are not listed.`;
}
