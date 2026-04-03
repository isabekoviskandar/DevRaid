import { cn } from '@/lib/utils'

interface HexSlotIndicatorProps {
  filled: boolean
  color: string
  size?: number
  className?: string
}

export function HexSlotIndicator({
  filled,
  color,
  size = 16,
  className,
}: HexSlotIndicatorProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      <polygon
        points="10,1.25 18,5.75 18,14.25 10,18.75 2,14.25 2,5.75"
        fill={filled ? `color-mix(in srgb, ${color} 18%, transparent)` : 'transparent'}
        stroke={color}
        strokeWidth={filled ? 1.5 : 1.15}
        opacity={filled ? 1 : 0.42}
      />
    </svg>
  )
}
