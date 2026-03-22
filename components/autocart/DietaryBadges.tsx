import { DietaryLabel } from '@/lib/types'
import { DIETARY_CONFIG } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface DietaryBadgesProps {
  labels: DietaryLabel[]
  maxVisible?: number
  size?: 'sm' | 'md'
  className?: string
}

export default function DietaryBadges({
  labels,
  maxVisible = 4,
  size = 'sm',
  className,
}: DietaryBadgesProps) {
  if (!labels.length) return null

  const visible = labels.slice(0, maxVisible)
  const overflow = labels.length - maxVisible

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {visible.map(label => {
        const config = DIETARY_CONFIG[label]
        if (!config) return null
        return (
          <span
            key={label}
            className={cn(
              'inline-flex items-center gap-1 rounded-full font-medium',
              'bg-surface-600 text-zinc-300 border border-white/10',
              size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
            )}
            title={config.label}
          >
            <span>{config.emoji}</span>
            {config.label}
          </span>
        )
      })}
      {overflow > 0 && (
        <span className={cn(
          'inline-flex items-center rounded-full font-medium',
          'bg-surface-600/50 text-zinc-500 border border-white/8',
          size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        )}>
          +{overflow} more
        </span>
      )}
    </div>
  )
}
