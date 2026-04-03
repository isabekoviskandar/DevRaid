import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MOCK_RAIDS } from '@/lib/mock-data'
import { StatusBadge, RoleChip } from '@/components/ui/card'
import { ApplyModal } from '@/components/features/raids/apply-modal'

const STAGE_LABELS: Record<string, string> = {
  idea: 'Idea', planning: 'Planning', development: 'Development',
  testing: 'Testing', launched: 'Launched',
}

export default async function RaidDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const raid = MOCK_RAIDS.find(r => r.id === id)
  if (!raid) notFound()

  const openRoles = raid.roles.filter(r => r.slots_filled < r.slots_total)

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <Link
        href="/raids"
        className="dr-label transition-colors mb-6 inline-block"
        style={{ color: 'var(--color-dr-muted)' }}
      >
        ← Back to Raid Board
      </Link>

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="dr-card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1
              className="dr-title-fantasy text-2xl font-bold mb-1"
              style={{ color: 'var(--color-dr-text)' }}
            >
              {raid.title}
            </h1>
            <span className="dr-label" style={{ color: 'var(--color-dr-muted)' }}>
              {STAGE_LABELS[raid.stage]} · {raid.member_count} members · {raid.created_at}
            </span>
          </div>
          <StatusBadge status={raid.recruiting_status === 'open' ? 'recruiting' : 'closed'} />
        </div>

        {/* Mission */}
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-dr-text-2)' }}>
          {raid.mission}
        </p>

        {/* Captain row */}
        {raid.captain && (
          <div
            className="flex items-center gap-3 pt-4 border-t"
            style={{ borderColor: 'var(--color-dr-edge)' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: 'var(--color-dr-surface-2)', color: 'var(--color-dr-glow)' }}
            >
              {raid.captain.display_name[0]}
            </div>
            <span className="dr-label" style={{ color: 'var(--color-dr-muted)' }}>Captain</span>
            <span className="text-sm" style={{ color: 'var(--color-dr-text-2)' }}>
              {raid.captain.display_name}
            </span>
            <Link
              href={`/captain/${raid.id}`}
              className="ml-auto dr-label px-2.5 py-1 rounded-[var(--radius-badge)] transition-colors"
              style={{
                background: 'var(--color-dr-surface-2)',
                border: '1px solid var(--color-dr-edge)',
                color: 'var(--color-dr-text-2)',
              }}
            >
              Captain View →
            </Link>
          </div>
        )}
      </div>

      {/* ── Open Roles ─────────────────────────────────────── */}
      <h2 className="dr-label mb-3" style={{ color: 'var(--color-dr-text-2)' }}>
        Open Roles ({openRoles.length})
      </h2>
      <div className="flex flex-col gap-3 mb-6">
        {openRoles.map(role => (
          <div key={role.id} className="dr-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2 min-w-0">
                <RoleChip role={role.role_name} />
                <div className="flex flex-wrap gap-1.5">
                  {role.required_hard_skills.map(skill => (
                    <span
                      key={skill}
                      className="dr-label px-2 py-0.5 rounded-[var(--radius-badge)]"
                      style={{
                        background: 'var(--color-dr-surface-2)',
                        color: 'var(--color-dr-text)',
                        border: '1px solid var(--color-dr-edge)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <span className="dr-label" style={{ color: 'var(--color-dr-muted)' }}>
                  {role.slots_total - role.slots_filled} slot{role.slots_total - role.slots_filled !== 1 ? 's' : ''} open
                </span>
              </div>

              <ApplyModal openRoles={openRoles} />
            </div>
          </div>
        ))}

        {openRoles.length === 0 && (
          <div className="dr-card p-4 text-center">
            <p className="text-sm" style={{ color: 'var(--color-dr-muted)' }}>No open roles right now</p>
          </div>
        )}
      </div>

      {/* ── Quest Board CTA ─────────────────────────────────── */}
      <Link
        href={`/raids/${raid.id}/board`}
        className="dr-card p-4 flex items-center justify-between group transition-colors block"
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-dr-text)' }}>
            Quest Board
          </p>
          <p className="dr-label" style={{ color: 'var(--color-dr-muted)' }}>
            Track progress · Manage tasks
          </p>
        </div>
        <span style={{ color: 'var(--color-dr-glow)' }}>→</span>
      </Link>
    </div>
  )
}
