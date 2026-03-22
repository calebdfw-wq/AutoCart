import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const variants = {
  primary: [
    'bg-brand-500 text-white font-semibold',
    'hover:bg-brand-400 active:bg-brand-600',
    'shadow-glow-sm hover:shadow-glow-md',
    'border border-brand-500/50',
  ].join(' '),
  secondary: [
    'bg-surface-600 text-white font-medium',
    'hover:bg-surface-500 active:bg-surface-700',
    'border border-white/10 hover:border-white/20',
  ].join(' '),
  ghost: [
    'bg-transparent text-zinc-300 font-medium',
    'hover:bg-white/5 hover:text-white active:bg-white/10',
    'border border-transparent hover:border-white/10',
  ].join(' '),
  outline: [
    'bg-transparent text-brand-400 font-semibold',
    'hover:bg-brand-500/10',
    'border border-brand-500/40 hover:border-brand-400/70',
  ].join(' '),
  danger: [
    'bg-red-500/10 text-red-400 font-semibold',
    'hover:bg-red-500/20',
    'border border-red-500/30 hover:border-red-400/60',
  ].join(' '),
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-2.5 text-base gap-2 rounded-xl',
  xl: 'px-8 py-3.5 text-lg gap-2.5 rounded-2xl',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-sans',
        'transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        'select-none whitespace-nowrap',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="animate-spin shrink-0" size={size === 'sm' ? 12 : size === 'xl' ? 20 : 16} />}
      {!loading && icon && iconPosition === 'left' && (
        <span className="shrink-0">{icon}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
