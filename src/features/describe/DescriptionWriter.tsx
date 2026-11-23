'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';
import { generateDescription, type Tone } from '@/lib/ai/describe';
import { streamText } from '@/lib/ai/stream';
import { cn } from '@/lib/cn';

const TONES: Tone[] = ['friendly', 'premium', 'short'];

export function DescriptionWriter() {
  const [name, setName] = useState('Travel Coffee Kit');
  const [category, setCategory] = useState('coffee');
  const [features, setFeatures] = useState(['fits in a backpack', 'hand grinder included', 'brews in 3 minutes']);
  const [draft, setDraft] = useState('');
  const [tone, setTone] = useState<Tone>('friendly');
  const [output, setOutput] = useState('');
  const [writing, setWriting] = useState(false);
  const [copied, setCopied] = useState(false);
  const seed = useRef(0);

  function addFeature(e: React.FormEvent) {
    e.preventDefault();
    if (draft.trim()) setFeatures((f) => [...f, draft.trim()]);
    setDraft('');
  }

  async function generate() {
    setWriting(true);
    setOutput('');
    const text = generateDescription({ name, category, features, tone }, seed.current++);
    let acc = '';
    for await (const t of streamText(text, { delay: 25 })) {
      acc += t;
      setOutput(acc);
    }
    setWriting(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6">
        <label className="block">
          <span className="text-sm font-semibold text-slate-300">Product name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl bg-white/5 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-violet-400" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-300">Category</span>
          <input value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-xl bg-white/5 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-violet-400" />
        </label>
        <div>
          <span className="text-sm font-semibold text-slate-300">Key features</span>
          <ul className="mt-2 flex flex-wrap gap-2">
            <AnimatePresence>
              {features.map((f) => (
                <motion.li key={f} layout initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} className="flex items-center gap-1 rounded-full bg-violet-500/20 py-1 pl-3 pr-1 text-sm text-violet-100">
                  {f}
                  <button onClick={() => setFeatures((x) => x.filter((y) => y !== f))} className="grid h-5 w-5 place-items-center rounded-full hover:bg-white/10" aria-label={`Remove ${f}`}>×</button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <form onSubmit={addFeature} className="mt-2 flex gap-2">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a feature and press Enter" className="flex-1 rounded-xl bg-white/5 px-4 py-2.5 text-sm outline-none ring-1 ring-white/10 focus:ring-violet-400" />
          </form>
        </div>
        <div>
          <span className="text-sm font-semibold text-slate-300">Tone</span>
          <div className="mt-2 flex w-fit gap-1 rounded-full bg-white/5 p-1">
            {TONES.map((t) => (
              <button key={t} onClick={() => setTone(t)} className={cn('relative rounded-full px-4 py-1.5 text-sm font-semibold capitalize', tone === t ? 'text-slate-900' : 'text-slate-400')}>
                {tone === t && <motion.span layoutId="tone" className="absolute inset-0 rounded-full bg-amber-400" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={generate} disabled={writing || !name.trim()} className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 font-semibold disabled:opacity-50">
          {writing ? 'Writing…' : '✦ Generate description'}
        </motion.button>
      </div>

      <div className="relative min-h-72 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/60 to-slate-900 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-400">Output · template engine (demo mode)</p>
          {output && !writing && (
            <button
              onClick={() => navigator.clipboard?.writeText(output).then(() => (setCopied(true), setTimeout(() => setCopied(false), 1500)))}
              className="rounded-full border border-white/15 px-3 py-1 text-xs"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          )}
        </div>
        <p className="mt-4 text-lg leading-relaxed">
          {output || <span className="text-slate-500">Your product description will appear here.</span>}
          {writing && <motion.span className="ml-0.5 inline-block h-5 w-2 translate-y-1 bg-amber-300" animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} />}
        </p>
        <p className="absolute bottom-5 left-6 right-6 text-xs text-slate-500">
          The server version (<code>/server</code>) sends the same fields to Google Gemini (free tier) with a prompt. This page uses templates so it works without an API key.
        </p>
      </div>
    </div>
  );
}
