import { cn } from '@/lib/utils'

interface FitScoreBadgeProps {
  score: number
  className?: string
}

export function FitScoreBadge({ score, className }: FitScoreBadgeProps) {
  const tier =
    score >= 80
      ? {
          color: 'var(--color-dr-gold)',
          background: 'color-mix(in srgb, var(--color-dr-gold) 12%, transparent)',
          border: 'color-mix(in srgb, var(--color-dr-gold) 28%, transparent)',
        }
      : score >= 60
        ? {
            color: 'var(--color-dr-glow)',
            background: 'color-mix(in srgb, var(--color-dr-glow) 12%, transparent)',
            border: 'color-mix(in srgb, var(--color-dr-glow) 30%, transparent)',
          }
        : {
            color: 'var(--color-dr-text-2)',
            background: 'color-mix(in srgb, var(--color-dr-text-2) 10%, transparent)',
            border: 'color-mix(in srgb, var(--color-dr-text-2) 24%, transparent)',
          }

  return (
    <span
      className={cn(
        'dr-label inline-flex items-center gap-1 rounded-[var(--radius-badge)] px-2 py-1 text-[0.65rem] leading-none whitespace-nowrap',
        className
      )}
      style={{
        color: tier.color,
        background: tier.background,
        border: `1px solid ${tier.border}`,
      }}
    >
      <span aria-hidden="true" className="text-[0.5rem]">
        ◆
      </span>
      {score}% fit
    </span>
  )
}
