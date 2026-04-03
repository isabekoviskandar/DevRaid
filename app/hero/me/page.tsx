'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { authStore } from '@/lib/auth-store'
import { api, type ApiUser } from '@/lib/api'
import { StatusBadge } from '@/components/ui/card'
import { Github, Linkedin, Pencil, X } from 'lucide-react'
import { AvatarGlow } from '@/components/ui/avatar-glow'
import { HexRadar } from '@/components/ui/hex-radar'
import { SkillBar } from '@/components/ui/skill-bar'
import { MOCK_REVIEWS, MOCK_SKILL_LEVELS } from '@/lib/mock-data'

const inputStyle = {
  background:   'rgba(8, 11, 19, 0.8)',
  border:       '1px solid rgba(255,255,255,0.08)',
  borderRadius: 'var(--radius-badge)',
  color:        'var(--color-dr-text)',
  fontFamily:   'var(--font-sans)',
  fontSize:     '0.875rem',
  padding:      '0.6rem 0.875rem',
  outline:      'none',
  transition:   'border-color 0.2s',
  width:        '100%',
} as const

const labelStyle = {
  display:      'block',
  color:        'var(--color-dr-muted)',
  fontSize:     '0.75rem',
  marginBottom: '0.375rem',
  fontFamily:   'var(--font-sans)',
} as const

