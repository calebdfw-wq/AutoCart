'use client'

import Link from 'next/link'
import { Heart, Bookmark, Users, DollarSign, ChevronRight, Zap, Copy } from 'lucide-react'
import { AutoCart } from '@/lib/types'
import { cn, formatCurrency, formatNumber, timeAgo, CATEGORY_CONFIG, DIETARY_CONFIG } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

interface CartCardProps {
  cart: AutoCart
  variant?: 'feed' | 'compact' | 'featured'
  isSaved?: boolean
  isLiked?: boolean
  onSave?: (cartId: string) => void
  onLike?: (cartId: string) => void
  className?: string
}

export default function CartCard({
  cart,
  variant = 'feed',
  isSaved = false,
  isLiked = false,
  onSave,
  onLike,
  className,
}: CartCardProps) {
  const categoryConfig = CATEGORY_CONFIG[cart.category]

  if (variant === 'compact') {
    return (
      <Link href={`/cart/${cart.id}`}>
        <div className={cn(
          'flex items-center gap-3 p-3 rounded-xl',
          'bg-surface-700/50 hover:bg-surface-700 border border-white/8 hover:border-white/15',
          'transition-all duration-150 group',
          className,
        )}>
          {cart.coverImage ? (
            <img src={cart.coverImage} alt={cart.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
          ) : (
            <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0', categoryConfig.color)}>
              {categoryConfig.emoji}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate group-hover:text-brand-400 transition-colors">
              {cart.title}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              by @{cart.creator?.username} · {formatCurrency(cart.estimatedTotalCost)}
            </p>
          </div>
          <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-400 shrink-0 transition-colors" />
        </div>
      </Link>
    )
  }

  return (
    <div className={cn(
      'group relative flex flex-col bg-surface-800 rounded-2xl overflow-hidden',
      'border border-white/[0.07] hover:border-brand-500/25',
      'transition-all duration-250 ease-out',
      'hover:shadow-card-hover hover:-translate-y-0.5',
      variant === 'featured' && 'shadow-card',
      className,
    )}>
      {/* Cover Image */}
      <Link href={`/cart/${cart.id}`} className="block relative">
        <div className="aspect-[16/7] overflow-hidden bg-surface-700">
          {cart.coverImage ? (
            <img
              src={cart.coverImage}
              alt={cart.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-700 to-surface-600">
              <span className="text-5xl">{categoryConfig.emoji}</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-800/80 via-transparent to-transparent" />
        </div>

        {/* Category badge overlay */}
        <div className="absolute top-3 left-3">
          <Badge className={cn('backdrop-blur-sm', categoryConfig.color)}>
            {categoryConfig.emoji} {categoryConfig.label}
          </Badge>
        </div>

        {/* Cost badge */}
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-surface-900/80 backdrop-blur-sm text-white border border-white/15">
            <DollarSign size={11} className="text-brand-400" />
            {formatCurrency(cart.estimatedTotalCost)}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Creator */}
        {cart.creator && (
          <div className="flex items-center gap-2">
            <img
              src={cart.creator.avatarUrl ?? `https://api.dicebear.com/7.x/initials/svg?seed=${cart.creator.username}`}
              alt={cart.creator.displayName}
              className="w-5 h-5 rounded-full ring-1 ring-white/20 object-cover"
            />
            <Link href={`/profile/${cart.creator.username}`} className="text-xs text-zinc-500 hover:text-white transition-colors">
              @{cart.creator.username}
            </Link>
            <span className="text-zinc-700 text-[10px]">·</span>
            <span className="text-xs text-zinc-600">{timeAgo(cart.createdAt)}</span>
          </div>
        )}

        {/* Title */}
        <Link href={`/cart/${cart.id}`}>
          <h3 className="font-display font-bold text-base text-white leading-snug group-hover:text-brand-300 transition-colors line-clamp-2">
            {cart.title}
          </h3>
        </Link>

        {/* Dietary labels */}
        {cart.dietaryLabels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {cart.dietaryLabels.slice(0, 3).map(label => (
              <span key={label} className="text-[11px] text-zinc-400 bg-surface-700/70 px-2 py-0.5 rounded-md border border-white/8">
                {DIETARY_CONFIG[label]?.emoji} {DIETARY_CONFIG[label]?.label}
              </span>
            ))}
            {cart.dietaryLabels.length > 3 && (
              <span className="text-[11px] text-zinc-600 bg-surface-700/70 px-2 py-0.5 rounded-md border border-white/8">
                +{cart.dietaryLabels.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-zinc-500 mt-auto">
          <span className="flex items-center gap-1">
            <Users size={12} className="text-zinc-600" />
            {cart.servings} servings
          </span>
          <span className="text-zinc-700">·</span>
          <span className="flex items-center gap-1">
            <DollarSign size={12} className="text-zinc-600" />
            ~{formatCurrency(cart.estimatedCostPerMeal ?? cart.estimatedTotalCost / cart.servings)}/meal
          </span>
          {cart.items.length > 0 && (
            <>
              <span className="text-zinc-700">·</span>
              <span>{cart.items.length} items</span>
            </>
          )}
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-1 px-4 py-3 border-t border-white/[0.06]">
        <Link href={`/cart/${cart.id}`} className="flex-1">
          <button className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors">
            <Zap size={12} />
            Generate Cart
          </button>
        </Link>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.preventDefault(); onLike?.(cart.id) }}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
              isLiked
                ? 'text-red-400 bg-red-500/10'
                : 'text-zinc-500 hover:text-red-400 hover:bg-red-500/10',
            )}
          >
            <Heart size={13} className={isLiked ? 'fill-current' : ''} />
            {formatNumber(cart.likesCount)}
          </button>

          <button
            onClick={(e) => { e.preventDefault(); onSave?.(cart.id) }}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
              isSaved
                ? 'text-brand-400 bg-brand-500/10'
                : 'text-zinc-500 hover:text-brand-400 hover:bg-brand-500/10',
            )}
          >
            <Bookmark size={13} className={isSaved ? 'fill-current' : ''} />
            {formatNumber(cart.savesCount)}
          </button>
        </div>
      </div>
    </div>
  )
}
