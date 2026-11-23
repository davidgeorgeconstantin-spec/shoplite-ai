// Copied from the frontend (src/) so both sides use the same retrieval rules.
export type Category = 'coffee' | 'equipment' | 'apparel' | 'home';

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number; // RON
  compareAtPrice?: number; // old price for "sale" badge
  description: string;
  emoji: string; // product "photo" is a generated illustration
  hue: number; // background hue for the illustration
  sizes?: string[];
  colors?: ColorOption[];
  stock: number;
  rating: number;
  tags: string[];
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}

/** A document the assistant can retrieve: a product or an FAQ entry. */
export type Doc =
  | { kind: 'product'; id: string; text: string; product: Product }
  | { kind: 'faq'; id: string; text: string; faq: FaqEntry };

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  products?: Product[];
  sources?: string[];
}
