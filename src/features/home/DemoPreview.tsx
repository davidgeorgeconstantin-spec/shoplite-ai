'use client';

import { AnimatePresence, motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { answer } from '@/lib/ai/assistant';
import { streamText } from '@/lib/ai/stream';

const QUESTIONS = ['A gift for a coffee lover under 200 lei?', 'How long does shipping take?', 'Any grinder on sale?'];

/** Auto-playing conversation in the hero. Plays only while visible. */
export function DemoPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [qi, setQi] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!inView) return;
    const ctrl = new AbortController();
    (async () => {
      setText('');
      await new Promise((r) => setTimeout(r, 700));
      let acc = '';
      for await (const t of streamText(answer(QUESTIONS[qi]!).text, { delay: 14, signal: ctrl.signal })) setText((acc += t));
      await new Promise((r) => setTimeout(r, 2600));
      if (!ctrl.signal.aborted) setQi((n) => (n + 1) % QUESTIONS.length);
    })();
    return () => ctrl.abort();
  }, [qi, inView]);

  return (
    <div ref={ref} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-violet-900/30 backdrop-blur">
      <div className="mb-4 flex gap-1.5">{['bg-rose-400', 'bg-amber-400', 'bg-emerald-400'].map((c) => <span key={c} className={`h-3 w-3 rounded-full ${c}`} />)}</div>
      <AnimatePresence mode="wait">
        <motion.div key={qi} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
          <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-amber-400 px-4 py-2.5 text-sm text-slate-900">{QUESTIONS[qi]}</p>
          <p className="min-h-40 max-w-[92%] whitespace-pre-line rounded-2xl rounded-tl-sm bg-white/10 px-4 py-3 text-sm leading-relaxed">
            {text || <span className="text-slate-500">thinking…</span>}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
