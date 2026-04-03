'use client'

import { useEffect, useState } from 'react'
import { RollHeroReveal } from '@/components/features/raids/roll-hero-reveal'
import { D20RollAnimation } from '@/components/features/captain/d20-roll-animation'
import type { RollCandidate } from '@/types'

interface CaptainRollSectionProps {
  candidates: RollCandidate[]
}

type RollPhase = 'intro' | 'rolling' | 'results'

export function CaptainRollSection({ candidates }: CaptainRollSectionProps) {
  const [phase, setPhase] = useState<RollPhase>('intro')
  const [current, setCurrent] = useState(candidates)

  useEffect(() => {
    setCurrent(candidates)
  }, [candidates])

  if (phase === 'intro') {
    return (
      <div className="dr-card p-8 flex flex-col items-center gap-5 text-center">
        <div>
          <h2
            className="dr-title-fantasy text-xl font-bold mb-2"
            style={{ color: 'var(--color-dr-text)' }}
          >
            Roll for Heroes
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-dr-text-2)' }}>
            {candidates.length} candidates matched to your open roles
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPhase('rolling')}
          className="px-7 py-3 rounded-[var(--radius-badge)] text-sm font-bold transition-all hover:scale-105 active:scale-95"
          style={{ background: 'var(--color-dr-glow)', color: '#fff' }}
        >
          ⚔ Roll Now
        </button>
      </div>
    )
  }

  if (phase === 'rolling') {
    return <D20RollAnimation onComplete={() => setPhase('results')} />
  }

  return (
    <RollHeroReveal
      candidates={current}
      onInvite={(heroId, roleId) => {
        // TODO: POST /api/match { direction: 'invite', hero_id, role_id }
        setCurrent(prev => prev.filter(c => !(c.hero.id === heroId && c.role.id === roleId)))
      }}
      onReroll={() => {
        setCurrent(prev => [...prev].sort(() => Math.random() - 0.5))
        setPhase('rolling')
      }}
    />
  )
}
