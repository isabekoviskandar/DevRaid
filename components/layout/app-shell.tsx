'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { authStore } from '@/lib/auth-store'
import { api, type ApiUser } from '@/lib/api'

// ── Nav items with semantic colours ───────────────────────────
const NAV = [
  { href: '/raids',       label: 'Raid Board',  dot: 'var(--color-dr-glow)',  glyph: '⚔' },
  { href: '/hero/me',     label: 'My Profile',  dot: 'var(--color-dr-gold)',  glyph: '◈' },
  { href: '/captain/new', label: 'Create Raid', dot: 'var(--color-dr-status-recruiting)', glyph: '+' },
]

// ── Tiny hex logo mark ─────────────────────────────────────────
function HexMark() {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6
    return `${(10 + 9 * Math.cos(a)).toFixed(1)},${(10 + 9 * Math.sin(a)).toFixed(1)}`
  }).join(' ')
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hexGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="var(--color-dr-gold-bright)" />
          <stop offset="100%" stopColor="var(--color-dr-gold)" />
        </linearGradient>
      </defs>
      <polygon points={pts} fill="url(#hexGrad)" opacity="0.9" />
    </svg>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path    = usePathname()
  const router  = useRouter()
  const [user, setUser] = useState<ApiUser | null>(null)

  // Load auth state on mount (localStorage is client-only)
  useEffect(() => {
    const token = authStore.getToken()
    if (!token) { setUser(null); return }
    // Optimistic: show cached user immediately, then verify
    setUser(authStore.getUser())
    api.auth.getUser(token).then(res => {
      if (res.error) {
        authStore.clear()
        setUser(null)
      } else {
        setUser(res.data ?? null)
      }
    })
  }, [path]) // re-check on every navigation

  async function handleLogout() {
    const token = authStore.getToken()
    if (token) await api.auth.logout(token)
    authStore.clear()
    setUser(null)
    router.push('/login')
  }

  return (
    <div className="flex w-full">

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside
        className="w-[220px] shrink-0 flex flex-col sticky top-0 h-screen"
        style={{
          background: 'rgba(8, 11, 19, 0.82)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        }}
      >

        {/* Logo area */}
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-2.5 mb-1">
            <HexMark />
            <span
              className="dr-title-fantasy text-[1.05rem] font-bold dr-text-gold"
              style={{ letterSpacing: '0.06em' }}
            >
              DevRaid
            </span>
          </div>
          <p className="dr-label" style={{ color: 'var(--color-dr-muted)', paddingLeft: '28px' }}>
            IT Community UZ
          </p>
        </div>

        <hr className="dr-divider mx-4 mb-2" />

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5 px-2.5 py-2 flex-1">
          <p className="dr-label px-3 mb-2" style={{ color: 'var(--color-dr-muted)' }}>
            Navigate
          </p>

          {NAV.map(({ href, label, dot, glyph }) => {
            const active = path === href || (href !== '/' && path.startsWith(href + '/'))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-all duration-200',
                  active ? 'font-semibold' : 'hover:bg-white/[0.04]'
                )}
                style={{
                  color:      active ? 'var(--color-dr-text)' : 'var(--color-dr-text-2)',
                  background: active ? 'rgba(255,255,255,0.06)' : undefined,
                }}
              >
                {/* Active left accent bar */}
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full"
                    style={{ background: dot }}
                  />
                )}

                {/* Semantic colour dot */}
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: dot,
                    opacity: active ? 1 : 0.5,
                    boxShadow: active ? `0 0 6px ${dot}` : 'none',
                  }}
                />

                {label}
              </Link>
            )
          })}
        </nav>

        <hr className="dr-divider mx-4" />

        {/* User area */}
        <div className="px-3 py-4">
          {user ? (
            <div
              className="flex items-center gap-3 px-3 py-2.5 rounded-[10px]"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 uppercase"
                style={{
                  background: 'linear-gradient(135deg, rgba(91,135,255,0.3) 0%, rgba(91,135,255,0.1) 100%)',
                  color: 'var(--color-dr-glow)',
                  border: '1px solid rgba(91,135,255,0.35)',
                  boxShadow: '0 0 10px rgba(91,135,255,0.2)',
                }}
              >
                {user.username?.[0] ?? '?'}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate"
                  style={{ color: 'var(--color-dr-text)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.04em', fontWeight: 600 }}
                >
                  {user.username}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-dr-status-recruiting)', boxShadow: '0 0 5px var(--color-dr-status-recruiting)' }} />
                  <span className="dr-label" style={{ color: 'var(--color-dr-status-recruiting)' }}>online</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="shrink-0 dr-label px-1.5 py-1 rounded-[var(--radius-badge)] transition-colors"
                style={{ color: 'var(--color-dr-muted)', background: 'transparent', border: '1px solid transparent' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'transparent' }}
              >
                ↩
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login"    className="dr-btn-primary  w-full justify-center py-2 text-xs">Sign in</Link>
              <Link href="/register" className="dr-btn-secondary w-full justify-center py-2 text-xs">Register</Link>
            </div>
          )}
        </div>

      </aside>

      {/* ── Main content ──────────────────────────────────────── */}
      <main className="flex-1 min-w-0 min-h-screen">
        {children}
      </main>

    </div>
  )
}
