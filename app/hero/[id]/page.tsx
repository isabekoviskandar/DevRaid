import { notFound } from 'next/navigation'
import Link from 'next/link'
import { resolveMockHeroProfile } from '@/lib/mock-data'
import { PublicHeroRadar } from '@/components/features/hero/public-hero-radar'
import { AvatarGlow } from '@/components/ui/avatar-glow'

export default async function PublicHeroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const hero = resolveMockHeroProfile(id)
  if (!hero) notFound()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link
        href="/raids"
        className="dr-label transition-colors mb-6 inline-block"
        style={{ color: 'var(--color-dr-muted)' }}
      >
        ← Raid Board
      </Link>

      <div
        className="dr-card p-6 mb-6 flex gap-6 items-start"
        style={{ borderColor: 'var(--color-dr-edge)' }}
      >
        <AvatarGlow
          src={hero.avatar_url}
          alt={hero.display_name}
          fallback={hero.display_name[0] ?? '?'}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <h1 className="dr-heading text-xl font-bold mb-1" style={{ color: 'var(--color-dr-text)' }}>
            {hero.display_name}
          </h1>
          <p className="text-sm mb-3" style={{ color: 'var(--color-dr-text-2)' }}>
            {hero.headline}
          </p>
          {hero.bio ? (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-dr-muted)' }}>
              {hero.bio}
            </p>
          ) : null}
        </div>
      </div>

      <div className="dr-card p-5 mb-4" style={{ borderColor: 'var(--color-dr-edge)' }}>
        <h2 className="dr-heading text-base mb-3" style={{ color: 'var(--color-dr-text)' }}>
          Hard skills
        </h2>
        {hero.hard_skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {hero.hard_skills.map(skill => (
              <span
                key={skill}
                className="dr-label px-2 py-0.5 rounded-[var(--radius-pill)]"
                style={{
                  color:      'var(--color-dr-glow)',
                  background: 'var(--color-dr-glow-dim)',
                  border:     '1px solid var(--color-dr-glow-mid)',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--color-dr-text-2)' }}>
            No skills listed.
          </p>
        )}
      </div>

      <div className="dr-card p-5 mb-4" style={{ borderColor: 'var(--color-dr-edge)' }}>
        <h2 className="dr-heading text-base mb-4" style={{ color: 'var(--color-dr-text)' }}>
          Soft skills
        </h2>
        {hero.soft_profile ? (
          <PublicHeroRadar profile={hero.soft_profile} />
        ) : (
          <p className="text-sm" style={{ color: 'var(--color-dr-text-2)' }}>
            Soft skills not shared
          </p>
        )}
      </div>
    </div>
  )
}
