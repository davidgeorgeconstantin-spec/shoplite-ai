'use client';

import { useCallback, useRef, useState } from 'react';
import { answer } from '@/lib/ai/assistant';
import { TokenBucket } from '@/lib/ai/rateLimit';
import { streamText } from '@/lib/ai/stream';
import { createId } from '@/lib/id';
import type { ChatMessage } from '@/types';

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: "Hi! I'm the ShopLite assistant (demo mode). Ask me for product recommendations or about shipping, returns and payment.",
};

/**
 * Chat state machine: idle → thinking → streaming → idle.
 * Same API you'd get from `useChat` in the Vercel AI SDK, but the "model" is the local rule-based assistant.
 */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [status, setStatus] = useState<'idle' | 'thinking' | 'streaming'>('idle');
  const abortRef = useRef<AbortController | null>(null);
  const bucket = useRef(new TokenBucket(6, 6)); // 6 messages, refills 6 per minute

  const patchLast = (patch: Partial<ChatMessage>) =>
    setMessages((m) => m.map((msg, i) => (i === m.length - 1 ? { ...msg, ...patch } : msg)));

  const send = useCallback(async (text: string) => {
    const question = text.trim();
    if (!question) return;
    setMessages((m) => [...m, { id: createId(), role: 'user', text: question }]);

    if (!bucket.current.tryTake()) {
      setMessages((m) => [...m, { id: createId(), role: 'assistant', text: '⏳ You are sending messages too fast (rate limit). Please wait a few seconds.' }]);
      return;
    }

    setStatus('thinking');
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 400)); // "retrieval" time
    const reply = answer(question);

    const controller = new AbortController();
    abortRef.current = controller;
    setMessages((m) => [...m, { id: createId(), role: 'assistant', text: '' }]);
    setStatus('streaming');
    let acc = '';
    for await (const token of streamText(reply.text, { signal: controller.signal })) {
      acc += token;
      patchLast({ text: acc });
    }
    // products and sources appear after the text, like tool results
    patchLast({ text: acc, products: reply.products, sources: reply.sources });
    setStatus('idle');
  }, []);

  const stop = useCallback(() => abortRef.current?.abort(), []);
  const reset = useCallback(() => setMessages([WELCOME]), []);

  return { messages, status, send, stop, reset };
}
