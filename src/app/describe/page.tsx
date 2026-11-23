import type { Metadata } from 'next';
import { DescriptionWriter } from '@/features/describe/DescriptionWriter';

export const metadata: Metadata = { title: 'Description writer' };

export default function DescribePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight">Product description writer</h1>
      <p className="mb-8 mt-2 text-slate-400">An admin tool: fill in a few facts, pick a tone, get a description.</p>
      <DescriptionWriter />
    </div>
  );
}
