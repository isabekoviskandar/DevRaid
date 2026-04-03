'use client'

import { useRef } from 'react'
import * as Progress from '@radix-ui/react-progress'
import { motion, useInView, useReducedMotion } from 'framer-motion'

interface SkillBarProps {
  label: string
  value: number
  hint?: string
  emphasis?: 'emerald' | 'gold'
  size?: 'sm' | 'md'
  className?: string
}

function clampValue(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function SkillBar({
  label,
  value,
  hint,
  emphasis = 'emerald',
  size = 'md',
  className = '',
}: SkillBarProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { once: true, amount: 0.45 })
  const reduceMotion = useReducedMotion()
  const clampedValue = clampValue(value)
  const fillScale = reduceMotion || isInView ? clampedValue / 100 : 0
  const trackHeight = size === 'sm' ? 6 : 8
  const fillBackground =
    emphasis === 'gold'
      ? 'linear-gradient(90deg, color-mix(in srgb, var(--color-dr-gold) 92%, white) 0%, var(--color-dr-gold) 100%)'
      : 'linear-gradient(90deg, color-mix(in srgb, var(--color-dr-glow) 88%, white) 0%, var(--color-dr-glow) 100%)'
  const wrapperClassName = className ? ` ${className}` : ''

  return (
    <div ref={ref} className={`flex flex-col gap-1.5${wrapperClassName}`}>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[var(--color-dr-text)]">{label}</p>
          {hint ? (
            <p className="dr-label mt-0.5 text-[var(--color-dr-text-2)] normal-case">{hint}</p>
          ) : null}
        </div>
        <span
          className="dr-label shrink-0 text-[var(--color-dr-text-2)]"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {clampedValue}%
        </span>
      </div>

      <Progress.Root
        value={clampedValue}
        className="relative w-full overflow-hidden rounded-full"
        style={{
          height: trackHeight,
          background: 'color-mix(in srgb, var(--color-dr-surface-3) 92%, transparent)',
          boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--color-dr-edge) 72%, transparent)',
        }}
      >
        <motion.div
          className="h-full w-full rounded-full"
          style={{
            background: fillBackground,
            boxShadow:
              emphasis === 'gold'
                ? '0 0 14px color-mix(in srgb, var(--color-dr-gold) 30%, transparent)'
                : '0 0 14px color-mix(in srgb, var(--color-dr-glow) 24%, transparent)',
            transformOrigin: 'left center',
          }}
          initial={false}
          animate={{ scaleX: fillScale }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: 0.78,
                  delay: isInView ? 0.08 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }
          }
        />
      </Progress.Root>
    </div>
  )
}
