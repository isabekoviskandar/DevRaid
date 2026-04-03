'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { authStore } from '@/lib/auth-store'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await api.auth.login(form)

    if (res.error) {
      setError(res.error)
      setLoading(false)
      return
    }

    if (!res.data) {
      setError('Unexpected response from server')
      setLoading(false)
      return
    }

    authStore.set(res.data.token, res.data.user)
    router.push('/raids')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      {/* Decorative hex bg */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 900 700" preserveAspectRatio="xMidYMid slice" fill="none">
          <polygon
            points="820,-60 1060,70 1060,330 820,460 580,330 580,70"
            stroke="rgba(200,148,58,0.05)" strokeWidth="1.5"
          />
          <polygon
            points="820,-60 1020,55 1020,285 820,400 620,285 620,55"
            stroke="rgba(200,148,58,0.03)" strokeWidth="1"
          />
        </svg>
      </div>

      <div className="dr-card relative z-10 w-full max-w-sm p-8 dr-enter">

        {/* Header */}
        <div className="text-center mb-7">
          <h1
            className="dr-title-fantasy text-3xl font-bold dr-text-gold mb-1"
            style={{ letterSpacing: '0.06em' }}
          >
            DevRaid
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-dr-text-2)' }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="dr-label" style={{ color: 'var(--color-dr-text-2)' }}>
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              required
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="DISP4TCHER"
              style={{
                background:  'rgba(8, 11, 19, 0.8)',
                border:      '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-badge)',
                color:       'var(--color-dr-text)',
                fontFamily:  'var(--font-mono)',
                fontSize:    '0.875rem',
                padding:     '0.6rem 0.875rem',
                outline:     'none',
                transition:  'border-color 0.2s',
                width:       '100%',
              }}
              onFocus={e  => (e.target.style.borderColor = 'rgba(91,135,255,0.4)')}
              onBlur={e   => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="dr-label" style={{ color: 'var(--color-dr-text-2)' }}>
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              style={{
                background:  'rgba(8, 11, 19, 0.8)',
                border:      '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-badge)',
                color:       'var(--color-dr-text)',
                fontFamily:  'var(--font-mono)',
                fontSize:    '0.875rem',
                padding:     '0.6rem 0.875rem',
                outline:     'none',
                transition:  'border-color 0.2s',
                width:       '100%',
              }}
              onFocus={e  => (e.target.style.borderColor = 'rgba(91,135,255,0.4)')}
              onBlur={e   => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          {/* Error */}
          {error && (
            <p
              className="text-xs px-3 py-2 rounded-[var(--radius-badge)]"
              style={{
                color:      '#FF6B6B',
                background: 'rgba(255,107,107,0.08)',
                border:     '1px solid rgba(255,107,107,0.2)',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="dr-btn-primary w-full justify-center mt-1"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        <hr className="dr-divider my-6" />

        <p className="text-center text-sm" style={{ color: 'var(--color-dr-text-2)' }}>
          No account?{' '}
          <Link
            href="/register"
            style={{ color: 'var(--color-dr-glow)', textDecoration: 'none' }}
          >
            Register →
          </Link>
        </p>
      </div>
    </div>
  )
}
