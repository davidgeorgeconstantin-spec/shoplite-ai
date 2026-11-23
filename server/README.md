# ShopLite AI API

```bash
cp .env.example .env
npm install
npm run dev     # http://localhost:4100
npm test
```

Without `GEMINI_API_KEY` the API runs in **fallback mode** (rule-based, free). To use Gemini:
1. Create a free key at https://aistudio.google.com (no card required).
2. Put it in `.env` as `GEMINI_API_KEY=...`. Never commit `.env` and never put the key in the frontend.

## Try it
```bash
curl -N -X POST localhost:4100/api/chat -H 'Content-Type: application/json' -d '{"message":"gift under 200 lei"}'
```
Response (Server-Sent Events):
```
data: {"type":"sources","sources":["Product: Coffee Gift Box", ...]}
data: {"type":"text","text":"Here "}
...
data: {"type":"done"}
```

## How the RAG prompt works
`src/prompts.ts` retrieves the top products and FAQ entries with TF-IDF and sends them as `CONTEXT`, with a system instruction to answer **only** from that context. A production version would use embeddings (e.g. Supabase **pgvector**) instead of TF-IDF.
