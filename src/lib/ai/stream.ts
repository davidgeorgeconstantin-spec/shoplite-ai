/**
 * Simulates token streaming, like an AI API that sends the answer piece by piece.
 * With the Vercel AI SDK / Gemini, the server would stream real tokens instead (see /server).
 */
export async function* streamText(text: string, { delay = 18, signal }: { delay?: number; signal?: AbortSignal } = {}) {
  const tokens = text.match(/\S+\s*|\n/g) ?? [];
  for (const token of tokens) {
    if (signal?.aborted) return;
    await new Promise((r) => setTimeout(r, delay + Math.random() * delay));
    yield token;
  }
}
