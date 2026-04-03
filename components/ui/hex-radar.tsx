'use client'

import { motion, useReducedMotion } from 'framer-motion'
import * as Tooltip from '@radix-ui/react-tooltip'
import { SoftSkillHexagon } from '@/types'

export type SoftSkillProfile = SoftSkillHexagon

export const AXIS_DISPLAY_NAMES: Record<
  'drive' | 'reliability' | 'communication' | 'tempo' | 'mastery' | 'adaptability',
  string
> = {
  drive:         'Drive',
  reliability:   'Reliability',
  communication: 'Communication',
  tempo:         'Tempo',
  mastery:       'Mastery',
  adaptability:  'Adaptability',
}

export const HEX_AXES = [
  { key: 'drive',         label: 'Drive',  color: 'var(--color-dr-axis-initiative)' },
  { key: 'reliability',   label: 'Rel',    color: 'var(--color-dr-axis-expertise)' },
  { key: 'communication', label: 'Comm',   color: 'var(--color-dr-axis-communication)' },
  { key: 'tempo',         label: 'Tempo',  color: 'var(--color-dr-axis-speed)' },
  { key: 'mastery',       label: 'Mastery',color: 'var(--color-dr-gold)' },
  { key: 'adaptability',  label: 'Adapt',  color: 'var(--color-dr-axis-flexibility)' },
] as const

type AxisKey = (typeof HEX_AXES)[number]['key']

function hexPoint(cx: number, cy: number, r: number, i: number): [number, number] {
  const angle = (Math.PI / 3) * i - Math.PI / 2
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
}

function profileToPoints(
  profile: SoftSkillProfile,
  cx: number,
  cy: number,
  maxR: number
): string {
  return HEX_AXES.map(({ key }, i) => {
    const value = normalizedAxisValue(profile, key as AxisKey) / 10
    const [x, y] = hexPoint(cx, cy, maxR * value, i)
    return `${x},${y}`
  }).join(' ')
}

function normalizedAxisValue(profile: SoftSkillProfile, axis: AxisKey): number {
  const direct = profile[axis]
  if (typeof direct === 'number') {
    return direct > 10 ? direct / 10 : direct
  }

  // Legacy fallback mapping (old 5-axis onboarding model).
  const legacyMap: Partial<Record<AxisKey, number | undefined>> = {
    drive: profile.initiative,
    reliability:
      typeof profile.initiative === 'number' && typeof profile.flexibility === 'number'
        ? (profile.initiative + profile.flexibility) / 2
        : undefined,
    communication: profile.communication,
    tempo: profile.speed,
    mastery: profile.expertise,
    adaptability: profile.flexibility,
  }
  const legacy = legacyMap[axis]
  if (typeof legacy === 'number') {
    return legacy > 10 ? legacy / 10 : legacy
  }
  return 5
}

function gridHexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => hexPoint(cx, cy, r, i))
    .map(([x, y]) => `${x},${y}`)
    .join(' ')
}

interface HexRadarProps {
  profile: SoftSkillProfile
  target?: SoftSkillProfile
  size?: number
  showLabels?: boolean
  variant?: 'full' | 'mini'
  className?: string
  /** Default true for full; mini cards default to false via internal logic */
  animated?: boolean
}

