import { cn } from '@/lib/utils'

interface StepProgressProps {
  currentStep: number
  totalSteps: number
  className?: string
}

/** Above this, per-step hex icons overflow narrow sidebars — use an equal-width segment strip. */
const COMPACT_THRESHOLD = 10

export function StepProgress({ currentStep, totalSteps, className }: StepProgressProps) {
  if (totalSteps <= 0) return null

  const steps = Array.from({ length: totalSteps }, (_, index) => index)
  const useCompact = totalSteps > COMPACT_THRESHOLD

  if (useCompact) {
    return (
      <div
        className={cn(
          'relative rounded-[var(--radius-card)] border px-3 py-3 sm:px-4 sm:py-3.5',
          className
        )}
        style={{
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--color-dr-text) 4%, transparent) 0%, transparent 100%), var(--glass-panel)',
          borderColor: 'color-mix(in srgb, var(--glass-border-soft) 90%, transparent)',
        }}
        role="img"
        aria-label={`Assessment progress: step ${Math.min(currentStep + 1, totalSteps)} of ${totalSteps}`}
      >
        <div className="flex h-6 w-full gap-px sm:h-7">
          {steps.map(stepIndex => {
            const isCompleted = stepIndex < currentStep
            const isActive = stepIndex === currentStep

            const color = isCompleted
              ? 'var(--color-dr-gold)'
              : isActive
                ? 'var(--color-dr-glow)'
                : 'var(--color-dr-text-2)'

            const bg = isCompleted
              ? 'color-mix(in srgb, var(--color-dr-gold) 38%, transparent)'
              : isActive
                ? 'color-mix(in srgb, var(--color-dr-glow) 32%, transparent)'
                : 'color-mix(in srgb, var(--color-dr-text-2) 10%, transparent)'

            return (
              <div
                key={stepIndex}
                className="min-w-0 flex-1 rounded-[2px] border transition-colors duration-150"
                style={{
                  borderColor: `color-mix(in srgb, ${color} 42%, transparent)`,
                  background: bg,
                  boxShadow: isActive ? '0 0 10px color-mix(in srgb, var(--color-dr-glow) 35%, transparent)' : undefined,
                }}
                title={`Question ${stepIndex + 1}${isCompleted ? ' — done' : isActive ? ' — current' : ''}`}
              />
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative overflow-x-auto rounded-[var(--radius-card)] border px-3 py-3 sm:px-4 sm:py-4',
        className
      )}
      style={{
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--color-dr-text) 4%, transparent) 0%, transparent 100%), var(--glass-panel)',
        borderColor: 'color-mix(in srgb, var(--glass-border-soft) 90%, transparent)',
      }}
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute left-4 right-4 top-1/2 h-px -translate-y-1/2 sm:left-5 sm:right-5"
        style={{
          background:
            'linear-gradient(90deg, color-mix(in srgb, var(--color-dr-gold) 22%, transparent) 0%, color-mix(in srgb, var(--color-dr-glow) 18%, transparent) 45%, color-mix(in srgb, var(--color-dr-edge) 92%, transparent) 100%)',
        }}
      />

      <ol className="relative flex min-w-max items-center justify-center gap-1 sm:gap-1.5">
        {steps.map(stepIndex => {
          const isCompleted = stepIndex < currentStep
          const isActive = stepIndex === currentStep

          const color = isCompleted
            ? 'var(--color-dr-gold)'
            : isActive
              ? 'var(--color-dr-glow)'
              : 'var(--color-dr-text-2)'

          const fill = isCompleted
            ? 'color-mix(in srgb, var(--color-dr-gold) 22%, transparent)'
            : isActive
              ? 'color-mix(in srgb, var(--color-dr-glow) 18%, transparent)'
              : 'color-mix(in srgb, var(--color-dr-text-2) 8%, transparent)'

          return (
            <li key={stepIndex} className="flex shrink-0 items-center justify-center">
              <span
                className={cn(
                  'flex h-4 w-4 items-center justify-center rounded-[4px] border transition-all duration-[var(--dur-fast)] ease-[var(--ease-out)]',
                  isActive && 'scale-110'
                )}
                style={{
                  color,
                  background: fill,
                  borderColor: `color-mix(in srgb, ${color} 36%, transparent)`,
                  boxShadow: isActive ? 'var(--shadow-glow-sm)' : 'none',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <polygon
                    points="10,1.5 17.5,5.75 17.5,14.25 10,18.5 2.5,14.25 2.5,5.75"
                    fill={fill}
                    stroke={color}
                    strokeWidth={1.35}
                    opacity={isCompleted || isActive ? 1 : 0.5}
                  />
                </svg>
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
