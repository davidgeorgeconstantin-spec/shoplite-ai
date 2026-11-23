import type { Metadata } from 'next';
import { SmartSearch } from '@/features/search/SmartSearch';

export const metadata: Metadata = { title: 'Smart search' };

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight">Smart search</h1>
      <p className="mb-8 mt-2 text-slate-400">Write like you talk. Prices, categories and intent (gift, sale) are extracted, then results are ranked by TF-IDF relevance.</p>
      <SmartSearch />
    </div>
  );
}
