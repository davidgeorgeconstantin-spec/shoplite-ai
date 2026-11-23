// Copied from the frontend (src/) so both sides use the same retrieval rules.
import { tokenize } from './text.js';

/**
 * TF-IDF search index — the "retrieval" part of RAG, without an AI API.
 * TF  = how often a word appears in a document
 * IDF = how rare the word is across all documents (rare words matter more)
 * Score = cosine similarity between the query vector and each document vector.
 */
export interface IndexedDoc<T> {
  item: T;
  vector: Map<string, number>;
  norm: number;
}

export class TfIdfIndex<T> {
  private idf = new Map<string, number>();
  private docs: IndexedDoc<T>[] = [];

  constructor(items: T[], toText: (item: T) => string) {
    const tokenized = items.map((item) => ({ item, tokens: tokenize(toText(item)) }));
    const df = new Map<string, number>();
    tokenized.forEach(({ tokens }) => new Set(tokens).forEach((t) => df.set(t, (df.get(t) ?? 0) + 1)));
    df.forEach((count, term) => this.idf.set(term, Math.log((1 + items.length) / (1 + count)) + 1));
    this.docs = tokenized.map(({ item, tokens }) => {
      const vector = this.weigh(tokens);
      return { item, vector, norm: Math.hypot(...vector.values()) };
    });
  }

  private weigh(tokens: string[]): Map<string, number> {
    const tf = new Map<string, number>();
    tokens.forEach((t) => tf.set(t, (tf.get(t) ?? 0) + 1));
    const v = new Map<string, number>();
    tf.forEach((count, term) => v.set(term, (count / tokens.length) * (this.idf.get(term) ?? 0)));
    return v;
  }

  search(query: string, k = 5, minScore = 0.05): { item: T; score: number }[] {
    const q = this.weigh(tokenize(query));
    const qNorm = Math.hypot(...q.values());
    if (!qNorm) return [];
    return this.docs
      .map((d) => {
        let dot = 0;
        q.forEach((w, term) => (dot += w * (d.vector.get(term) ?? 0)));
        return { item: d.item, score: d.norm ? dot / (qNorm * d.norm) : 0 };
      })
      .filter((r) => r.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }
}
