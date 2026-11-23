'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { DemoPreview } from '@/features/home/DemoPreview';
import { Pipeline } from '@/features/home/Pipeline';
import { SpotlightCard } from '@/features/home/SpotlightCard';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5">
      <section className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-300">
            ● Demo mode — runs without an AI API
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, type: 'spring', stiffness: 120 }} className="mt-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            A shopping assistant that{' '}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-[length:200%_auto] bg-clip-text text-transparent motion-safe:animate-[shine_6s_linear_infinite]">answers from your data</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 max-w-lg text-lg text-slate-400">
            Product recommendations, shipping & returns answers, natural-language search and a description writer for the ShopLite demo store. Built to learn RAG, streaming and rate limiting.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8 flex flex-wrap gap-3">
            <Link href="/chat/" className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-7 py-3.5 font-semibold shadow-lg shadow-violet-500/30 transition hover:-translate-y-0.5">Chat with the assistant</Link>
            <Link href="/search/" className="rounded-full border border-white/15 px-7 py-3.5 font-semibold transition hover:bg-white/5">Try smart search</Link>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 100, damping: 18 }}>
          <DemoPreview />
        </motion.div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SpotlightCard href="/chat/" icon="💬" title="Assistant" text="Streaming answers with product cards and the sources it used." />
        <SpotlightCard href="/search/" icon="🔎" title="Smart search" text="“gift under 200 lei” → filters + relevance ranking." />
        <SpotlightCard href="/describe/" icon="✍️" title="Description writer" text="Admin tool that drafts product descriptions in three tones." />
      </section>

      <section className="py-24">
        <h2 className="mb-12 text-center text-3xl font-extrabold">How it works</h2>
        <Pipeline />
      </section>

      <section className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-xl font-bold">Demo mode vs. server mode</h2>
        <div className="mt-4 grid gap-6 text-sm text-slate-400 md:grid-cols-2">
          <p><b className="text-slate-200">This website (demo mode):</b> everything runs in your browser. Retrieval is TF-IDF, answers are built from templates, streaming is simulated. No API key, no cost.</p>
          <p><b className="text-slate-200">/server (real AI):</b> Express API that calls Google Gemini (free tier) with retrieved context, streams tokens with Server-Sent Events and limits requests per IP. Needs your own key in <code>.env</code>.</p>
        </div>
      </section>
    </div>
  );
}
