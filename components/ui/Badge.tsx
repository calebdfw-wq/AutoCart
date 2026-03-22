import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'green' | 'orange' | 'blue' | 'purple' | 'red' | 'yellow'
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}

const variants = {
  default: 'bg-surface-600 text-zinc-300 border border-white/10',
  green: 'bg-brand-500/15 text-brand-400 border border-brand-500/25',
  orange: 'bg-accent-500/15 text-accent-400 border border-accent-500/25',
  blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/25',
  red: 'bg-red-500/15 text-red-400 border border-red-500/25',
  yellow: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25',
}

const dots = {
  default: 'bg-zinc-400',
  green: 'bg-brand-400',
  orange: 'bg-accent-400',
  blue: 'bg-blue-400',
  purple: 'bg-purple-400',
  red: 'bg-red-400',
  yellow: 'bg-yellow-400',
}

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        variants[variant],
        className,
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dots[variant])} />
      )}
      {children}
    </span>
  )
}
