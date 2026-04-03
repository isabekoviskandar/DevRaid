'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { authStore } from '@/lib/auth-store'

const GENDER_OPTIONS = ['male', 'female', 'other'] as const

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

interface FieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  textarea?: boolean
  value: string
  error?: string
  onChange: (name: string, value: string) => void
}

function Field({ label, name, type = 'text', placeholder, textarea, value, error, onChange }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="dr-label" style={{ color: 'var(--color-dr-text-2)' }}>{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          required
          value={value}
          onChange={e => onChange(name, e.target.value)}
          placeholder={placeholder}
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={e  => (e.target.style.borderColor = 'rgba(91,135,255,0.4)')}
          onBlur={e   => (e.target.style.borderColor = error ? 'rgba(255,107,107,0.4)' : 'rgba(255,255,255,0.08)')}
        />
      ) : (
        <input
          type={type}
          required
          value={value}
          onChange={e => onChange(name, e.target.value)}
          placeholder={placeholder}
          style={{ ...inputStyle, borderColor: error ? 'rgba(255,107,107,0.4)' : undefined }}
          onFocus={e  => (e.target.style.borderColor = 'rgba(91,135,255,0.4)')}
          onBlur={e   => (e.target.style.borderColor = error ? 'rgba(255,107,107,0.4)' : 'rgba(255,255,255,0.08)')}
        />
      )}
      {error && (
        <p className="dr-label" style={{ color: '#FF6B6B', textTransform: 'none' }}>{error}</p>
      )}
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    bio: '', gender: 'male' as string,
  })
  const [errors, setErrors]   = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => { const n = { ...e }; delete n[field]; return n })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const res = await api.auth.register(form)

    if (res.error) {
      const fieldErrors: Record<string, string> = {}
      if (res.errors) {
        for (const [k, v] of Object.entries(res.errors)) {
          fieldErrors[k] = Array.isArray(v) ? v[0] : v
        }
      } else {
        fieldErrors._general = res.error
      }
      setErrors(fieldErrors)
      setLoading(false)
      return
    }

    if (!res.data) {
      setErrors({ _general: 'Unexpected response from server' })
      setLoading(false)
      return
    }

    authStore.set(res.data.token, res.data.user)
    router.push('/raids')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="dr-card relative z-10 w-full max-w-sm p-8 dr-enter">

        {/* Header */}
        <div className="text-center mb-7">
          <h1
            className="dr-title-fantasy text-3xl font-bold dr-text-gold mb-1"
            style={{ letterSpacing: '0.06em' }}
          >
            Join DevRaid
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-dr-text-2)' }}>
            Create your Hero account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Username"  name="username" placeholder="DISP4TCHER"             value={form.username} error={errors.username} onChange={set} />
          <Field label="Email"     name="email"    type="email" placeholder="you@example.com" value={form.email}    error={errors.email}    onChange={set} />
          <Field label="Password"  name="password" type="password" placeholder="8+ characters" value={form.password} error={errors.password} onChange={set} />
          <Field label="Bio"       name="bio"      placeholder="Short intro about yourself" textarea value={form.bio} error={errors.bio} onChange={set} />

          {/* Gender */}
          <div className="flex flex-col gap-1.5">
            <label className="dr-label" style={{ color: 'var(--color-dr-text-2)' }}>Gender</label>
            <div className="flex gap-2">
              {GENDER_OPTIONS.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set('gender', g)}
                  className="flex-1 py-2 rounded-[var(--radius-badge)] dr-label transition-all"
                  style={{
                    background:  form.gender === g ? 'rgba(91,135,255,0.12)' : 'rgba(8,11,19,0.8)',
                    border:      `1px solid ${form.gender === g ? 'rgba(91,135,255,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    color:       form.gender === g ? 'var(--color-dr-glow)' : 'var(--color-dr-text-2)',
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {errors._general && (
            <p
              className="text-xs px-3 py-2 rounded-[var(--radius-badge)]"
              style={{ color: '#FF6B6B', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)' }}
            >
              {errors._general}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="dr-btn-primary w-full justify-center mt-1"
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <hr className="dr-divider my-6" />

        <p className="text-center text-sm" style={{ color: 'var(--color-dr-text-2)' }}>
          Already a Hero?{' '}
          <Link href="/login" style={{ color: 'var(--color-dr-glow)', textDecoration: 'none' }}>
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  )
}
