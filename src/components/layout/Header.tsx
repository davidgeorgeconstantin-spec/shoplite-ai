'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { cn } from '@/lib/cn';

const NAV = [
  { href: '/', label: 'Overview', short: 'Home' },
  { href: '/chat/', label: 'Assistant', short: 'Chat' },
  { href: '/search/', label: 'Smart search', short: 'Search' },
  { href: '/describe/', label: 'Descriptions', short: 'Write' },
];

export function Header() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href.slice(0, -1)));
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-extrabold">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-amber-400">✦</span>
          <span className="hidden sm:inline">ShopLite AI</span>
        </Link>
        <nav className="flex gap-1 overflow-x-auto">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={cn('relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold', isActive(n.href) ? 'text-white' : 'text-slate-400 hover:text-white')}>
              {isActive(n.href) && <motion.span layoutId="nav" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
              <span className="relative hidden sm:inline">{n.label}</span>
              <span className="relative sm:hidden">{n.short}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
