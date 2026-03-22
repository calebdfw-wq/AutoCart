'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PlusCircle, TrendingUp, Heart, Bookmark, Eye, ArrowRight, Zap, ShoppingCart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import CartCard from '@/components/autocart/CartCard'
import Button from '@/components/ui/Button'
import { DEMO_CARTS, DEMO_FAVORITES } from '@/lib/seed-data'
import { formatNumber, formatCurrency, timeAgo, CATEGORY_CONFIG } from '@/lib/utils'

export default function DashboardPage() {
  const { user } = useAuth()
  const [savedIds, setSavedIds] = useState<string[]>(DEMO_FAVORITES.map(f => f.cartId))
  const [likedIds, setLikedIds] = useState<string[]>([])

  // Simulated stats for demo
  const stats = [
    { label: 'Carts Created', value: user?.userType === 'creator' ? '12' : '3', icon: ShoppingCart, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { label: 'Total Saves', value: user?.userType === 'creator' ? '8.4K' : '6', icon: Bookmark, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Likes Received', value: user?.userType === 'creator' ? '24.2K' : '18', icon: Heart, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Cart Views', value: user?.userType === 'creator' ? '142K' : '89', icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ]

  const myCarts = user?.userType === 'creator'
    ? DEMO_CARTS.filter(c => c.creatorId === user.id || c.creatorId === 'user-001').slice(0, 3)
    : DEMO_CARTS.filter(c => savedIds.includes(c.id))

  const trendingCarts = DEMO_CARTS.sort((a, b) => b.likesCount - a.likesCount).slice(0, 4)

  const toggleSave = (cartId: string) => {
    setSavedIds(prev => prev.includes(cartId) ? prev.filter(id => id !== cartId) : [...prev, cartId])
  }
  const toggleLike = (cartId: string) => {
    setLikedIds(prev => prev.includes(cartId) ? prev.filter(id => id !== cartId) : [...prev, cartId])
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-1">
            Welcome back, {user?.displayName?.split(' ')[0]} 👋
          </h1>
          <p className="text-zinc-500 text-sm">
            {user?.userType === 'creator'
              ? 'Your carts are helping people eat better every day.'
              : 'Discover carts, save your favorites, and generate grocery lists.'}
          </p>
        </div>
        <Link href="/create" className="shrink-0">
          <Button size="md" icon={<PlusCircle size={16} />} className="hidden sm:flex">
            New Cart
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="p-4 rounded-2xl bg-surface-800 border border-white/8">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={17} className={stat.color} />
            </div>
            <p className="font-display font-extrabold text-2xl text-white">{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* My carts / saved */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-white">
            {user?.userType === 'creator' ? 'My AutoCarts' : 'Saved Carts'}
          </h2>
          <Link href={user?.userType === 'creator' ? `/profile/${user.username}` : '/saved'}>
            <button className="text-sm text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </button>
          </Link>
        </div>

        {myCarts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCarts.map(cart => (
              <CartCard
                key={cart.id}
                cart={cart}
                isSaved={savedIds.includes(cart.id)}
                isLiked={likedIds.includes(cart.id)}
                onSave={toggleSave}
                onLike={toggleLike}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center bg-surface-800/50">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4">
              <Bookmark size={20} className="text-brand-400" />
            </div>
            <p className="text-white font-medium mb-1">No saved carts yet</p>
            <p className="text-sm text-zinc-500 mb-4">Browse creator carts and save the ones you love</p>
            <Link href="/browse"><Button size="sm">Browse Carts</Button></Link>
          </div>
        )}
      </div>

      {/* Quick create CTA for creators */}
      {user?.userType === 'creator' && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-500/8 to-accent-500/8 border border-white/10 flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center shrink-0">
            <Zap size={20} className="text-brand-400" />
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-white mb-0.5">Build a New AutoCart</p>
            <p className="text-sm text-zinc-500">Share your meal prep expertise with your audience</p>
          </div>
          <Link href="/create" className="shrink-0">
            <Button size="sm">Create Now</Button>
          </Link>
        </div>
      )}

      {/* Trending now */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-400" />
            Trending Carts
          </h2>
          <Link href="/browse">
            <button className="text-sm text-zinc-500 hover:text-white flex items-center gap-1 transition-colors">
              Browse all <ArrowRight size={14} />
            </button>
          </Link>
        </div>
        <div className="space-y-2">
          {trendingCarts.map((cart, i) => (
            <Link key={cart.id} href={`/cart/${cart.id}`}>
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-surface-800 border border-white/8 hover:border-white/15 hover:bg-surface-700/80 transition-all duration-150 group">
                <span className="font-display font-extrabold text-xl text-zinc-700 w-6 shrink-0">{i + 1}</span>
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-surface-600">
                  {cart.coverImage ? (
                    <img src={cart.coverImage} alt={cart.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">
                      {CATEGORY_CONFIG[cart.category]?.emoji}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-brand-400 transition-colors">{cart.title}</p>
                  <p className="text-xs text-zinc-500">by @{cart.creator?.username} · {formatCurrency(cart.estimatedTotalCost)}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-xs text-zinc-600">
                  <span className="flex items-center gap-1"><Heart size={11} /> {formatNumber(cart.likesCount)}</span>
                  <span className="flex items-center gap-1"><Bookmark size={11} /> {formatNumber(cart.savesCount)}</span>
                </div>
                <ArrowRight size={14} className="text-zinc-700 group-hover:text-zinc-400 shrink-0 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