export function HexRadar({
  profile,
  target,
  size = 120,
  showLabels = true,
  variant = 'full',
  className = '',
  animated,
}: HexRadarProps) {
  const reduceMotion = useReducedMotion()
  const isMini = variant === 'mini'
  const allowAnimate = (animated ?? !isMini) && !reduceMotion

  const cx = size / 2
  const cy = size / 2
  const maxR = size * 0.38
  const gridLevels = [0.25, 0.5, 0.75, 1]
  const labelFontSize = isMini ? 0 : Math.max(9, Math.min(13, size * 0.052))
  const labelPad =
    showLabels && !isMini ? Math.max(40, Math.round(labelFontSize * 5.4)) : 0
  const vb = `${-labelPad} ${-labelPad} ${size + 2 * labelPad} ${size + 2 * labelPad}`
  const labelOffset = maxR + (isMini ? 10 : Math.max(14, size * 0.09))
  const vertexDotR = isMini
    ? Math.max(1.5, Math.min(2.75, size * 0.045))
    : Math.max(2, Math.min(4.25, size * 0.016))
  const profileStrokeW = isMini ? 1 : 1.15
  const profileFillOpacity = isMini ? 0.18 : 0.3

  const chart = (
    <>
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={gridHexPoints(cx, cy, maxR * level)}
          fill="none"
          stroke="var(--color-dr-edge)"
          strokeWidth={0.5}
          opacity={0.6}
        />
      ))}

      {HEX_AXES.map(({ key: _key }, i) => {
        const [x, y] = hexPoint(cx, cy, maxR, i)
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={x} y2={y}
            stroke="var(--color-dr-edge)"
            strokeWidth={0.5}
            opacity={0.5}
          />
        )
      })}

      {target && (
        <polygon
          points={profileToPoints(target, cx, cy, maxR)}
          fill="var(--color-dr-gold-dim)"
          stroke="var(--color-dr-gold)"
          strokeWidth={1}
          strokeDasharray="3 2"
          opacity={0.7}
        />
      )}

      {allowAnimate ? (
        <motion.polygon
          points={profileToPoints(profile, cx, cy, maxR)}
          fill="var(--color-dr-glow)"
          fillOpacity={profileFillOpacity}
          stroke="var(--color-dr-glow)"
          strokeWidth={profileStrokeW}
          strokeLinejoin="round"
          initial={{ pathLength: 0, fillOpacity: 0.04, opacity: 0.5 }}
          animate={{ pathLength: 1, fillOpacity: profileFillOpacity, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : (
        <polygon
          points={profileToPoints(profile, cx, cy, maxR)}
          fill="var(--color-dr-glow)"
          fillOpacity={profileFillOpacity}
          stroke="var(--color-dr-glow)"
          strokeWidth={profileStrokeW}
          strokeLinejoin="round"
        />
      )}

      {HEX_AXES.map(({ key, color }, i) => {
        const value = normalizedAxisValue(profile, key as AxisKey) / 10
        const [x, y] = hexPoint(cx, cy, maxR * value, i)
        const label = AXIS_DISPLAY_NAMES[key as AxisKey]
        const val = normalizedAxisValue(profile, key as AxisKey)

        const dot = (
          <circle
            cx={x}
            cy={y}
            r={vertexDotR}
            fill={color}
            fillOpacity={0.92}
            stroke="var(--color-dr-bg)"
            strokeWidth={size < 80 ? 0.35 : 0.5}
          />
        )

        if (isMini) {
          return <g key={key}>{dot}</g>
        }

        return (
          <Tooltip.Root key={key} delayDuration={200}>
            <Tooltip.Trigger asChild>
              <g
                tabIndex={0}
                className="cursor-default outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-dr-glow)] rounded-full"
                style={{ transformOrigin: `${x}px ${y}px` }}
              >
                {dot}
              </g>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                sideOffset={6}
                className="z-[200] rounded-[var(--radius-badge)] border px-2.5 py-1.5 text-xs shadow-lg"
                style={{
                  background:   'var(--color-dr-surface-2)',
                  borderColor:  'var(--color-dr-edge-2)',
                  color:        'var(--color-dr-text)',
                  fontFamily:   'var(--font-mono)',
                }}
              >
                {label} — {val.toFixed(1)}/10
                <Tooltip.Arrow
                  className="fill-[var(--color-dr-surface-2)]"
                  width={10}
                  height={5}
                />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        )
      })}

      {showLabels && !isMini && HEX_AXES.map(({ label, color }, i) => {
        const [x, y] = hexPoint(cx, cy, labelOffset, i)
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={7}
            fill={color}
            fontFamily="var(--font-mono)"
            letterSpacing="0.05em"
            style={{ textTransform: 'uppercase' }}
          >
            {label}
          </text>
        )
      })}
    </>
  )

  return (
    <Tooltip.Provider delayDuration={200} skipDelayDuration={0}>
      <svg
        width={size}
        height={size}
        viewBox={vb}
        className={className}
        style={{ overflow: 'visible' }}
        role="img"
        aria-label="Soft skill profile radar chart"
      >
        <g>{chart}</g>
      </svg>
    </Tooltip.Provider>
  )
}
