import { HeroProfile, SoftSkillHexagon } from '@/types'
import { Card, CardHeader, CardBody, CardFooter, StatusBadge, RoleChip } from '@/components/ui/card'
import { AvatarGlow } from '@/components/ui/avatar-glow'
import { HexRadar, AXIS_DISPLAY_NAMES } from '@/components/ui/hex-radar'
import { SkillBar } from '@/components/ui/skill-bar'

interface HeroCardProps {
  hero: HeroProfile
  onClick?: () => void
  matchScore?: number
}

const AVAILABILITY_STATUS: Record<HeroProfile['availability_status'], 'recruiting' | 'closed' | 'pending'> = {
  open:        'recruiting',
  busy:        'pending',
  unavailable: 'closed',
}

const SOFT_AXES = [
  'drive',
  'reliability',
  'communication',
  'tempo',
  'mastery',
  'adaptability',
] as const

function normalizedSoftValue(profile: SoftSkillHexagon, axis: (typeof SOFT_AXES)[number]): number {
  const direct = profile[axis]
  if (typeof direct === 'number') {
    return direct > 10 ? direct / 10 : direct
  }

  const legacyMap: Partial<Record<(typeof SOFT_AXES)[number], number | undefined>> = {
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

  const fallback = legacyMap[axis]
  if (typeof fallback === 'number') {
    return fallback > 10 ? fallback / 10 : fallback
  }

  return 0
}

function getTopSoftSkills(profile?: SoftSkillHexagon) {
  if (!profile) {
    return []
  }

  return SOFT_AXES
    .map((axis) => ({
      axis,
      label: AXIS_DISPLAY_NAMES[axis],
      value: Math.round(normalizedSoftValue(profile, axis) * 10),
    }))
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
}

export function HeroCard({ hero, onClick, matchScore }: HeroCardProps) {
  const status = AVAILABILITY_STATUS[hero.availability_status]
  const topSoftSkills = getTopSoftSkills(hero.soft_profile)

  return (
    <Card onClick={onClick} className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <AvatarGlow
            src={hero.avatar_url}
            alt={hero.display_name}
            fallback={hero.display_name[0] ?? '?'}
            size="md"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--color-dr-text)]">
              {hero.display_name}
            </p>
            <p className="text-xs text-[var(--color-dr-text-2)] truncate">{hero.headline}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={status} />
          {hero.soft_profile && (
            <HexRadar
              profile={hero.soft_profile}
              size={48}
              showLabels={false}
              variant="mini"
            />
          )}
        </div>
      </CardHeader>

      <CardBody>
        <div className="flex flex-wrap gap-1.5">
          {hero.hard_skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="dr-label px-2 py-0.5 rounded-[var(--radius-badge)]"
              style={{
                background: 'var(--color-dr-surface-2)',
                color: 'var(--color-dr-text-2)',
                border: '1px solid var(--color-dr-edge)',
              }}
            >
              {skill}
            </span>
          ))}
          {hero.hard_skills.length > 5 && (
            <span className="dr-label text-[var(--color-dr-muted)]">+{hero.hard_skills.length - 5}</span>
          )}
        </div>

        {topSoftSkills.length > 0 ? (
          <div className="mt-4 flex flex-col gap-3 border-t border-[color:var(--color-dr-edge)] pt-4">
            {topSoftSkills.map((skill, index) => (
              <SkillBar
                key={skill.axis}
                label={skill.label}
                value={skill.value}
                emphasis={index === 0 ? 'emerald' : 'gold'}
                size="sm"
              />
            ))}
          </div>
        ) : null}
      </CardBody>

      <CardFooter>
        <div className="flex flex-wrap gap-1">
          {hero.preferred_roles.slice(0, 2).map((role) => (
            <RoleChip key={role} role={role} />
          ))}
        </div>

        {matchScore !== undefined && (
          <div className="flex items-center gap-2">
            <span className="dr-label text-[var(--color-dr-text-2)]">fit</span>
            <span
              className="text-sm font-semibold"
              style={{
                color: matchScore >= 70 ? 'var(--color-dr-status-recruiting)' : 'var(--color-dr-gold)',
                fontFamily: 'var(--font-mono)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {matchScore}%
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
