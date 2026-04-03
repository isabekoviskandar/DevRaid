'use client'

import * as Avatar from '@radix-ui/react-avatar'
import { motion, useReducedMotion } from 'framer-motion'

const SIZE_MAP = {
  sm: 40,
  md: 56,
  lg: 80,
  xl: 96,
} as const

type AvatarGlowSize = keyof typeof SIZE_MAP | number

interface AvatarGlowProps {
  src?: string | null
  alt: string
  fallback: string
  size?: AvatarGlowSize
  className?: string
}

function resolveSize(size: AvatarGlowSize): number {
  return typeof size === 'number' ? size : SIZE_MAP[size]
}

function normalizeFallback(fallback: string): string {
  const trimmed = fallback.trim()
  if (!trimmed) {
    return '?'
  }

  return trimmed.slice(0, 2).toUpperCase()
}

export function AvatarGlow({
  src,
  alt,
  fallback,
  size = 'md',
  className = '',
}: AvatarGlowProps) {
  const reduceMotion = useReducedMotion()
  const dimension = resolveSize(size)
  const innerInset = Math.max(4, Math.round(dimension * 0.08))
  const innerSize = dimension - innerInset * 2
  const normalizedFallback = normalizeFallback(fallback)
  const haloClassName = className ? ` ${className}` : ''

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center${haloClassName}`}
      style={{ width: dimension, height: dimension }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-dr-glow) 20%, transparent) 0%, transparent 72%)',
          boxShadow:
            '0 0 0 1px color-mix(in srgb, var(--color-dr-glow) 24%, transparent), 0 10px 24px rgba(3, 8, 16, 0.35)',
        }}
      />

      {reduceMotion ? null : (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--color-dr-glow) 16%, transparent) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.035, 1],
            opacity: [0.55, 0.9, 0.55],
          }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      <span
        aria-hidden="true"
        className="absolute rounded-full"
        style={{
          inset: Math.max(1, Math.round(dimension * 0.02)),
          border: '1px solid color-mix(in srgb, var(--color-dr-glow) 24%, transparent)',
          boxShadow:
            '0 0 0 1px color-mix(in srgb, var(--color-dr-glow) 12%, transparent), inset 0 0 16px color-mix(in srgb, var(--color-dr-glow) 10%, transparent)',
        }}
      />

      <Avatar.Root
        className="relative z-10 overflow-hidden rounded-full"
        style={{
          width: innerSize,
          height: innerSize,
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--color-dr-surface-2) 88%, white) 0%, var(--color-dr-surface-2) 100%)',
          border: '1px solid color-mix(in srgb, var(--color-dr-glow) 32%, transparent)',
          boxShadow:
            'inset 0 0 0 1px color-mix(in srgb, var(--color-dr-gold) 14%, transparent), inset 0 14px 30px rgba(255, 255, 255, 0.04)',
        }}
      >
        <Avatar.Image
          src={src ?? undefined}
          alt={alt}
          className="h-full w-full object-cover"
        />
        <Avatar.Fallback
          delayMs={150}
          className="flex h-full w-full items-center justify-center text-center text-sm font-semibold uppercase"
          style={{
            color: 'var(--color-dr-text)',
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--color-dr-surface-3) 88%, transparent) 0%, var(--color-dr-surface-2) 100%)',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.08em',
          }}
        >
          {normalizedFallback}
        </Avatar.Fallback>
      </Avatar.Root>
    </div>
  )
}
