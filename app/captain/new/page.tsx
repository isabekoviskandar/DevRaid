'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authStore } from '@/lib/auth-store'
import type { RaidStage } from '@/types'

// ── Form types ─────────────────────────────────────────────
interface RoleEntry {
  id: string          // local stable key — crypto.randomUUID()
  role_name: string   // free text, e.g. 'frontend', 'backend'
  slots_total: number // >= 1
}

interface RaidFormData {
  title:   string
  mission: string
  stage:   RaidStage
}

const STAGE_OPTIONS: { value: RaidStage; label: string }[] = [
  { value: 'idea',        label: 'Idea'        },
  { value: 'planning',    label: 'Planning'    },
  { value: 'development', label: 'Development' },
  { value: 'testing',     label: 'Testing'     },
  { value: 'launched',    label: 'Launched'    },
]

export default function CaptainNewPage(): React.ReactElement | null {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  const [formState, setFormState]   = useState<'form' | 'success'>('form')
  const [form, setForm]             = useState<RaidFormData>({
    title:   '',
    mission: '',
    stage:   'idea',
  })
  const [roles, setRoles]           = useState<RoleEntry[]>([
    { id: crypto.randomUUID(), role_name: 'frontend', slots_total: 1 },
  ])

  useEffect(() => {
    if (!authStore.isAuthenticated()) {
      router.replace('/login')
    } else {
      setChecked(true)
    }
  }, [router])

  if (!checked) return null

  function handleFormChange(field: keyof RaidFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function addRole() {
    setRoles(prev => [
      ...prev,
      { id: crypto.randomUUID(), role_name: '', slots_total: 1 },
    ])
  }

  function removeRole(id: string) {
    setRoles(prev => prev.filter(r => r.id !== id))
  }

  function updateRole(id: string, field: keyof Omit<RoleEntry, 'id'>, value: string | number) {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // CAPTAIN-04: mock submit — no API call yet
    setFormState('success')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">

      {formState === 'success' ? (

        /* ── SUCCESS STATE (CAPTAIN-04) ──────────────────── */
        <div className="dr-card p-10 text-center dr-enter" style={{ marginTop: '4rem' }}>
          <div
            className="text-4xl mb-4"
            style={{ fontFamily: 'var(--font-fantasy)', color: 'var(--color-dr-glow)' }}
          >
            ⚔
          </div>
          <h2
            className="dr-title-fantasy text-2xl font-bold mb-3"
            style={{ color: 'var(--color-dr-text)' }}
          >
            Raid Created
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--color-dr-text-2)' }}>
            Your raid <span style={{ color: 'var(--color-dr-glow)' }}>&ldquo;{form.title}&rdquo;</span> has been forged.
            Heroes will soon answer your call.
          </p>
          <a href="/raids" className="dr-btn-primary">
            View Raid Board
          </a>
        </div>

      ) : (

        /* ── CREATION FORM ───────────────────────────────── */
        <>
          {/* Header */}
          <div className="mb-8 dr-enter">
            <p className="dr-label mb-1" style={{ color: 'var(--color-dr-muted)' }}>
              Captain Panel
            </p>
            <h1
              className="dr-title-fantasy text-3xl font-bold"
              style={{ color: 'var(--color-dr-text)' }}
            >
              Forge a New Raid
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--color-dr-text-2)' }}>
              Define your mission. Recruit your crew.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ── Card: Basic Info ──────────────────────── */}
            <div className="dr-card p-6 space-y-5 dr-enter">
              <p className="dr-label" style={{ color: 'var(--color-dr-muted)' }}>Mission Brief</p>
              <hr className="dr-divider" />

              {/* Title — CAPTAIN-02 */}
              <div className="space-y-1.5">
                <label
                  htmlFor="raid-title"
                  className="dr-label"
                  style={{ color: 'var(--color-dr-text-2)' }}
                >
                  Raid Title
                </label>
                <input
                  id="raid-title"
                  type="text"
                  required
                  maxLength={80}
                  placeholder="e.g. Aether Analytics"
                  value={form.title}
                  onChange={e => handleFormChange('title', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-[var(--radius-badge)] outline-none transition-colors focus:border-[var(--color-dr-glow)]"
                  style={{
                    background: 'var(--color-dr-surface-2)',
                    border:     '1px solid var(--color-dr-edge)',
                    color:      'var(--color-dr-text)',
                  }}
                />
              </div>

              {/* Mission — CAPTAIN-02 */}
              <div className="space-y-1.5">
                <label
                  htmlFor="raid-mission"
                  className="dr-label"
                  style={{ color: 'var(--color-dr-text-2)' }}
                >
                  Mission
                </label>
                <textarea
                  id="raid-mission"
                  required
                  rows={4}
                  maxLength={500}
                  placeholder="What are you building and why does it matter?"
                  value={form.mission}
                  onChange={e => handleFormChange('mission', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-[var(--radius-badge)] outline-none transition-colors resize-none focus:border-[var(--color-dr-glow)]"
                  style={{
                    background: 'var(--color-dr-surface-2)',
                    border:     '1px solid var(--color-dr-edge)',
                    color:      'var(--color-dr-text)',
                  }}
                />
              </div>

              {/* Stage — CAPTAIN-02 */}
              <div className="space-y-1.5">
                <label
                  htmlFor="raid-stage"
                  className="dr-label"
                  style={{ color: 'var(--color-dr-text-2)' }}
                >
                  Stage
                </label>
                <select
                  id="raid-stage"
                  value={form.stage}
                  onChange={e => handleFormChange('stage', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-[var(--radius-badge)] outline-none transition-colors cursor-pointer"
                  style={{
                    background:    'var(--color-dr-surface-2)',
                    border:        '1px solid var(--color-dr-edge)',
                    color:         'var(--color-dr-text)',
                    appearance:    'none',
                    WebkitAppearance: 'none',
                  }}
                >
                  {STAGE_OPTIONS.map(opt => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      style={{ background: 'var(--color-dr-surface-2)' }}
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── Card: Roles ───────────────────────────── */}
            <div className="dr-card p-6 space-y-4 dr-enter-2">
              <div className="flex items-center justify-between">
                <p className="dr-label" style={{ color: 'var(--color-dr-muted)' }}>
                  Roles Needed
                </p>
                {/* Add Role — CAPTAIN-03 */}
                <button
                  type="button"
                  onClick={addRole}
                  className="dr-btn-secondary"
                  style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
                >
                  + Add Role
                </button>
              </div>
              <hr className="dr-divider" />

              {/* Role rows — CAPTAIN-03 */}
              <div className="space-y-3">
                {roles.map(role => (
                  <div
                    key={role.id}
                    className="flex items-center gap-3"
                  >
                    {/* Role name input */}
                    <input
                      type="text"
                      required
                      placeholder="Role (e.g. frontend)"
                      value={role.role_name}
                      onChange={e => updateRole(role.id, 'role_name', e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2 text-sm rounded-[var(--radius-badge)] outline-none transition-colors focus:border-[var(--color-dr-glow)]"
                      style={{
                        background: 'var(--color-dr-surface-2)',
                        border:     '1px solid var(--color-dr-edge)',
                        color:      'var(--color-dr-text)',
                      }}
                    />

                    {/* Slots input */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="dr-label text-[10px]" style={{ color: 'var(--color-dr-muted)' }}>
                        slots
                      </span>
                      <input
                        type="number"
                        required
                        min={1}
                        max={20}
                        value={role.slots_total}
                        onChange={e => updateRole(role.id, 'slots_total', Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-14 px-2 py-2 text-sm text-center rounded-[var(--radius-badge)] outline-none transition-colors focus:border-[var(--color-dr-glow)]"
                        style={{
                          background: 'var(--color-dr-surface-2)',
                          border:     '1px solid var(--color-dr-edge)',
                          color:      'var(--color-dr-text)',
                        }}
                      />
                    </div>

                    {/* Remove button — disabled when only 1 role remains (CAPTAIN-03 min 1 role) */}
                    <button
                      type="button"
                      onClick={() => removeRole(role.id)}
                      disabled={roles.length <= 1}
                      className="shrink-0 w-8 h-8 flex items-center justify-center rounded-[var(--radius-badge)] transition-colors"
                      style={{
                        background: roles.length <= 1 ? 'transparent' : 'rgba(255,255,255,0.04)',
                        border:     '1px solid var(--color-dr-edge)',
                        color:      roles.length <= 1 ? 'var(--color-dr-muted)' : 'var(--color-dr-text-2)',
                        cursor:     roles.length <= 1 ? 'not-allowed' : 'pointer',
                      }}
                      aria-label="Remove role"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Submit ────────────────────────────────── */}
            <div className="flex justify-end pt-2 dr-enter-3">
              <button type="submit" className="dr-btn-primary">
                Forge Raid →
              </button>
            </div>

          </form>
        </>
      )}
    </div>
  )
}
