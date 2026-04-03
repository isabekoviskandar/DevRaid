'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { RollCandidate } from '@/types'
import { AvatarGlow } from '@/components/ui/avatar-glow'
import { FitScoreBadge } from '@/components/ui/fit-score-badge'
import { HexRadar } from '@/components/ui/hex-radar'
import { RoleChip } from '@/components/ui/card'

interface RollHeroRevealProps {
  candidates: RollCandidate[]
  onInvite: (heroId: string, roleId: string) => void
  onReroll: () => void
}

// Container: staggers children
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
} as const

// Each candidate card slides up + fades in
const cardVariants = {
  hidden:  { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 280, damping: 22 },
  },
}

function availabilityTone(fit: RollCandidate['availability_fit']) {
  if (fit === 'perfect') {
    return 'var(--color-dr-status-recruiting)'
  }

  if (fit === 'good') {
    return 'var(--color-dr-gold)'
  }

  return 'var(--color-dr-text-2)'
}

export function RollHeroReveal({ candidates, onInvite, onReroll }: RollHeroRevealProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="dr-title-fantasy text-lg font-semibold text-[var(--color-dr-text)]">
            Roll Results
          </h2>
          <p className="text-xs text-[var(--color-dr-text-2)]">
            {candidates.length} candidates matched to open roles
          </p>
        </div>
        <button
          onClick={onReroll}
          className="dr-label px-3 py-1.5 rounded-[var(--radius-badge)] transition-colors"
          style={{
            background: 'var(--color-dr-surface-2)',
            border: '1px solid var(--color-dr-edge)',
            color: 'var(--color-dr-text-2)',
          }}
        >
          Roll Again
        </button>
      </div>

      {/* Candidate cards with stagger */}
      <motion.ul
        variants={prefersReducedMotion ? undefined : containerVariants}
        initial={prefersReducedMotion ? undefined : 'hidden'}
        animate={prefersReducedMotion ? undefined : 'visible'}
        className="flex flex-col gap-3 list-none p-0 m-0"
      >
        {candidates.map((candidate) => (
          <motion.li
            key={`${candidate.hero.id}-${candidate.role.id}`}
            variants={prefersReducedMotion ? undefined : cardVariants}
          >
            <div
              className="dr-card flex flex-col gap-4 p-4 transition-all duration-200 hover:border-[var(--color-dr-edge-2)] md:flex-row md:items-center md:gap-5"
              style={{ borderColor: 'var(--color-dr-edge)' }}
            >
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <AvatarGlow
                  src={candidate.hero.avatar_url}
                  alt={candidate.hero.display_name}
                  fallback={candidate.hero.display_name[0] ?? '?'}
                  size="md"
                />

                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <Link
                      href={`/hero/${candidate.hero.id}`}
                      className="truncate text-sm font-semibold text-[var(--color-dr-text)] transition-colors hover:text-[var(--color-dr-glow)]"
                    >
                      {candidate.hero.display_name}
                    </Link>
                    <RoleChip role={candidate.role.role_name} />
                    <FitScoreBadge score={candidate.score} />
                  </div>

                  {candidate.hero.headline ? (
                    <p className="text-xs text-[var(--color-dr-text-2)]">
                      {candidate.hero.headline}
                    </p>
                  ) : null}

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span
                      className="dr-label text-[var(--color-dr-text-2)]"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      hard {candidate.hard_match}%
                    </span>
                    <span
                      className="dr-label text-[var(--color-dr-text-2)]"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      soft {candidate.soft_match}%
                    </span>
                    <span
                      className="dr-label"
                      style={{ color: availabilityTone(candidate.availability_fit) }}
                    >
                      availability {candidate.availability_fit}
                    </span>
                  </div>

                  {candidate.explainability?.top_gap_axes?.length ? (
                    <p className="dr-label mt-2 text-[var(--color-dr-text-2)] normal-case">
                      Best fills: {candidate.explainability.top_gap_axes.slice(0, 2).map(a => a.axis).join(', ')}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-4 md:ml-auto">
                {candidate.hero.soft_profile && (
                  <div
                    className="shrink-0 rounded-[calc(var(--radius-card)-6px)] border p-2"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--color-dr-edge) 88%, transparent)',
                      background: 'color-mix(in srgb, var(--color-dr-surface-2) 88%, transparent)',
                    }}
                  >
                    <HexRadar
                      profile={candidate.hero.soft_profile}
                      target={candidate.role.desired_soft_profile as any}
                      size={52}
                      showLabels={false}
                      variant="mini"
                    />
                  </div>
                )}

                <div className="ml-auto flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="dr-label text-[var(--color-dr-text-2)]">match score</p>
                    <p
                      className="text-xl font-semibold text-[var(--color-dr-text)]"
                      style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}
                    >
                      {candidate.score}
                    </p>
                  </div>

                  <button
                    onClick={() => onInvite(candidate.hero.id, candidate.role.id)}
                    className="shrink-0 rounded-[var(--radius-badge)] px-3 py-1.5 text-xs font-semibold transition-all duration-150 hover:scale-[1.02]"
                    style={{
                      background: 'var(--color-dr-glow-dim)',
                      border: '1px solid var(--color-dr-glow)',
                      color: 'var(--color-dr-glow)',
                    }}
                  >
                    Invite Hero
                  </button>
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
