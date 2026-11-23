'use client';

import { motion } from 'motion/react';

export function TypingDots() {
  return (
    <motion.li initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3" aria-label="Assistant is thinking">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm">✦</span>
      <span className="flex gap-1 rounded-2xl bg-white/10 px-4 py-4">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="h-2 w-2 rounded-full bg-violet-300" animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }} />
        ))}
      </span>
    </motion.li>
  );
}
