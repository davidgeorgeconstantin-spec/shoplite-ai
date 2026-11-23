'use client';

import Link from 'next/link';
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';

/** Card with a light that follows the mouse (motion values → no React re-renders). */
export function SpotlightCard({ href, icon, title, text }: { href: string; icon: string; title: string; text: string }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const bg = useMotionTemplate`radial-gradient(240px circle at ${x}px ${y}px, rgba(139,92,246,0.25), transparent 70%)`;

  return (
    <Link
      href={href}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onMouseLeave={() => (x.set(-200), y.set(-200))}
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-violet-400/40"
    >
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: bg }} />
      <span className="relative text-3xl">{icon}</span>
      <h3 className="relative mt-4 text-lg font-bold">{title}</h3>
      <p className="relative mt-1 text-sm text-slate-400">{text}</p>
      <span className="relative mt-4 inline-block text-sm font-semibold text-violet-300 transition group-hover:translate-x-1">Open →</span>
    </Link>
  );
}
