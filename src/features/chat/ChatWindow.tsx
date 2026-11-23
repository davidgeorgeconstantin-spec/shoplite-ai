'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingDots } from './TypingDots';
import { useChat } from './useChat';

const SUGGESTIONS = ['A gift for a coffee lover under 200 lei', 'Which coffee is best for espresso?', 'How long does shipping take?', 'Can I return opened coffee?', 'Any grinder on sale?'];

export function ChatWindow() {
  const { messages, status, send, stop, reset } = useChat();
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLUListElement>(null);
  const busy = status !== 'idle';

  // keep the newest message in view while streaming
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, status]);

  function submit(text: string) {
    if (busy) return;
    setInput('');
    void send(text);
  }

  return (
    <div className="flex h-[calc(100vh-11rem)] min-h-[520px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-violet-950/40 backdrop-blur">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" /></span>
          <p className="font-semibold">ShopLite assistant</p>
          <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-xs font-semibold text-amber-300"><span className="hidden sm:inline">Demo mode · no AI API</span><span className="sm:hidden">Demo</span></span>
        </div>
        <button onClick={reset} className="text-sm text-slate-400 hover:text-white">New chat</button>
      </header>

      <ul ref={listRef} className="flex-1 space-y-5 overflow-y-auto px-5 py-6" aria-live="polite">
        {messages.map((m, i) => (
          <MessageBubble key={m.id} message={m} streaming={status === 'streaming' && i === messages.length - 1} />
        ))}
        <AnimatePresence>{status === 'thinking' && <TypingDots />}</AnimatePresence>
      </ul>

      <div className="border-t border-white/10 p-4">
        <AnimatePresence>
          {messages.length <= 2 && !busy && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, i) => (
                <motion.button key={s} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => submit(s)} className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-slate-300 hover:border-violet-400 hover:text-white">
                  {s}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <form onSubmit={(e) => (e.preventDefault(), submit(input))} className="flex items-center gap-2 rounded-2xl bg-white/5 p-1.5 ring-1 ring-white/10 focus-within:ring-violet-400">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about products, shipping, returns…" aria-label="Message" className="flex-1 bg-transparent px-3 py-2 outline-none placeholder:text-slate-500" />
          <AnimatePresence mode="wait" initial={false}>
            {status === 'streaming' ? (
              <motion.button key="stop" type="button" onClick={stop} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="grid h-10 w-10 place-items-center rounded-xl bg-white/10" aria-label="Stop">
                <span className="h-3 w-3 rounded-sm bg-white" />
              </motion.button>
            ) : (
              <motion.button key="send" disabled={!input.trim() || busy} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} whileTap={{ scale: 0.9 }} className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 disabled:opacity-40" aria-label="Send">
                ↑
              </motion.button>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
