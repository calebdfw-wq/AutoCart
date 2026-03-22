'use client'

import { cn } from '@/lib/utils'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  size?: 'sm' | 'md'
  disabled?: boolean
  className?: string
}

export default function Toggle({
  checked,
  onChange,
  label,
  description,
  size = 'md',
  disabled = false,
  className,
}: ToggleProps) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative shrink-0 rounded-full transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          size === 'sm' ? 'w-8 h-4' : 'w-11 h-6',
          checked
            ? 'bg-brand-500 shadow-glow-sm'
            : 'bg-surface-500 border border-white/10',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 rounded-full bg-white shadow-sm transition-all duration-200 ease-out',
            size === 'sm' ? 'w-3 h-3 left-0.5' : 'w-5 h-5 left-0.5',
            checked && (size === 'sm' ? 'translate-x-4' : 'translate-x-5'),
          )}
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col min-w-0">
          {label && (
            <span className={cn(
              'font-medium text-white leading-tight',
              size === 'sm' ? 'text-xs' : 'text-sm',
            )}>
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{description}</span>
          )}
        </div>
      )}
    </div>
  )
}
