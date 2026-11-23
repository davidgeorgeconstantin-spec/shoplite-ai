// Copied from the frontend (src/) so both sides use the same retrieval rules.
export type Tone = 'friendly' | 'premium' | 'short';

export interface DescribeInput {
  name: string;
  category: string;
  features: string[];
  tone: Tone;
}

const OPENERS: Record<Tone, string[]> = {
  friendly: ['Meet your new favorite:', 'Say hello to', 'Your mornings just got better with'],
  premium: ['Crafted for those who care about every detail,', 'Discover', 'Elevate your ritual with'],
  short: [''],
};

/**
 * DEMO MODE description writer — templates, not an AI model.
 * The server version sends the same fields to Gemini with a prompt (see server/src/prompts.ts).
 */
export function generateDescription({ name, category, features, tone }: DescribeInput, seed = 0): string {
  const f = features.map((x) => x.trim()).filter(Boolean);
  if (tone === 'short') return `${name}: ${f.slice(0, 3).join(', ') || category}.`;
  const opener = OPENERS[tone][seed % OPENERS[tone].length];
  const list = f.length > 1 ? `${f.slice(0, -1).join(', ')} and ${f.at(-1)}` : (f[0] ?? `everything you need in ${category}`);
  const close = tone === 'premium' ? 'A quiet upgrade you will notice every single day.' : 'Add it to your cart and treat yourself!';
  return `${opener} ${name}. Designed for ${category} lovers, it brings ${list}. ${close}`.replace(/\s+/g, ' ').trim();
}
