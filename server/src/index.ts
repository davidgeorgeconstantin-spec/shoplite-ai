import { createApp } from './app.js';

const env = process.env;
const app = createApp({
  clientOrigin: env.CLIENT_ORIGIN ?? 'http://localhost:3000',
  geminiApiKey: env.GEMINI_API_KEY || undefined,
  geminiModel: env.GEMINI_MODEL ?? 'gemini-2.0-flash',
  ratePerMinute: Number(env.RATE_LIMIT_PER_MINUTE ?? 10),
});
const port = Number(env.PORT ?? 4100);
app.listen(port, () => console.log(`ShopLite AI API on http://localhost:${port} (${env.GEMINI_API_KEY ? 'Gemini' : 'fallback'} mode)`));
