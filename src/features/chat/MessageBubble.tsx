'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/cn';
import type { ChatMessage } from '@/types';
import { ProductChip } from './ProductChip';

export function MessageBubble({ message, streaming }: { message: ChatMessage; streaming: boolean }) {
  const mine = message.role === 'user';
  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className={cn('flex gap-3', mine && 'flex-row-reverse')}
    >
      <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm', mine ? 'bg-amber-400 text-slate-900' : 'bg-gradient-to-br from-violet-500 to-fuchsia-500')}>
        {mine ? 'You' : '✦'}
      </span>
      <div className={cn('max-w-[85%] space-y-3', mine && 'items-end text-right')}>
        <div className={cn('inline-block whitespace-pre-line rounded-2xl px-4 py-3 text-left leading-relaxed', mine ? 'rounded-tr-sm bg-amber-400 text-slate-900' : 'rounded-tl-sm bg-white/10')}>
          {message.text}
          {streaming && <motion.span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-violet-300" animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} />}
        </div>
        {message.products && message.products.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {message.products.map((p, i) => <ProductChip key={p.id} product={p} index={i} />)}
          </div>
        )}
        {message.sources && message.sources.length > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-1.5 text-xs text-slate-400">
            <span>Sources:</span>
            {message.sources.map((s) => <span key={s} className="rounded-full border border-white/10 px-2 py-0.5">{s}</span>)}
          </motion.p>
        )}
      </div>
    </motion.li>
  );
}
