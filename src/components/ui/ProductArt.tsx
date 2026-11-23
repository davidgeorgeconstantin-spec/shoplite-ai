import { cn } from '@/lib/cn';

/** Generated product "photo": soft gradient + emoji. No external images needed. */
export function ProductArt({ emoji, hue, className, size = 'md' }: { emoji: string; hue: number; className?: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div
      className={cn('relative grid place-items-center overflow-hidden', className)}
      style={{ background: `radial-gradient(circle at 30% 25%, hsl(${hue} 90% 94%), hsl(${hue} 70% 82%) 60%, hsl(${hue} 55% 70%))` }}
    >
      <div aria-hidden="true" className="absolute -bottom-1/4 -right-1/4 h-3/4 w-3/4 rounded-full bg-white/25 blur-2xl" />
      <span aria-hidden="true" className={cn('relative drop-shadow-xl', size === 'sm' && 'text-3xl', size === 'md' && 'text-7xl', size === 'lg' && 'text-[9rem]')}>
        {emoji}
      </span>
    </div>
  );
}
