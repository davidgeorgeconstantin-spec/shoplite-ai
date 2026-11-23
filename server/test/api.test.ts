import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { buildChatPrompt } from '../src/prompts.js';
import { parseShoppingQuery } from '../src/shared/intent.js';
import { TokenBucket } from '../src/shared/rateLimit.js';

const base = { clientOrigin: 'http://localhost:3000', geminiModel: 'test', ratePerMinute: 100 };

const events = (body: string) => body.split('\n\n').filter(Boolean).map((e) => JSON.parse(e.replace('data: ', '')));

describe('retrieval & parsing', () => {
  it('extracts price limits and intent from Romanian and English', () => {
    expect(parseShoppingQuery('cadou sub 150 lei')).toMatchObject({ maxPrice: 150, wantsGift: true });
    expect(parseShoppingQuery('grinder over 100')).toMatchObject({ minPrice: 100, category: 'equipment' });
  });
  it('puts retrieved products in the prompt and forbids invention', () => {
    const p = buildChatPrompt('which grinder do you have?');
    expect(p.context).toContain('Hand Grinder Pro');
    expect(p.system).toMatch(/ONLY the context/);
  });
  it('token bucket refills over time', () => {
    let t = 0;
    const b = new TokenBucket(2, 60, () => t);
    expect(b.tryTake() && b.tryTake()).toBe(true);
    expect(b.tryTake()).toBe(false);
    t += 1000; // 1 second → 1 token at 60/min
    expect(b.tryTake()).toBe(true);
  });
});

describe('API', () => {
  it('streams a fallback answer as SSE when no key is set', async () => {
    const res = await request(createApp(base)).post('/api/chat').send({ message: 'How long does shipping take?' });
    expect(res.headers['content-type']).toContain('text/event-stream');
    const ev = events(res.text);
    expect(ev[0]).toMatchObject({ type: 'sources', mode: 'fallback' });
    expect(ev.filter((e) => e.type === 'text').map((e) => e.text).join('')).toContain('200 RON');
    expect(ev.at(-1)).toEqual({ type: 'done' });
  });

  it('uses the LLM when a key is configured (mocked)', async () => {
    const llm = async function* () {
      yield 'Hello ';
      yield 'from Gemini';
    };
    const res = await request(createApp({ ...base, geminiApiKey: 'fake', llm })).post('/api/chat').send({ message: 'hi' });
    expect(events(res.text).filter((e) => e.type === 'text').map((e) => e.text).join('')).toBe('Hello from Gemini');
  });

  it('validates input and rate limits per IP', async () => {
    const app = createApp({ ...base, ratePerMinute: 2 });
    expect((await request(app).post('/api/chat').send({})).status).toBe(400);
    await request(app).post('/api/describe').send({ name: 'Mug', category: 'home', features: [], tone: 'short' });
    expect((await request(app).post('/api/describe').send({ name: 'Mug', category: 'home', features: [], tone: 'short' })).status).toBe(429);
  });

  it('returns a template description in fallback mode', async () => {
    const res = await request(createApp(base)).post('/api/describe').send({ name: 'Stoneware Mug', category: 'home', features: ['hand glazed'], tone: 'friendly' });
    expect(res.body.mode).toBe('fallback');
    expect(res.body.text).toContain('Stoneware Mug');
  });
});
