import type { Quest } from '@/types'

const PRIORITY_COLOR: Record<Quest['priority'], string> = {
  low:      'var(--color-dr-muted)',
  medium:   'var(--color-dr-text-2)',
  high:     'var(--color-dr-gold)',
  critical: 'var(--color-dr-role-devops)',
}

const STATUS_COLOR: Record<Quest['status'], string> = {
  backlog:     'var(--color-dr-muted)',
  in_progress: 'var(--color-dr-glow)',
  review:      'var(--color-dr-gold)',
  done:        'var(--color-dr-status-recruiting)',
}

export function QuestCard({ quest }: { quest: Quest }) {
  return (
    <div
      className="dr-card p-3 flex flex-col gap-2 cursor-pointer transition-colors"
      style={{ '--tw-border-opacity': '1' } as React.CSSProperties}
    >
      {/* Priority + status */}
      <div className="flex items-start justify-between gap-2">
        <span className="dr-label" style={{ color: PRIORITY_COLOR[quest.priority] }}>
          {quest.priority}
        </span>
        <span
          className="dr-label px-1.5 py-0.5 rounded-[var(--radius-badge)]"
          style={{
            color: STATUS_COLOR[quest.status],
            background: `color-mix(in srgb, ${STATUS_COLOR[quest.status]} 12%, transparent)`,
          }}
        >
          {quest.status.replace('_', ' ')}
        </span>
      </div>

      {/* Title */}
      <p className="text-sm font-medium leading-snug" style={{ color: 'var(--color-dr-text)' }}>
        {quest.title}
      </p>

      {/* Description */}
      {quest.description && (
        <p
          className="text-xs leading-relaxed line-clamp-2"
          style={{ color: 'var(--color-dr-muted)' }}
        >
          {quest.description}
        </p>
      )}

      {/* Assignee */}
      {quest.assignee && (
        <div className="flex items-center gap-1.5 pt-1">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: 'var(--color-dr-surface-2)', color: 'var(--color-dr-glow)' }}
          >
            {quest.assignee.display_name[0]}
          </div>
          <span className="dr-label" style={{ color: 'var(--color-dr-muted)' }}>
            {quest.assignee.display_name}
          </span>
        </div>
      )}
    </div>
  )
}
