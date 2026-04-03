'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { PendingRaidApplication } from '@/types'
import { RoleChip } from '@/components/ui/card'

export function CaptainApplicationsSection({
  applications: initial,
}: {
  applications: PendingRaidApplication[]
}) {
  const [rows, setRows] = useState(initial)

  if (rows.length === 0) {
    return null
  }

  return (
    <section className="mb-8" aria-labelledby="captain-apps-heading">
      <h2
        id="captain-apps-heading"
        className="dr-title-fantasy text-lg font-semibold mb-3"
        style={{ color: 'var(--color-dr-text)' }}
      >
        Applications
      </h2>
      <ul className="flex flex-col gap-3 list-none p-0 m-0">
        {rows.map(app => (
          <li
            key={app.id}
            className="dr-card flex flex-col sm:flex-row sm:items-center gap-4 p-4"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {app.hero.avatar_url ? (
                <img
                  src={app.hero.avatar_url}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-[var(--color-dr-edge)] shrink-0"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: 'var(--color-dr-surface-2)', color: 'var(--color-dr-glow)' }}
                >
                  {app.hero.display_name[0]?.toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/hero/${app.hero.id}`}
                    className="font-semibold text-[var(--color-dr-text)] hover:text-[var(--color-dr-glow)] transition-colors truncate"
                  >
                    {app.hero.display_name}
                  </Link>
                  <RoleChip role={app.role_name} />
                </div>
                {app.message ? (
                  <p className="text-sm mt-1 text-[var(--color-dr-text-2)] line-clamp-2">{app.message}</p>
                ) : null}
              </div>
            </div>
            <div className="flex gap-2 shrink-0 sm:ml-auto">
              <button
                type="button"
                onClick={() => {
                  // TODO: POST approve application
                  setRows(prev => prev.filter(r => r.id !== app.id))
                }}
                className="px-3 py-1.5 rounded-[var(--radius-badge)] text-xs font-semibold transition-colors"
                style={{
                  background: 'var(--color-dr-status-recruiting)',
                  color: '#fff',
                }}
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => {
                  // TODO: POST reject application
                  setRows(prev => prev.filter(r => r.id !== app.id))
                }}
                className="px-3 py-1.5 rounded-[var(--radius-badge)] text-xs font-semibold transition-colors"
                style={{
                  background: 'var(--color-dr-surface-2)',
                  border: '1px solid var(--color-dr-edge)',
                  color: 'var(--color-dr-text-2)',
                }}
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
