# ShopLite AI — Lecții (în română)

Proiectul 7: un asistent „AI” pentru magazin. Important: site-ul public rulează în **demo mode** (fără API AI, fără costuri). Varianta cu AI real (Gemini) e în `/server`.

## Lecția 1 — Ce e RAG (Retrieval-Augmented Generation)
Un model AI nu știe nimic despre magazinul tău. RAG = **întâi cauți** în datele tale, **apoi** îi dai modelului doar ce ai găsit:
1. **Retrieve** — găsești produsele/FAQ-urile relevante pentru întrebare
2. **Augment** — le pui în prompt ca „CONTEXT”
3. **Generate** — modelul răspunde *doar* din context
Avantaj: modelul nu inventează produse sau prețuri. Vezi `server/src/prompts.ts`.

**Exercițiu:** adaugă un FAQ nou („Aveți magazin fizic?”) în `data/faq.ts` și testează în chat.

## Lecția 2 — TF-IDF: căutare fără AI
`lib/ai/tfidf.ts`:
- **TF** — cât de des apare un cuvânt într-un document
- **IDF** — cât de rar e cuvântul în toate documentele (cuvintele rare contează mai mult)
- **Cosine similarity** — cât de „aproape” e întrebarea de fiecare document
În producție înlocuiești TF-IDF cu **embeddings** (vectori generați de un model) și **pgvector** — dar ideea e aceeași.

**Exercițiu:** în `catalogIndex.ts`, numele produsului apare de 2 ori în `productText`. De ce? Încearcă să-l pui o singură dată și compară rezultatele.

## Lecția 3 — Extragerea intenției
`lib/ai/intent.ts` citește din text: preț maxim („sub 200”), categorie („grinder”), cadou, reducere. Folosim **expresii regulate** și `normalize()` (scoate diacriticele: „ă” → „a”).
Căutarea „hibridă” = filtre exacte (preț) + scor de relevanță (TF-IDF).

**Exercițiu:** adaugă suport pentru „între 50 și 100 lei”.

## Lecția 4 — Streaming (textul apare pe bucăți)
API-urile AI trimit răspunsul **token cu token**. În browser simulăm asta cu un **async generator** (`stream.ts`): `for await (const token of streamText(text))`.
Serverul folosește **Server-Sent Events**: răspuns `text/event-stream`, fiecare bucată e `data: {...}\n\n`.
`AbortController` oprește streamul (butonul Stop) — pe server asta înseamnă și **cost mai mic**.

**Exercițiu:** fă viteza de streaming configurabilă (lent / normal / rapid) în chat.

## Lecția 5 — Rate limiting (protecția costurilor)
Fiecare apel AI costă (sau consumă din cota gratuită). **Token bucket**: ai N „jetoane”; fiecare mesaj consumă unul; se reumplu în timp. Fără jetoane → 429 Too Many Requests.
Testul folosește un ceas fals (`now: () => t`) ca să nu aștepte secunde reale.

**Exercițiu:** afișează în header-ul chat-ului câte mesaje mai ai disponibile (`bucket.remaining()`).

## Lecția 6 — Animații: motion values și scroll
- `useMotionValue` + `useMotionTemplate` (SpotlightCard) → lumina urmărește mouse-ul **fără re-render** React
- `useScroll` + `useSpring` + `pathLength` (Pipeline) → linia se desenează când derulezi
- `useInView` (DemoPreview) → animația rulează doar când e vizibilă (economisește CPU)

**Exercițiu:** schimbă culoarea luminii din SpotlightCard în chihlimbar (amber).
