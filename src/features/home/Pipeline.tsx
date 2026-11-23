'use client';

import { motion, useScroll, useSpring } from 'motion/react';
import { useRef } from 'react';

const STEPS = [
  { t: 'Question', d: 'The user writes in English or Romanian.' },
  { t: 'Intent', d: 'Greeting, FAQ or product search? Prices and categories are extracted.' },
  { t: 'Retrieve', d: 'TF-IDF finds the most relevant products and FAQ entries.' },
  { t: 'Answer', d: 'The reply is composed only from retrieved data — no invented facts.' },
  { t: 'Stream', d: 'Text appears token by token, like a real LLM response.' },
];

/** "How it works": a vertical line that draws itself as you scroll (pathLength). */
export function Pipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className="relative mx-auto max-w-2xl">
      <svg className="absolute left-5 top-0 h-full w-1" viewBox="0 0 2 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="1" y1="0" x2="1" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        <motion.line x1="1" y1="0" x2="1" y2="100" stroke="url(#pl)" strokeWidth="2" style={{ pathLength: progress }} />
        <defs><linearGradient id="pl" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#8b5cf6" /><stop offset="1" stopColor="#f59e0b" /></linearGradient></defs>
      </svg>
      <ol className="space-y-10">
        {STEPS.map((s, i) => (
          <motion.li key={s.t} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} className="relative flex gap-6">
            <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-violet-400/40 bg-slate-950 font-bold text-violet-300">{i + 1}</span>
            <div>
              <h3 className="text-lg font-bold">{s.t}</h3>
              <p className="text-slate-400">{s.d}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
