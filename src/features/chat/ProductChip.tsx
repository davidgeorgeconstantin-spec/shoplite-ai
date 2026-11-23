'use client';

import { motion } from 'motion/react';
import { ProductArt } from '@/components/ui/ProductArt';
import { formatMoney } from '@/lib/money';
import type { Product } from '@/types';

export function ProductChip({ product, index }: { product: Product; index: number }) {
  return (
    <motion.a
      href={`https://davidgeorgeconstantin-spec.github.io/shoplite/products/${product.slug}/`}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 260, damping: 22 }}
      whileHover={{ y: -4 }}
      className="flex w-44 shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5"
    >
      <ProductArt emoji={product.emoji} hue={product.hue} size="sm" className="h-24" />
      <span className="px-3 pt-2 text-sm font-semibold">{product.name}</span>
      <span className="px-3 pb-3 text-sm text-violet-300">{formatMoney(product.price)}</span>
    </motion.a>
  );
}
