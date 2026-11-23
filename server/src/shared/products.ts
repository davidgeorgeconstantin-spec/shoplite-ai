// Copied from the frontend (src/) so both sides use the same retrieval rules.
import type { Product } from './types.js';

/** Demo catalog. Prices in RON. "Photos" are illustrations generated in code (see ProductArt). */
export const PRODUCTS: Product[] = [
  { id: 'p1', slug: 'ethiopia-yirgacheffe', name: 'Ethiopia Yirgacheffe', category: 'coffee', price: 69, description: 'Light roast with floral and citrus notes. Great for V60 and Chemex.', emoji: '☕', hue: 28, sizes: ['250g', '500g', '1kg'], stock: 40, rating: 4.8, tags: ['light roast', 'filter'] },
  { id: 'p2', slug: 'colombia-huila', name: 'Colombia Huila', category: 'coffee', price: 59, compareAtPrice: 72, description: 'Balanced medium roast — caramel, red apple and cocoa.', emoji: '🫘', hue: 18, sizes: ['250g', '500g', '1kg'], stock: 55, rating: 4.6, tags: ['medium roast', 'espresso'] },
  { id: 'p3', slug: 'brazil-santos', name: 'Brazil Santos', category: 'coffee', price: 49, description: 'Dark roast, nutty and chocolatey. Perfect with milk.', emoji: '🍫', hue: 12, sizes: ['250g', '500g', '1kg'], stock: 8, rating: 4.4, tags: ['dark roast', 'milk'] },
  { id: 'p4', slug: 'decaf-swiss-water', name: 'Decaf Swiss Water', category: 'coffee', price: 64, description: 'Chemical-free decaf with a smooth, sweet cup.', emoji: '🌙', hue: 250, sizes: ['250g', '500g'], stock: 20, rating: 4.3, tags: ['decaf'] },
  { id: 'p5', slug: 'pour-over-kettle', name: 'Pour-over Kettle', category: 'equipment', price: 189, description: 'Gooseneck kettle, 1L, with built-in thermometer for precise pouring.', emoji: '🫖', hue: 200, colors: [{ name: 'Matte black', hex: '#1f2937' }, { name: 'Steel', hex: '#9ca3af' }, { name: 'Copper', hex: '#b45309' }], stock: 15, rating: 4.7, tags: ['brewing'] },
  { id: 'p6', slug: 'hand-grinder', name: 'Hand Grinder Pro', category: 'equipment', price: 249, compareAtPrice: 299, description: 'Stainless steel conical burrs, 30 grind settings, fits in a travel bag.', emoji: '⚙️', hue: 215, colors: [{ name: 'Black', hex: '#111827' }, { name: 'Silver', hex: '#d1d5db' }], stock: 6, rating: 4.9, tags: ['grinder', 'travel'] },
  { id: 'p7', slug: 'v60-dripper', name: 'Ceramic Dripper', category: 'equipment', price: 89, description: 'Classic cone dripper for one or two cups.', emoji: '🔻', hue: 190, colors: [{ name: 'White', hex: '#f8fafc' }, { name: 'Red', hex: '#dc2626' }], stock: 30, rating: 4.5, tags: ['brewing', 'filter'] },
  { id: 'p8', slug: 'digital-scale', name: 'Digital Scale', category: 'equipment', price: 129, description: '0.1g precision with built-in timer. Brew the same great cup every day.', emoji: '⚖️', hue: 170, stock: 0, rating: 4.6, tags: ['brewing'] },
  { id: 'p9', slug: 'barista-tee', name: 'Barista T-shirt', category: 'apparel', price: 99, description: '100% organic cotton tee with a minimal coffee print.', emoji: '👕', hue: 330, sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Black', hex: '#111827' }, { name: 'Sand', hex: '#e7d7b9' }], stock: 25, rating: 4.2, tags: ['cotton'] },
  { id: 'p10', slug: 'canvas-apron', name: 'Canvas Apron', category: 'apparel', price: 139, description: 'Heavy canvas apron with leather straps and two pockets.', emoji: '🧑‍🍳', hue: 35, colors: [{ name: 'Olive', hex: '#4d5b3a' }, { name: 'Navy', hex: '#1e3a8a' }], stock: 12, rating: 4.7, tags: ['barista'] },
  { id: 'p11', slug: 'stoneware-mug', name: 'Stoneware Mug', category: 'home', price: 45, description: 'Hand-glazed 350ml mug. Every piece is slightly different.', emoji: '🍵', hue: 150, colors: [{ name: 'Moss', hex: '#4d7c0f' }, { name: 'Sky', hex: '#0284c7' }, { name: 'Cream', hex: '#fef3c7' }], stock: 50, rating: 4.8, tags: ['gift'] },
  { id: 'p12', slug: 'gift-box', name: 'Coffee Gift Box', category: 'home', price: 179, compareAtPrice: 210, description: 'Three 250g coffees + a mug. A ready-made gift for coffee lovers.', emoji: '🎁', hue: 350, stock: 10, rating: 4.9, tags: ['gift', 'bundle'] },
];

export const CATEGORIES: { id: 'all' | Product['category']; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'home', label: 'Home & gifts' },
];
