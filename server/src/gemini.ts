/**
 * Streams text from Google Gemini using its REST API with Server-Sent Events (alt=sse).
 * Free tier key from https://aistudio.google.com — keep it in .env, never in the frontend.
 */
export async function* streamGemini(opts: { apiKey: string; model: string; system: string; prompt: string; signal?: AbortSignal }): AsyncGenerator<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${opts.model}:streamGenerateContent?alt=sse`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': opts.apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: opts.system }] },
      contents: [{ role: 'user', parts: [{ text: opts.prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 300 },
    }),
    signal: opts.signal,
  });
  if (!res.ok || !res.body) throw new Error(`Gemini error ${res.status}`);

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';
    for (const ev of events) {
      const data = ev.replace(/^data: /, '').trim();
      if (!data) continue;
      const json = JSON.parse(data) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
      const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('');
      if (text) yield text;
    }
  }
}
