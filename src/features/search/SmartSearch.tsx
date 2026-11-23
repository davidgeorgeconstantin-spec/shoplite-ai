'use client';

import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { ProductArt } from '@/components/ui/ProductArt';
import { useDebounced } from '@/hooks/useDebounced';
import { smartSearch } from '@/lib/ai/smartSearch';
import { formatMoney } from '@/lib/money';

const EXAMPLES = ['gift for a coffee lover under 200 lei', 'cheap brewing gear', 'cadou sub 100 lei', 'apron or t-shirt', 'decaf for the evening'];

/** Rotating placeholder: cycles through example queries. */
function usePlaceholder() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % EXAMPLES.length), 2800);
    return () => clearInterval(t);
  }, []);
  return EXAMPLES[i]!;
}

export function SmartSearch() {
  const [query, setQuery] = useState('');
  const q = useDebounced(query, 200);
  const placeholder = usePlaceholder();
  const { filters, results } = useMemo(() => smartSearch(q), [q]);
  const max = Math.max(...results.map((r) => r.score), 0.01);

  const chips = [
    filters.maxPrice !== undefined && `≤ ${filters.maxPrice} RON`,
    filters.minPrice !== undefined && `≥ ${filters.minPrice} RON`,
    filters.category && `category: ${filters.category}`,
    filters.wantsGift && 'gift',
    filters.wantsSale && 'on sale',
  ].filter(Boolean) as string[];

  return (
    <div>
      <div className="relative">
        <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Smart search" className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-lg outline-none ring-violet-400/50 transition focus:ring-4" />
        {!query && (
          <div className="pointer-events-none absolute inset-y-0 left-6 flex items-center overflow-hidden text-lg text-slate-500">
            Try:&nbsp;
            <AnimatePresence mode="wait">
              <motion.span key={placeholder} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }}>
                “{placeholder}”
              </motion.span>
            </AnimatePresence>
          </div>
        )}
      </div>

      <LayoutGroup>
        <motion.div layout className="mt-4 flex min-h-8 flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-400">Understood filters:</span>
          <AnimatePresence mode="popLayout">
            {chips.length === 0 && <motion.span key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-slate-500">none yet</motion.span>}
            {chips.map((c) => (
              <motion.span key={c} layout initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} className="rounded-full bg-violet-500/20 px-3 py-1 font-semibold text-violet-200">
                {c}
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.ul layout className="mt-6 grid gap-3 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {(q ? results : []).slice(0, 8).map((r, i) => (
              <motion.li
                key={r.product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-3"
              >
                <ProductArt emoji={r.product.emoji} hue={r.product.hue} size="sm" className="h-20 w-20 shrink-0 rounded-xl" />
                <div className="flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="font-semibold">{r.product.name}</p>
                    <p className="text-violet-300">{formatMoney(r.product.price)}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">{r.reasons.join(' · ') || 'text match'}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" title="Relevance">
                    <motion.div className="h-full origin-left rounded-full bg-gradient-to-r from-violet-500 to-amber-400" initial={{ scaleX: 0 }} animate={{ scaleX: Math.max(0.05, r.score / max) }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
      {q && results.length === 0 && <p className="mt-10 text-center text-slate-400">No matches. Try “mug” or “under 100 lei”.</p>}
    </div>
  );
}
