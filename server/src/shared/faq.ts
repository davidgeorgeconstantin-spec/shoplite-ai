// Copied from the frontend (src/) so both sides use the same retrieval rules.
import type { FaqEntry } from './types.js';

/** Demo store policies (fictional demo store). */
export const FAQ: FaqEntry[] = [
  { id: 'shipping', question: 'How much is shipping and how long does it take?', answer: 'Shipping costs 19.99 RON and is free for orders over 200 RON. Orders are delivered in 1–3 working days in Romania.', keywords: ['shipping', 'delivery', 'livrare', 'transport', 'courier', 'curier', 'deliver', 'days', 'zile'] },
  { id: 'returns', question: 'Can I return a product?', answer: 'Yes. You can return unopened products within 14 days for a full refund. Coffee that has been opened cannot be returned for hygiene reasons.', keywords: ['return', 'returns', 'retur', 'refund', 'money', 'back', 'bani', 'inapoi'] },
  { id: 'payment', question: 'Which payment methods do you accept?', answer: 'In this demo store payments are simulated. A real version would accept cards through Stripe and cash on delivery.', keywords: ['payment', 'pay', 'card', 'plata', 'cash', 'ramburs', 'stripe'] },
  { id: 'roast', question: 'When is the coffee roasted?', answer: 'Every coffee is roasted in small batches and shipped within 5 days of roasting (demo information).', keywords: ['roast', 'roasted', 'fresh', 'prajit', 'proaspat', 'date'] },
  { id: 'grind', question: 'Do you sell ground coffee?', answer: 'All coffees are whole beans. For the best taste, grind right before brewing — our Hand Grinder Pro is a good start.', keywords: ['ground', 'grind', 'macinata', 'macinat', 'beans', 'boabe'] },
  { id: 'contact', question: 'How can I contact you?', answer: 'This is a demo store made as a learning project, so there is no real customer support.', keywords: ['contact', 'phone', 'email', 'telefon', 'support', 'help'] },
];