export default function MyHeroProfilePage() {
  const [user, setUser]       = useState<ApiUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saveState, setSaveState]   = useState<'idle' | 'saving' | 'saved'>('idle')
  const [skillInput, setSkillInput] = useState('')
  const [draft, setDraft] = useState(() => {
    // authStore.getUser() is safe here — synchronous localStorage read,
    // does NOT access the `user` React state which is null on first render
    const cached = authStore.getUser()
    return {
      bio:          cached?.bio          ?? '',
      github_url:   cached?.github_url   ?? '',
      linkedin_url: cached?.linkedin_url ?? '',
      hard_skills:  cached?.hard_skills  ?? [] as string[],
    }
  })
  const prefersReducedMotion = useReducedMotion()
  const softProfile = user?.soft_skills ?? user?.soft_profile
  const avatarUrl =
    user && 'avatar_url' in user && typeof user.avatar_url === 'string'
      ? user.avatar_url
      : undefined

  const panelMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: 'auto', transition: { duration: 0.25 } },
        exit:    { opacity: 0, height: 0,      transition: { duration: 0.18 } },
      }

  useEffect(() => {
    const token = authStore.getToken()

    if (!token) {
      setLoading(false)
      return
    }

    // Optimistic: show cached user immediately while re-validating
    setUser(authStore.getUser())

    api.auth.getUser(token).then((res) => {
      if (res.error) {
        authStore.clear()
        setUser(null)
      } else {
        setUser(res.data ?? null)
      }
      setLoading(false)
    })
  }, [])

  function handleSkillKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const trimmed = skillInput.trim().replace(/,$/, '')
      if (trimmed && !draft.hard_skills.includes(trimmed)) {
        setDraft(d => ({ ...d, hard_skills: [...d.hard_skills, trimmed] }))
      }
      setSkillInput('')
    }
  }

  async function handleSave() {
    setSaveState('saving')
    const token = authStore.getToken()
    if (token !== null) {
      await api.auth.patchUser(token, draft)
    }
    authStore.updateUser(draft)
    const updated = authStore.getUser()
    if (updated !== null) {
      setUser(updated)
    }
    setSaveState('saved')
    setTimeout(() => {
      setSaveState('idle')
      setIsEditing(false)
    }, 1500)
  }

  if (loading) {
    return (
      <div className="p-6" style={{ color: 'var(--color-dr-muted)' }}>
        Loading profile…
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6" style={{ color: 'var(--color-dr-muted)' }}>
        Sign in to view your profile.
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-6">

      {/* ── Hero Profile Header — Center + Right panel ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">

        {/* Center: Avatar + tagline + Radar */}
        <div className="dr-card p-6 flex flex-col items-center text-center gap-4">
          <p className="dr-label" style={{ color: 'var(--color-dr-glow)', fontSize: '0.62rem', letterSpacing: '0.12em' }}>
            YOUR LEGEND AWAITS. MASTER YOUR CRAFT.
          </p>

          <AvatarGlow
            src={avatarUrl}
            alt={user.username}
            fallback={user.username[0] ?? '?'}
            size={104}
          />

          <div>
            <h1 className="dr-title-fantasy text-2xl font-bold" style={{ color: 'var(--color-dr-text)' }}>
              {user.username}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-dr-status-active)', boxShadow: '0 0 6px var(--color-dr-status-active)' }} />
              <span className="dr-label" style={{ color: 'var(--color-dr-status-active)', fontSize: '0.62rem' }}>ONLINE</span>
              <span className="dr-label" style={{ color: 'var(--color-dr-muted)' }}>·</span>
              <StatusBadge status={user.status} />
            </div>
          </div>

          {softProfile ? (
            <div className="flex justify-center py-2">
              <HexRadar profile={softProfile} size={200} showLabels />
            </div>
          ) : (
            <div className="py-4 max-w-xs">
              <p className="text-sm mb-3" style={{ color: 'var(--color-dr-text-2)' }}>
                Complete your soft skill assessment to get a 6-axis profile and stand out to captains.
              </p>
              <Link href="/onboarding" className="dr-btn-primary inline-flex justify-center text-sm">
                Complete assessment →
              </Link>
            </div>
          )}

          <div className="flex gap-2 w-full justify-center flex-wrap">
            <button
              onClick={() => setIsEditing(e => !e)}
              className="flex items-center gap-1.5 dr-label px-3 py-1.5 rounded-[var(--radius-badge)] transition-all"
              style={{
                color:      isEditing ? 'var(--color-dr-text)' : 'var(--color-dr-glow)',
                background: isEditing ? 'rgba(255,255,255,0.05)' : 'var(--color-dr-glow-dim)',
                border:     `1px solid ${isEditing ? 'rgba(255,255,255,0.1)' : 'var(--color-dr-glow-mid)'}`,
              }}
            >
              {isEditing ? <X size={12} /> : <Pencil size={12} />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="dr-card p-5 flex flex-col gap-4">
          <h3 className="dr-label" style={{ color: 'var(--color-dr-muted)', fontSize: '0.62rem', letterSpacing: '0.1em' }}>
            HARD SKILLS
          </h3>
          <div className="flex items-center justify-between">
            <span className="dr-label" style={{ color: 'var(--color-dr-muted)', fontSize: '0.58rem' }}>SKILL</span>
            <span className="dr-label" style={{ color: 'var(--color-dr-muted)', fontSize: '0.58rem' }}>LEVEL</span>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_SKILL_LEVELS.map(({ label, level }) => (
              <SkillBar
                key={label}
                label={label}
                value={level}
                size="sm"
                className="gap-1"
              />
            ))}
          </div>
          {(user.hard_skills ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {(user.hard_skills ?? []).map(skill => (
                <span
                  key={skill}
                  className="dr-label px-2 py-0.5 rounded-[var(--radius-pill)]"
                  style={{
                    color: 'var(--color-dr-glow)', background: 'var(--color-dr-glow-dim)',
                    border: '1px solid var(--color-dr-glow-mid)', fontSize: '0.62rem',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Social links ─────────────────────────────────── */}
      {(user.github_url || user.linkedin_url) && (
        <div className="dr-card p-4 flex gap-4 flex-wrap">
          {user.github_url && (
            <a href={user.github_url.startsWith('http') ? user.github_url : `https://${user.github_url}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-80"
              style={{ color: 'var(--color-dr-text-2)' }}>
              <Github size={14} /> {user.github_url}
            </a>
          )}
          {user.linkedin_url && (
            <a href={user.linkedin_url.startsWith('http') ? user.linkedin_url : `https://${user.linkedin_url}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-80"
              style={{ color: 'var(--color-dr-text-2)' }}>
              <Linkedin size={14} /> {user.linkedin_url}
            </a>
          )}
        </div>
      )}

      {/* ── Hero Reviews ─────────────────────────────────── */}
      <div>
        <p className="dr-label mb-3" style={{ color: 'var(--color-dr-muted)', fontSize: '0.62rem', letterSpacing: '0.1em' }}>
          HERO REVIEWS
        </p>
        <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
          {MOCK_REVIEWS.map(rev => (
            <div
              key={rev.id}
              className="dr-card p-4 flex flex-col gap-3 shrink-0"
              style={{ minWidth: 220, maxWidth: 260 }}
            >
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--color-dr-text-2)' }}>
                &ldquo;{rev.text}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <span key={i} style={{ color: 'var(--color-dr-gold)', fontSize: 11 }}>★</span>
                  ))}
                </div>
                <span className="dr-label" style={{ color: 'var(--color-dr-muted)', fontSize: '0.62rem' }}>
                  {rev.reviewer}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Inline edit panel ─────────────────────────────── */}
      <AnimatePresence>
        {isEditing && (
          <motion.div style={{ overflow: 'hidden' }} {...panelMotion}>
            <div className="dr-card p-5" style={{ borderColor: 'var(--color-dr-edge)' }}>
              <h3 className="dr-heading text-base mb-4" style={{ color: 'var(--color-dr-text)' }}>
                Edit Profile
              </h3>

              {/* Bio */}
              <div className="mb-4">
                <label style={labelStyle}>Bio</label>
                <textarea
                  value={draft.bio}
                  onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="A short description of yourself…"
                />
              </div>

              {/* GitHub */}
              <div className="mb-4">
                <label style={labelStyle}>GitHub URL</label>
                <input
                  type="url"
                  value={draft.github_url}
                  onChange={e => setDraft(d => ({ ...d, github_url: e.target.value }))}
                  style={inputStyle}
                  placeholder="https://github.com/username"
                />
              </div>

              {/* LinkedIn */}
              <div className="mb-4">
                <label style={labelStyle}>LinkedIn URL</label>
                <input
                  type="url"
                  value={draft.linkedin_url}
                  onChange={e => setDraft(d => ({ ...d, linkedin_url: e.target.value }))}
                  style={inputStyle}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              {/* Hard skills tag input */}
              <div className="mb-5">
                <label style={labelStyle}>Hard Skills (Enter or comma to add)</label>
                {/* Current tags */}
                {draft.hard_skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {draft.hard_skills.map(skill => (
                      <span
                        key={skill}
                        className="dr-label px-2 py-0.5 rounded-[var(--radius-pill)] flex items-center gap-1"
                        style={{
                          color:      'var(--color-dr-glow)',
                          background: 'var(--color-dr-glow-dim)',
                          border:     '1px solid var(--color-dr-glow-mid)',
                        }}
                      >
                        {skill}
                        <button
                          onClick={() =>
                            setDraft(d => ({ ...d, hard_skills: d.hard_skills.filter(s => s !== skill) }))
                          }
                          className="ml-0.5 opacity-60 hover:opacity-100"
                          aria-label={`Remove ${skill}`}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  style={inputStyle}
                  placeholder="e.g. React, TypeScript…"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsEditing(false)}
                  className="dr-btn-secondary"
                  disabled={saveState === 'saving'}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="dr-btn-primary"
                  disabled={saveState !== 'idle'}
                >
                  {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? '✓ Saved' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
