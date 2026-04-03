import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MOCK_RAIDS, MOCK_QUESTS } from '@/lib/mock-data'
import { QuestCard } from '@/components/features/quests/quest-card'
import type { QuestStatus } from '@/types'

const COLUMNS: { status: QuestStatus; label: string }[] = [
  { status: 'backlog',     label: 'Backlog' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'review',      label: 'Review' },
  { status: 'done',        label: 'Done' },
]

const COLUMN_ACCENT: Record<QuestStatus, string> = {
  backlog:     'var(--color-dr-muted)',
  in_progress: 'var(--color-dr-glow)',
  review:      'var(--color-dr-gold)',
  done:        'var(--color-dr-status-recruiting)',
}

export default async function QuestBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const raid = MOCK_RAIDS.find(r => r.id === id)
  if (!raid) notFound()

  const quests = MOCK_QUESTS.filter(q => q.raid_id === id)

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <Link
            href={`/raids/${id}`}
            className="dr-label transition-colors"
            style={{ color: 'var(--color-dr-muted)' }}
          >
            ← {raid.title}
          </Link>
          <h1
            className="dr-title-fantasy text-2xl font-bold mt-1"
            style={{ color: 'var(--color-dr-text)' }}
          >
            Quest Board
          </h1>
        </div>

        <button
          className="dr-label px-3 py-1.5 rounded-[var(--radius-badge)] transition-colors"
          style={{
            background: 'var(--color-dr-glow-dim)',
            border: '1px solid var(--color-dr-glow)',
            color: 'var(--color-dr-glow)',
          }}
        >
          + Add Quest
        </button>
      </div>

      {/* ── Kanban columns ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map(({ status, label }) => {
          const cards = quests.filter(q => q.status === status)
          return (
            <div key={status} className="flex flex-col gap-3">

              {/* Column header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: COLUMN_ACCENT[status] }}
                  />
                  <span className="dr-label" style={{ color: 'var(--color-dr-text-2)' }}>
                    {label}
                  </span>
                </div>
                <span
                  className="dr-label w-5 h-5 flex items-center justify-center rounded-full"
                  style={{ background: 'var(--color-dr-surface-2)', color: 'var(--color-dr-muted)' }}
                >
                  {cards.length}
                </span>
              </div>

              {/* Quest cards */}
              <div className="flex flex-col gap-2">
                {cards.map(q => <QuestCard key={q.id} quest={q} />)}

                {cards.length === 0 && (
                  <div
                    className="dr-card p-4 text-center dr-label"
                    style={{ color: 'var(--color-dr-muted)', borderStyle: 'dashed' }}
                  >
                    Empty
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
