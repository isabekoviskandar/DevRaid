import Link from 'next/link'

// ── Hex wireframe helper ───────────────────────────────────────
function hex(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')
}

const STATS = [
  { value: '48',  label: 'Active Raids' },
  { value: '230', label: 'Heroes Online' },
  { value: '12',  label: 'Shipped · Last Month' },
]

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden px-8">

      {/* ── Decorative hex wireframes ────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <svg
          width="100%" height="100%"
          viewBox="0 0 1100 780"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {/* Top-right large hex */}
          <polygon
            points={hex(960, -40, 360)}
            stroke="rgba(200,148,58,0.07)"
            strokeWidth="1.5"
          />
          {/* Top-right inner hex */}
          <polygon
            points={hex(960, -40, 240)}
            stroke="rgba(200,148,58,0.04)"
            strokeWidth="1"
          />
          {/* Top-right innermost */}
          <polygon
            points={hex(960, -40, 140)}
            stroke="rgba(200,148,58,0.025)"
            strokeWidth="0.8"
          />
          {/* Bottom-left hex */}
          <polygon
            points={hex(70, 800, 280)}
            stroke="rgba(0,217,126,0.06)"
            strokeWidth="1"
          />
          {/* Bottom-left inner */}
          <polygon
            points={hex(70, 800, 170)}
            stroke="rgba(0,217,126,0.035)"
            strokeWidth="0.8"
          />
          {/* Center faint mega-hex */}
          <polygon
            points={hex(550, 390, 520)}
            stroke="rgba(255,255,255,0.012)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* ── Hero content ─────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center gap-7 max-w-2xl">

        {/* Eyebrow */}
        <div className="dr-enter">
          <span
            className="dr-label px-4 py-1.5 rounded-[var(--radius-pill)]"
            style={{
              border: '1px solid rgba(200,148,58,0.3)',
              color: 'var(--color-dr-gold)',
              background: 'rgba(200,148,58,0.06)',
            }}
          >
            ⚡ Beta · IT Community Uzbekistan
          </span>
        </div>

        {/* Main title */}
        <div className="dr-enter-2">
          <h1
            className="dr-heading leading-none"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 6rem)' }}
          >
            <span className="dr-text-gold">DevRaid</span>
          </h1>
        </div>

        {/* Tagline */}
        <div className="dr-enter-3">
          <p
            className="text-lg font-light leading-relaxed"
            style={{ color: 'var(--color-dr-text-2)', maxWidth: '480px' }}
          >
            Form your raid. Fill your role.{' '}
            <span style={{ color: 'var(--color-dr-text)', fontWeight: 500 }}>
              Ship something worth remembering.
            </span>
          </p>
        </div>

        {/* Stats row */}
        <div className="dr-enter-4 w-full">
          <div className="grid grid-cols-3 gap-3">
            {STATS.map(({ value, label }) => (
              <div key={label} className="dr-card p-4 text-center">
                <p
                  className="text-2xl font-bold mb-0.5"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-dr-gold)',
                  }}
                >
                  {value}
                </p>
                <p className="dr-label" style={{ color: 'var(--color-dr-muted)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="dr-enter-5 flex gap-4 flex-wrap justify-center">
          <Link href="/raids" className="dr-btn-primary">
            Browse Raids →
          </Link>
          <Link href="/captain/new" className="dr-btn-secondary">
            Create a Raid
          </Link>
        </div>

        {/* Bottom hint */}
        <p
          className="dr-label dr-enter-5"
          style={{
            color: 'var(--color-dr-muted)',
            animationDelay: '0.4s',
            opacity: 0,
          }}
        >
          No account needed to browse · Open beta
        </p>
      </div>

      {/* ── Bottom gradient vignette ─────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, var(--color-dr-bg) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />
    </div>
  )
}
