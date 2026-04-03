import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MOCK_RAIDS, MOCK_CANDIDATES, pendingApplicationsForRaid } from '@/lib/mock-data'
import { StatusBadge, RoleChip } from '@/components/ui/card'
import { CaptainApplicationsSection } from '@/components/features/captain/captain-applications-section'
import { CaptainRollSection } from '@/components/features/captain/captain-roll-section'

export default async function CaptainDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const raid = MOCK_RAIDS.find(r => r.id === id)
  if (!raid) notFound()

  const openRoles = raid.roles.filter(r => r.slots_filled < r.slots_total)
  const raidRoleIds = new Set(raid.roles.map(r => r.id))
  const candidates = MOCK_CANDIDATES.filter(c => raidRoleIds.has(c.role.id))
  const applications = pendingApplicationsForRaid(raid.id)

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <Link
        href={`/raids/${raid.id}`}
        className="dr-label transition-colors mb-6 inline-block"
        style={{ color: 'var(--color-dr-muted)' }}
      >
        ← Back to Raid
      </Link>

      {/* ── Raid overview ──────────────────────────────────── */}
      <div className="dr-card p-5 mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1
            className="dr-title-fantasy text-xl font-bold"
            style={{ color: 'var(--color-dr-text)' }}
          >
            {raid.title}
          </h1>
          <StatusBadge status={raid.recruiting_status === 'open' ? 'recruiting' : 'closed'} />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="dr-label" style={{ color: 'var(--color-dr-muted)' }}>
            {raid.member_count} members
          </span>
          <span className="dr-label" style={{ color: 'var(--color-dr-edge)' }}>·</span>
          <div className="flex gap-1.5 flex-wrap">
            {openRoles.map(r => <RoleChip key={r.id} role={r.role_name} />)}
          </div>
          <Link
            href={`/raids/${raid.id}/board`}
            className="ml-auto dr-label px-2.5 py-1 rounded-[var(--radius-badge)] transition-colors"
            style={{
              background: 'var(--color-dr-surface-2)',
              border: '1px solid var(--color-dr-edge)',
              color: 'var(--color-dr-glow)',
            }}
          >
            Quest Board →
          </Link>
        </div>
      </div>

      {/* ── Stats row ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Members',    value: raid.member_count },
          { label: 'Open Roles', value: openRoles.length },
          { label: 'Candidates', value: candidates.length },
        ].map(stat => (
          <div key={stat.label} className="dr-card p-4 text-center">
            <p
              className="text-2xl font-bold mb-0.5"
              style={{ color: 'var(--color-dr-gold)', fontFamily: 'var(--font-mono)' }}
            >
              {stat.value}
            </p>
            <p className="dr-label" style={{ color: 'var(--color-dr-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <CaptainApplicationsSection applications={applications} />

      {/* ── Roll Hero ──────────────────────────────────────── */}
      <CaptainRollSection candidates={candidates} />
    </div>
  )
}
