import cors from 'cors';
import express, { type Response } from 'express';
import { z } from 'zod';
import { streamGemini } from './gemini.js';
import { buildChatPrompt, buildDescribePrompt } from './prompts.js';
import { rateLimit } from './rateLimit.js';
import { answer } from './shared/assistant.js';
import { generateDescription } from './shared/describe.js';

export interface Config {
  clientOrigin: string;
  geminiApiKey?: string;
  geminiModel: string;
  ratePerMinute: number;
  /** injectable for tests */
  llm?: typeof streamGemini;
}

const chatBody = z.object({ message: z.string().min(1).max(500) });
const describeBody = z.object({ name: z.string().min(1).max(80), category: z.string().max(40), features: z.array(z.string().max(80)).max(10), tone: z.enum(['friendly', 'premium', 'short']) });

/** Server-Sent Events helpers: each chunk is `data: {...}\n\n`. */
function sse(res: Response) {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.flushHeaders();
  return (event: Record<string, unknown>) => res.write(`data: ${JSON.stringify(event)}\n\n`);
}

async function* chunk(text: string) {
  for (const t of text.match(/\S+\s*|\n/g) ?? []) yield t;
}

export function createApp(config: Config) {
  const app = express();
  const llm = config.llm ?? streamGemini;
  app.use(cors({ origin: config.clientOrigin }));
  app.use(express.json({ limit: '10kb' }));
  app.get('/health', (_req, res) => res.json({ ok: true, mode: config.geminiApiKey ? 'gemini' : 'fallback' }));

  const limited = rateLimit(config.ratePerMinute);

  app.post('/api/chat', limited, async (req, res) => {
    const parsed = chatBody.safeParse(req.body);
    if (!parsed.success) return void res.status(400).json({ error: 'message is required (max 500 chars)' });
    const { message } = parsed.data;
    const send = sse(res);
    const ctrl = new AbortController();
    res.on('close', () => ctrl.abort()); // user closed the tab → stop paying for tokens

    try {
      if (config.geminiApiKey) {
        const { system, context, sources } = buildChatPrompt(message);
        send({ type: 'sources', sources });
        for await (const t of llm({ apiKey: config.geminiApiKey, model: config.geminiModel, system, prompt: `CONTEXT:\n${context}\n\nQUESTION: ${message}`, signal: ctrl.signal })) send({ type: 'text', text: t });
      } else {
        const reply = answer(message); // same rule-based engine as the website
        send({ type: 'sources', sources: reply.sources, mode: 'fallback' });
        for await (const t of chunk(reply.text)) send({ type: 'text', text: t });
        send({ type: 'products', ids: reply.products.map((p) => p.id) });
      }
      send({ type: 'done' });
    } catch {
      send({ type: 'error', error: 'The AI service is unavailable right now.' });
    }
    res.end();
  });

  app.post('/api/describe', limited, async (req, res) => {
    const parsed = describeBody.safeParse(req.body);
    if (!parsed.success) return void res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors });
    if (!config.geminiApiKey) return void res.json({ mode: 'fallback', text: generateDescription(parsed.data) });
    let text = '';
    for await (const t of llm({ apiKey: config.geminiApiKey, model: config.geminiModel, system: 'You write honest, concise e-commerce copy.', prompt: buildDescribePrompt(parsed.data) })) text += t;
    res.json({ mode: 'gemini', text: text.trim() });
  });

  return app;
}
