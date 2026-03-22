'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bookmark, Search, X, Trash2 } from 'lucide-react'
import { DEMO_CARTS, DEMO_FAVORITES } from '@/lib/seed-data'
import { useAuth } from '@/contexts/AuthContext'
import CartCard from '@/components/autocart/CartCard'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function SavedPage() {
  const { user } = useAuth()
  const [savedIds, setSavedIds] = useState<string[]>(DEMO_FAVORITES.map(f => f.cartId))
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [search, setSearch] = useState('')

  const savedCarts = DEMO_CARTS.filter(c => savedIds.includes(c.id))
  const filtered = search
    ? savedCarts.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.creator?.username.toLowerCase().includes(search.toLowerCase())
      )
    : savedCarts

  const toggleSave = (cartId: string) => {
    setSavedIds(prev => {
      if (prev.includes(cartId)) {
        toast.success('Removed from saved')
        return prev.filter(id => id !== cartId)
      }
      return [...prev, cartId]
    })
  }

  const toggleLike = (cartId: string) => {
    setLikedIds(prev => prev.includes(cartId) ? prev.filter(id => id !== cartId) : [...prev, cartId])
  }

  const clearAll = () => {
    setSavedIds([])
    toast.success('Cleared all saved carts')
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-1 flex items-center gap-2.5">
            <Bookmark size={22} className="text-brand-400" />
            Saved Carts
          </h1>
          <p className="text-zinc-500 text-sm">
            {savedCarts.length} cart{savedCarts.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        {savedCarts.length > 0 && (
          <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={clearAll}>
            Clear All
          </Button>
        )}
      </div>

      {/* Search */}
      {savedCarts.length > 0 && (
        <div className="mb-6 max-w-md">
          <Input
            placeholder="Search saved carts…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search size={15} />}
            rightElement={search ? (
              <button onClick={() => setSearch('')}><X size={14} /></button>
            ) : null}
          />
        </div>
      )}

      {/* Cart grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(cart => (
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
      ) : savedCarts.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-white/10 bg-surface-800/30">
          <div className="w-14 h-14 rounded-2xl bg-surface-700 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Bookmark size={24} className="text-zinc-600" />
          </div>
          <h2 className="font-display font-bold text-lg text-white mb-2">No saved carts yet</h2>
          <p className="text-sm text-zinc-500 mb-5 max-w-xs mx-auto">
            Browse creator carts and tap the bookmark icon to save them here for later.
          </p>
          <Link href="/browse">
            <Button size="md">Browse AutoCarts</Button>
          </Link>
        </div>
      ) : (
        <div className="py-10 text-center">
          <p className="text-zinc-500">No saved carts match "{search}"</p>
          <button onClick={() => setSearch('')} className="text-sm text-brand-400 mt-2 hover:text-brand-300">
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}
