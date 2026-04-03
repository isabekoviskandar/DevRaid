'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const ROLL_MS = 1200

/** D20-style roll (~1.2s) before revealing Roll Hero results. */
export function D20RollAnimation({ onComplete }: { onComplete: () => void }) {
  const reduce = useReducedMotion()
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (reduce) {
      onCompleteRef.current()
      return
    }
    const t = window.setTimeout(() => onCompleteRef.current(), ROLL_MS)
    return () => window.clearTimeout(t)
  }, [reduce])

  if (reduce) {
    return (
      <div
        className="dr-card flex min-h-[200px] flex-col items-center justify-center gap-4 p-10 text-center"
        style={{ borderColor: 'var(--color-dr-edge)' }}
      >
        <div
          className="flex h-24 w-24 items-center justify-center rounded-[28px] border"
          style={{
            borderColor: 'color-mix(in srgb, var(--color-dr-gold) 42%, transparent)',
            background:
              'radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--color-dr-glow) 14%, transparent) 0%, var(--color-dr-surface-2) 72%)',
            boxShadow:
              'inset 0 0 0 1px color-mix(in srgb, var(--color-dr-glow) 18%, transparent), 0 14px 30px rgba(3, 8, 16, 0.34)',
          }}
        >
          <span
            className="text-xl font-semibold tracking-[0.18em]"
            style={{ color: 'var(--color-dr-gold)', fontFamily: 'var(--font-mono)' }}
          >
            D20
          </span>
        </div>
        <p className="dr-label" style={{ color: 'var(--color-dr-text-2)' }}>Roll complete</p>
      </div>
    )
  }

  return (
    <div
      className="dr-card flex min-h-[220px] flex-col items-center justify-center gap-6 p-10 text-center"
      style={{ borderColor: 'var(--color-dr-edge)' }}
    >
      <p
        className="dr-label"
        style={{ color: 'var(--color-dr-gold)', letterSpacing: '0.14em' }}
      >
        CAPTAIN MATCHING
      </p>
      <motion.div
        initial={{ rotate: 0, scale: 0.9 }}
        animate={{ rotate: 720, scale: [0.9, 1.12, 1] }}
        transition={{ duration: ROLL_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-28 w-28 select-none items-center justify-center rounded-[32px] border"
        style={{
          borderColor: 'color-mix(in srgb, var(--color-dr-gold) 46%, transparent)',
          background:
            'radial-gradient(circle at 32% 28%, color-mix(in srgb, var(--color-dr-glow) 18%, transparent) 0%, var(--color-dr-surface-2) 70%)',
          boxShadow:
            'inset 0 0 0 1px color-mix(in srgb, var(--color-dr-glow) 20%, transparent), 0 18px 36px rgba(3, 8, 16, 0.36)',
        }}
        aria-hidden
      >
        <div
          className="absolute inset-[10px] rounded-[24px] border"
          style={{
            borderColor: 'color-mix(in srgb, var(--color-dr-glow) 20%, transparent)',
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--color-dr-surface-3) 60%, transparent) 0%, transparent 100%)',
          }}
        />
        <span
          className="relative text-2xl font-semibold tracking-[0.18em]"
          style={{ color: 'var(--color-dr-gold)', fontFamily: 'var(--font-mono)' }}
        >
          D20
        </span>
      </motion.div>
      <p className="dr-label" style={{ color: 'var(--color-dr-text-2)' }}>
        Rolling for heroes
      </p>
      <p className="text-sm text-[var(--color-dr-text-2)]">
        Matching guild-ready candidates to open raid roles.
      </p>
    </div>
  )
}
