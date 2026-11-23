import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Aurora } from '@/components/layout/Aurora';
import { Header } from '@/components/layout/Header';
import { Providers } from '@/components/layout/Providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'ShopLite AI — store assistant demo', template: '%s · ShopLite AI' },
  description: 'A store assistant demo (learning project): chat with streaming answers, smart search and a description writer. Runs in demo mode without an AI API; the server shows the Gemini version.',
  icons: { icon: '/shoplite-ai/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
        <Providers>
          <Aurora />
          <Header />
          <main>{children}</main>
          <footer className="py-10 text-center text-xs text-slate-500">
            Learning project by David Constantin · Demo mode: answers come from a rule-based retrieval engine, not an AI model.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
