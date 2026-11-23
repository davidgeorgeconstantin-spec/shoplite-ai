# ShopLite AI — Soluții

## Lecția 1
```ts
{ id: 'store', question: 'Do you have a physical store?', answer: 'No, ShopLite is an online-only demo store.', keywords: ['store', 'shop', 'physical', 'magazin', 'fizic', 'address', 'adresa'] },
```
Atenție: `detectIntent` decide dacă e FAQ după anumite cuvinte. Adaugă `store|magazin` în regex-ul pentru `faq` din `intent.ts`, altfel întrebarea e tratată ca căutare de produs.

## Lecția 2
Repetarea numelui îi crește **TF**-ul → cuvintele din nume cântăresc mai mult decât cele din descriere. Fără repetare, un produs care menționează „grinder” doar în descriere poate ieși la fel de sus ca „Hand Grinder Pro”.

## Lecția 3
În `parseShoppingQuery`, înainte de `under`/`over`:
```ts
const between = t.match(/\b(?:between|intre)\s*(\d+)\s*(?:and|si)\s*(\d+)/);
if (between) return { minPrice: Number(between[1]), maxPrice: Number(between[2]), category, wantsGift, wantsSale };
```
(Mută calculul `category`, `wantsGift`, `wantsSale` în variabile înainte de `return`.)

## Lecția 4
În `useChat.ts` adaugă un parametru: `send(text, speed = 18)` și trimite `{ delay: speed, signal }` la `streamText`. În `ChatWindow`, un `<select>` cu valorile 40 / 18 / 6.

## Lecția 5
În `useChat` returnează `remaining: bucket.current.remaining()` și afișează-l:
```tsx
<span className="text-xs text-slate-400">{remaining} messages left</span>
```
(Valoarea se actualizează la fiecare re-render, adică după fiecare mesaj.)

## Lecția 6
În `SpotlightCard.tsx`: `rgba(245,158,11,0.25)` în loc de `rgba(139,92,246,0.25)`.
