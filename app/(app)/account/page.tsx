'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Settings, TrendingUp, Heart, Bookmark, Eye, Edit, ShoppingCart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { DEMO_CARTS } from '@/lib/seed-data'
import CartCard from '@/components/autocart/CartCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatNumber, getAvatarUrl } from '@/lib/utils'

export default function AccountPage() {
  const { user } = useAuth()
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [likedIds, setLikedIds] = useState<string[]>([])

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-4xl mb-4">👤</p>
        <h2 className="font-display font-bold text-xl text-white mb-2">Not signed in</h2>
        <p className="text-zinc-500 mb-4">Sign in to view your profile.</p>
        <Link href="/login"><Button size="sm">Sign In</Button></Link>
      </div>
    )
  }

  const userCarts = DEMO_CARTS.filter(c => c.creatorId === user.id && c.visibility === 'public')
  const totalLikes = userCarts.reduce((sum, c) => sum + c.likesCount, 0)
  const totalSaves = userCarts.reduce((sum, c) => sum + c.savesCount, 0)
  const totalViews = userCarts.reduce((sum, c) => sum + c.viewsCount, 0)

  const toggleSave = (id: string) => setSavedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const toggleLike = (id: string) => setLikedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Profile header */}
      <div className="bg-surface-800 rounded-2xl border border-white/8 overflow-hidden mb-6">
        <div className="h-28 bg-gradient-to-br from-brand-500/15 via-surface-700 to-accent-500/10 relative">
          <div className="absolute inset-0 mesh-bg opacity-80" />
        </div>
        <div className="px-5 sm:px-7 pb-6">
          <div className="flex items-end justify-between gap-4 -mt-10 mb-4">
            <img
              src={user.avatarUrl ?? getAvatarUrl(user.username, 80)}
              alt={user.displayName}
              className="w-20 h-20 rounded-2xl ring-4 ring-surface-800 object-cover bg-surface-700"
            />
            <div className="flex gap-2 pb-1">
              <Link href="/settings">
                <Button variant="secondary" size="sm" icon={<Edit size={14} />}>Edit Profile</Button>
              </Link>
              <Link href="/settings">
                <Button variant="secondary" size="sm" icon={<Settings size={14} />} />
              </Link>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-display font-extrabold text-xl text-white">{user.displayName}</h1>
              {user.userType === 'creator' && <Badge variant="green" dot>Creator</Badge>}
              {user.userType === 'admin' && <Badge variant="orange" dot>Admin</Badge>}
            </div>
            <p className="text-sm text-zinc-500">@{user.username}</p>
          </div>

          {user.bio && <p className="text-sm text-zinc-400 leading-relaxed mb-4 max-w-xl">{user.bio}</p>}

          <div className="flex gap-5 text-sm">
            <div>
              <span className="font-display font-bold text-white">{formatNumber(user.followerCount ?? 0)}</span>
              <span className="text-zinc-500 ml-1.5">followers</span>
            </div>
            <div>
              <span className="font-display font-bold text-white">{formatNumber(user.followingCount ?? 0)}</span>
              <span className="text-zinc-500 ml-1.5">following</span>
            </div>
            <div>
              <span className="font-display font-bold text-white">{userCarts.length}</span>
              <span className="text-zinc-500 ml-1.5">carts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Likes', value: formatNumber(totalLikes), icon: Heart, color: 'text-red-400 bg-red-500/10' },
          { label: 'Total Saves', value: formatNumber(totalSaves), icon: Bookmark, color: 'text-brand-400 bg-brand-500/10' },
          { label: 'Total Views', value: formatNumber(totalViews), icon: Eye, color: 'text-blue-400 bg-blue-500/10' },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-2xl bg-surface-800 border border-white/8 text-center">
            <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}>
              <stat.icon size={17} />
            </div>
            <p className="font-display font-extrabold text-xl text-white">{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Carts */}
      <div>
        <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-brand-400" />
          My AutoCarts ({userCarts.length})
        </h2>

        {userCarts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {userCarts.map(cart => (
              <CartCard key={cart.id} cart={cart} isSaved={savedIds.includes(cart.id)} isLiked={likedIds.includes(cart.id)} onSave={toggleSave} onLike={toggleLike} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center rounded-2xl border border-dashed border-white/10">
            <ShoppingCart size={32} className="text-zinc-600 mx-auto mb-3" />
            <p className="text-white font-medium mb-1">No carts yet</p>
            <p className="text-sm text-zinc-500 mb-4">Create your first AutoCart to share with the world!</p>
            <Link href="/create"><Button size="sm">Create My First Cart</Button></Link>
          </div>
        )}
      </div>
    </div>
  )
}
