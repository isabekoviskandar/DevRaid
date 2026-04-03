import { cn } from '@/lib/utils'

// ── DevRaid Unified Card Anatomy ───────────────────────────────
//
//  ┌─────────────────────────────────────────┐
//  │  [hex mini / icon]        [status badge] │  ← header
//  │  Title                                   │
//  │  Subtitle / meta                         │
//  ├─────────────────────────────────────────┤
//  │  [content slot]                          │  ← body
//  ├─────────────────────────────────────────┤
//  │  [tags / chips]      [primary action →] │  ← footer
//  └─────────────────────────────────────────┘

interface CardRootProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  glowing?: boolean
}

export function Card({ children, className, onClick, glowing }: CardRootProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'dr-card relative flex flex-col gap-0 transition-all duration-200',
        onClick && 'cursor-pointer hover:border-[var(--color-dr-edge-2)]',
        glowing && 'dr-glow-ring',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-start justify-between gap-2 p-4 pb-2', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-4 py-2 flex-1', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 px-4 py-3',
        'border-t border-[var(--color-dr-edge)]',
        className
      )}
    >
      {children}
    </div>
  )
}

// ── Status Badge ───────────────────────────────────────────────
export type StatusVariant = 'recruiting' | 'closed' | 'pending' | 'active' | 'completed'

const STATUS_STYLES: Record<StatusVariant, string> = {
  recruiting: 'text-[var(--color-dr-status-recruiting)] bg-[var(--color-dr-status-recruiting)]/10',
  closed:     'text-[var(--color-dr-status-closed)] bg-[var(--color-dr-status-closed)]/10',
  pending:    'text-[var(--color-dr-status-pending)] bg-[var(--color-dr-status-pending)]/10',
  active:     'text-[var(--color-dr-status-active)] bg-[var(--color-dr-status-active)]/10',
  completed:  'text-[var(--color-dr-status-completed)] bg-[var(--color-dr-status-completed)]/10',
}

function isValidStatus(status: unknown): status is StatusVariant {
  return typeof status === 'string' && status in STATUS_STYLES
}

export function StatusBadge({ status, className }: { status: string | StatusVariant; className?: string }) {
  const safeStatus: StatusVariant = isValidStatus(status) ? status : 'pending'

  return (
    <span
      className={cn(
        'dr-label px-2 py-0.5 rounded-[var(--radius-badge)]',
        STATUS_STYLES[safeStatus],
        className
      )}
    >
      {status}
    </span>
  )
}

// ── Role Chip ──────────────────────────────────────────────────
type RoleVariant = 'frontend' | 'backend' | 'design' | 'mobile' | 'devops' | 'marketing' | 'seo' | 'data'

export function RoleChip({ role, className }: { role: RoleVariant | string; className?: string }) {
  const colorVar = `var(--color-dr-role-${role})`
  return (
    <span
      className={cn('dr-label px-2 py-0.5 rounded-[var(--radius-pill)]', className)}
      style={{
        color: colorVar,
        background: `color-mix(in srgb, ${colorVar} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${colorVar} 25%, transparent)`,
      }}
    >
      {role}
    </span>
  )
}
