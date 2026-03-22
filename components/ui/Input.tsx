import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightElement?: ReactNode
  containerClassName?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightElement,
  containerClassName,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-zinc-300"
        >
          {label}
          {props.required && <span className="text-brand-400 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-surface-700 text-white placeholder:text-zinc-600',
            'border border-white/10 rounded-xl',
            'px-4 py-2.5 text-sm font-sans',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50',
            'hover:border-white/20',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            error && 'border-red-500/50 focus:ring-red-500/30',
            leftIcon && 'pl-10',
            rightElement && 'pr-10',
            className,
          )}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {rightElement}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'

// ─── Textarea variant ─────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  containerClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  hint,
  containerClassName,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
          {label}
          {props.required && <span className="text-brand-400 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          'w-full bg-surface-700 text-white placeholder:text-zinc-600',
          'border border-white/10 rounded-xl resize-none',
          'px-4 py-3 text-sm font-sans leading-relaxed',
          'transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50',
          'hover:border-white/20',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          error && 'border-red-500/50',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  )
})

Textarea.displayName = 'Textarea'

// ─── Select variant ───────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  containerClassName?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  hint,
  containerClassName,
  className,
  id,
  options,
  placeholder,
  ...props
}, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
          {label}
          {props.required && <span className="text-brand-400 ml-0.5">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={cn(
          'w-full bg-surface-700 text-white',
          'border border-white/10 rounded-xl',
          'px-4 py-2.5 text-sm font-sans',
          'transition-all duration-150 appearance-none cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50',
          'hover:border-white/20',
          error && 'border-red-500/50',
          className,
        )}
        {...props}
      >
        {placeholder && <option value="" className="text-zinc-500">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-surface-800">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  )
})

Select.displayName = 'Select'

export default Input
