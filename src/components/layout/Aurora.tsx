'use client';

import { motion } from 'motion/react';

/** Slowly moving blurred blobs behind every page. */
export function Aurora() {
  const blobs = [
    { c: 'bg-violet-600/30', x: ['-10%', '10%', '-10%'], y: ['0%', '15%', '0%'], cls: 'left-0 top-0 h-[36rem] w-[36rem]' },
    { c: 'bg-fuchsia-500/20', x: ['0%', '-15%', '0%'], y: ['10%', '-5%', '10%'], cls: 'right-0 top-20 h-[30rem] w-[30rem]' },
    { c: 'bg-amber-400/10', x: ['5%', '-5%', '5%'], y: ['0%', '-10%', '0%'], cls: 'bottom-0 left-1/3 h-[26rem] w-[26rem]' },
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {blobs.map((b, i) => (
        <motion.div key={i} className={`absolute rounded-full blur-3xl ${b.c} ${b.cls}`} animate={{ x: b.x, y: b.y }} transition={{ repeat: Infinity, duration: 18 + i * 4, ease: 'easeInOut' }} />
      ))}
    </div>
  );
}
