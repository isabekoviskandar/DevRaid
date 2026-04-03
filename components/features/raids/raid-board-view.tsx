'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { Raid } from '@/types'
import { RaidCard } from '@/components/features/raids/raid-card'
import { EmptyState, RaidsEmptySvg } from '@/components/ui/empty-state'

const FILTERS = ['All', 'Frontend', 'Backend', 'Design', 'Mobile'] as const
type FilterChip = (typeof FILTERS)[number]

function roleMatchesChip(roleName: string, chip: Exclude<FilterChip, 'All'>): boolean {
  const r = roleName.toLowerCase()
  switch (chip) {
    case 'Frontend':
      return r === 'frontend'
    case 'Backend':
      return r === 'backend' || r === 'data' || r === 'devops'
    case 'Design':
      return r === 'design'
    case 'Mobile':
      return r === 'mobile'
    default:
      return false
  }
}

function raidMatchesFilter(raid: Raid, chip: FilterChip): boolean {
  if (chip === 'All') return true
  return raid.roles.some(role => roleMatchesChip(role.role_name, chip))
}

function raidMatchesSearch(raid: Raid, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const hay = [
    raid.title,
    raid.mission,
    raid.captain?.display_name ?? '',
    ...raid.roles.map(r => r.role_name),
  ]
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}

export function RaidBoardView({ raids }: { raids: Raid[] }) {
  const [filter, setFilter] = useState<FilterChip>('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return raids.filter(r => raidMatchesFilter(r, filter) && raidMatchesSearch(r, search))
  }, [raids, filter, search])

  const openCount = raids.filter(r => r.recruiting_status === 'open').length

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="dr-heading text-xl" style={{ color: 'var(--color-dr-text)' }}>
            Raid Board
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-dr-text-2)' }}>
            {openCount} raids recruiting · find your role
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end w-full sm:w-auto sm:min-w-[280px]">
          <label className="w-full">
            <span className="sr-only">Search raids</span>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search title, mission, captain…"
              className="w-full dr-label px-3 py-2 rounded-[var(--radius-badge)] outline-none transition-[box-shadow] focus:ring-2 focus:ring-[var(--color-dr-glow)]"
              style={{
                background: 'var(--color-dr-surface-2)',
                border: '1px solid var(--color-dr-edge)',
                color: 'var(--color-dr-text)',
              }}
            />
          </label>
          <div className="flex flex-wrap gap-2 justify-end">
            {FILTERS.map(f => {
              const active = filter === f
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className="dr-label px-3 py-1.5 rounded-[var(--radius-pill)] transition-colors"
                  style={{
                    background: active ? 'var(--color-dr-glow-dim)' : 'var(--color-dr-surface-2)',
                    color: active ? 'var(--color-dr-glow)' : 'var(--color-dr-text-2)',
                    border: `1px solid ${active ? 'var(--color-dr-glow)' : 'var(--color-dr-edge)'}`,
                  }}
                >
                  {f}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          svg={<RaidsEmptySvg />}
          heading="No Raids Found"
          body="No active raids match your filters. Try another chip or clear search."
          cta={{ label: 'Create a Raid', href: '/captain/new' }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(raid => (
            <Link key={raid.id} href={`/raids/${raid.id}`} className="block">
              <RaidCard
                raid={raid}
                fitScore={raid.id === '1' ? 91 : raid.id === '4' ? 78 : undefined}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
