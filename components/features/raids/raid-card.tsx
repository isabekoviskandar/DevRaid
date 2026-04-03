'use client'

import type { CSSProperties, PointerEvent } from 'react'
import type { Raid } from '@/types'
import { StatusBadge } from '@/components/ui/card'
import { FitScoreBadge } from '@/components/ui/fit-score-badge'
import { HexSlotIndicator } from '@/components/ui/hex-slot-indicator'

interface RaidCardProps {
  raid: Raid
  fitScore?: number
  onClick?: () => void
}

const STAGE_LABELS: Record<Raid['stage'], string> = {
  idea:        'Idea',
  planning:    'Planning',
  development: 'Dev',
  testing:     'Testing',
  launched:    'Launched',
}

const ROLE_COLOR: Record<string, string> = {
  frontend:  'var(--color-dr-role-frontend)',
  backend:   'var(--color-dr-role-backend)',
  design:    'var(--color-dr-role-design)',
  mobile:    'var(--color-dr-role-mobile)',
  devops:    'var(--color-dr-role-devops)',
  marketing: 'var(--color-dr-role-marketing)',
  seo:       'var(--color-dr-role-seo)',
  data:      'var(--color-dr-role-data)',
}

const DEFAULT_GLOW_STYLE = {
  '--glow-x': '50%',
  '--glow-y': '50%',
} as CSSProperties

function setGlowPosition(target: HTMLDivElement, clientX: number, clientY: number) {
  const rect = target.getBoundingClientRect()
  target.style.setProperty('--glow-x', `${clientX - rect.left}px`)
  target.style.setProperty('--glow-y', `${clientY - rect.top}px`)
}

// ── Main card ───────────────────────────────────────────────────────────────
export function RaidCard({ raid, fitScore, onClick }: RaidCardProps) {
  const allRoles  = raid.roles
  const openRoles = allRoles.filter(r => r.slots_filled < r.slots_total)
  const primaryRole = openRoles[0]?.role_name ?? allRoles[0]?.role_name ?? 'frontend'
  const accentColor = ROLE_COLOR[primaryRole] ?? 'var(--color-dr-glow)'
  const score = fitScore ?? raid.fit_score
  const visibleSkills = (openRoles.length > 0 ? openRoles : allRoles)
    .flatMap(role => role.required_hard_skills.slice(0, 2))
    .slice(0, 3)

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    setGlowPosition(event.currentTarget, event.clientX, event.clientY)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    setGlowPosition(event.currentTarget, event.clientX, event.clientY)
  }

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--glow-x', '50%')
    event.currentTarget.style.setProperty('--glow-y', '50%')
  }

  return (
    <div
      className="dr-card dr-card--elevated dr-card--glow-emerald group relative flex h-full cursor-pointer flex-col gap-3 overflow-hidden p-4 pl-5 transition-[transform,border-color,box-shadow] duration-[var(--dur-normal)] ease-[var(--ease-out)] hover:-translate-y-1"
      onClick={onClick}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={DEFAULT_GLOW_STYLE}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[var(--dur-fast)] ease-[var(--ease-out)] group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(220px circle at var(--glow-x) var(--glow-y), color-mix(in srgb, var(--color-dr-glow) 18%, transparent) 0%, color-mix(in srgb, var(--color-dr-glow) 8%, transparent) 34%, transparent 72%)',
        }}
      />

      {/* Left accent seam */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[var(--radius-card)]"
        style={{
          background: `linear-gradient(180deg, ${accentColor} 0%, transparent 100%)`,
          opacity: 0.85,
        }}
      />

      {/* Header: title + score/status */}
      <div className="relative z-10 flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className="dr-title-fantasy text-sm font-bold leading-tight line-clamp-2"
            style={{ color: 'var(--color-dr-text)' }}
          >
            {raid.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span
              className="dr-label rounded-[var(--radius-badge)] px-2 py-1"
              style={{
                color: 'var(--color-dr-muted)',
                background: 'color-mix(in srgb, var(--color-dr-text-2) 8%, transparent)',
                border: '1px solid color-mix(in srgb, var(--color-dr-edge) 90%, transparent)',
              }}
            >
              Stage {STAGE_LABELS[raid.stage]}
            </span>
            <span
              className="dr-label rounded-[var(--radius-badge)] px-2 py-1"
              style={{
                color: 'var(--color-dr-text-2)',
                background: 'color-mix(in srgb, var(--color-dr-text-2) 7%, transparent)',
                border: '1px solid color-mix(in srgb, var(--color-dr-edge) 90%, transparent)',
              }}
            >
              Crew {raid.member_count}
            </span>
            <span
              className="dr-label rounded-[var(--radius-badge)] px-2 py-1"
              style={{
                color: accentColor,
                background: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
                border: `1px solid color-mix(in srgb, ${accentColor} 22%, transparent)`,
              }}
            >
              Open {openRoles.length}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StatusBadge status={raid.recruiting_status === 'open' ? 'recruiting' : 'closed'} />
          {score != null && <FitScoreBadge score={score} />}
        </div>
      </div>

      {/* Mission */}
      <p
        className="relative z-10 text-xs leading-relaxed line-clamp-2"
        style={{ color: 'var(--color-dr-text-2)' }}
      >
        {raid.mission}
      </p>

      {/* Hero Slots */}
      {allRoles.length > 0 && (
        <div className="relative z-10">
          <p className="dr-label mb-2" style={{ color: 'var(--color-dr-muted)', fontSize: '0.58rem' }}>
            HERO SLOTS
          </p>
          <div className="flex flex-wrap gap-3">
            {allRoles.map(role => (
              <div key={role.id} className="rounded-[var(--radius-badge)] px-2.5 py-2" style={{
                background: 'color-mix(in srgb, var(--color-dr-surface-2) 92%, transparent)',
                border: '1px solid color-mix(in srgb, var(--color-dr-edge) 90%, transparent)',
              }}>
                <div className="flex gap-1">
                  {Array.from({ length: role.slots_total }).map((_, i) => (
                    <HexSlotIndicator
                      key={i}
                      filled={i < role.slots_filled}
                      color={ROLE_COLOR[role.role_name] ?? 'var(--color-dr-glow)'}
                    />
                  ))}
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <span
                    className="dr-label"
                    style={{ color: 'var(--color-dr-muted)', fontSize: '0.55rem' }}
                  >
                    {role.role_name.charAt(0).toUpperCase() + role.role_name.slice(1)}
                  </span>
                  <span
                    className="dr-label"
                    style={{ color: ROLE_COLOR[role.role_name] ?? 'var(--color-dr-glow)', fontSize: '0.52rem' }}
                  >
                    {role.slots_filled}/{role.slots_total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer: skills + join */}
      <div
        className="relative z-10 mt-auto flex items-center justify-between gap-3 pt-2.5"
        style={{ borderTop: '1px solid var(--color-dr-edge)' }}
      >
        <div className="flex flex-wrap gap-1 min-w-0 overflow-hidden">
          {visibleSkills.map(skill => (
              <span
                key={skill}
                className="dr-label px-1.5 py-0.5 rounded"
                style={{
                  background: 'var(--color-dr-surface-2)',
                  border: '1px solid var(--color-dr-edge)',
                  color: 'var(--color-dr-text-2)',
                  fontSize: '0.58rem',
                }}
              >
                {skill}
              </span>
            ))}
        </div>
        <span
          className="dr-btn-primary shrink-0"
          style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}
        >
          Join Raid
        </span>
      </div>
    </div>
  )
}
