interface EmptyStateProps {
  svg: React.ReactNode
  heading: string
  body: string
  cta?: {
    label: string
    onClick?: () => void
    href?: string
  }
}

export function EmptyState({ svg, heading, body, cta }: EmptyStateProps) {
  return (
    <div
      className="dr-enter flex flex-col items-center text-center py-12 px-6 gap-4"
      role="status"
    >
      <div aria-hidden="true" className="mb-2">
        {svg}
      </div>
      <h3
        className="text-base font-semibold"
        style={{ color: 'var(--color-dr-text)' }}
      >
        {heading}
      </h3>
      <p
        className="text-sm max-w-xs"
        style={{ color: 'var(--color-dr-text-2)', lineHeight: 1.6 }}
      >
        {body}
      </p>
      {cta && (
        cta.href ? (
          <a href={cta.href} className="dr-btn-secondary text-sm mt-1">
            {cta.label}
          </a>
        ) : (
          <button onClick={cta.onClick} className="dr-btn-secondary text-sm mt-1">
            {cta.label}
          </button>
        )
      )}
    </div>
  )
}

/* ── Inline SVG illustrations ─────────────────────────── */

export function RaidsEmptySvg() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Shield body */}
      <path
        d="M48 8L16 20v28c0 16 14 28 32 36 18-8 32-20 32-36V20L48 8z"
        fill="#263047"
        stroke="#00D97E"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Shield inner detail */}
      <path
        d="M48 18L24 28v22c0 11 10 20 24 26 14-6 24-15 24-26V28L48 18z"
        fill="none"
        stroke="#00D97E"
        strokeWidth="0.75"
        strokeOpacity="0.4"
        strokeLinejoin="round"
      />
      {/* Crossed swords */}
      <line x1="34" y1="38" x2="62" y2="58" stroke="#00D97E" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
      <line x1="62" y1="38" x2="34" y2="58" stroke="#00D97E" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
    </svg>
  )
}

export function SkillsEmptySvg() {
  return (
    <svg
      width="80"
      height="96"
      viewBox="0 0 80 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Scroll body */}
      <rect x="12" y="12" width="56" height="72" rx="4" fill="#263047" stroke="#C8943A" strokeWidth="1.5" />
      {/* Scroll top roller */}
      <rect x="8" y="8" width="64" height="12" rx="6" fill="#1C2236" stroke="#C8943A" strokeWidth="1.5" />
      {/* Scroll bottom roller */}
      <rect x="8" y="76" width="64" height="12" rx="6" fill="#1C2236" stroke="#C8943A" strokeWidth="1.5" />
      {/* Text lines on scroll */}
      <line x1="24" y1="34" x2="56" y2="34" stroke="#C8943A" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
      <line x1="24" y1="44" x2="48" y2="44" stroke="#C8943A" strokeWidth="1" strokeOpacity="0.35" strokeLinecap="round" />
      <line x1="24" y1="54" x2="52" y2="54" stroke="#C8943A" strokeWidth="1" strokeOpacity="0.35" strokeLinecap="round" />
      <line x1="24" y1="64" x2="40" y2="64" stroke="#C8943A" strokeWidth="1" strokeOpacity="0.25" strokeLinecap="round" />
    </svg>
  )
}
