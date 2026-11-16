import type { StressStatus } from '@/lib/governance-data';
import { cn } from '@/lib/cn';

const TONE_CLASS = {
  critical: {
    badge: 'text-red-400 bg-red-950/50 border-red-800',
    dot: 'bg-red-500 animate-pulse',
  },
  strained: {
    badge: 'text-amber-400 bg-amber-950/50 border-amber-800',
    dot: 'bg-amber-500',
  },
  stable: {
    badge: 'text-emerald-400 bg-emerald-950/50 border-emerald-800',
    dot: 'bg-emerald-500',
  },
} as const;

export function StatusBadge({ status }: { status: StressStatus }) {
  const tone = TONE_CLASS[status.tone];

  return (
    <span
      className={cn(
        'text-[10px] font-mono px-2 py-0.5 rounded border inline-flex items-center gap-1.5 whitespace-nowrap',
        tone.badge,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', tone.dot)} aria-hidden="true" />
      {status.label}
    </span>
  );
}
