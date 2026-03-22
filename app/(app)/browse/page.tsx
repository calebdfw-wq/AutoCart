'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import CartCard from '@/components/autocart/CartCard'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { DEMO_CARTS } from '@/lib/seed-data'
import { CartCategory, DietaryLabel } from '@/lib/types'
import { CATEGORY_CONFIG, DIETARY_CONFIG, cn } from '@/lib/utils'

const CATEGORIES: CartCategory[] = ['meal-prep', 'bulking', 'cutting', 'family', 'budget', 'athlete', 'vegan', 'keto', 'college']
const DIETARY_OPTIONS: DietaryLabel[] = ['high-protein', 'gluten-free', 'dairy-free', 'vegan', 'low-carb', 'organic']
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

export default function BrowsePage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CartCategory | ''>('')
  const [selectedDietary, setSelectedDietary] = useState<DietaryLabel[]>([])
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [likedIds, setLikedIds] = useState<string[]>([])

  const toggleDietary = (label: DietaryLabel) => {
    setSelectedDietary(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    )
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedDietary([])
    setSearch('')
    setSortBy('popular')
  }

  const hasActiveFilters = selectedCategory || selectedDietary.length > 0 || search

  const filteredCarts = useMemo(() => {
    let carts = DEMO_CARTS.filter(c => c.visibility === 'public')

    if (search) {
      const q = search.toLowerCase()
      carts = carts.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some(t => t.includes(q)) ||
        c.creator?.username.toLowerCase().includes(q) ||
        c.creator?.displayName.toLowerCase().includes(q)
      )
    }

    if (selectedCategory) carts = carts.filter(c => c.category === selectedCategory)

    if (selectedDietary.length > 0) {
      carts = carts.filter(c => selectedDietary.every(d => c.dietaryLabels.includes(d)))
    }

    switch (sortBy) {
      case 'popular': carts = [...carts].sort((a, b) => b.likesCount - a.likesCount); break
      case 'newest': carts = [...carts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      case 'price-asc': carts = [...carts].sort((a, b) => a.estimatedTotalCost - b.estimatedTotalCost); break
      case 'price-desc': carts = [...carts].sort((a, b) => b.estimatedTotalCost - a.estimatedTotalCost); break
    }

    return carts
  }, [search, selectedCategory, selectedDietary, sortBy])

  const toggleSave = (cartId: string) => setSavedIds(p => p.includes(cartId) ? p.filter(id => id !== cartId) : [...p, cartId])
  const toggleLike = (cartId: string) => setLikedIds(p => p.includes(cartId) ? p.filter(id => id !== cartId) : [...p, cartId])

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-1">Discover AutoCarts</h1>
        <p className="text-zinc-500 text-sm">Browse {DEMO_CARTS.filter(c => c.visibility === 'public').length} expert-built grocery carts</p>
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1">
          <Input
            placeholder="Search carts, creators, ingredients…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search size={15} />}
            rightElement={search ? (
              <button onClick={() => setSearch('')} className="hover:text-zinc-300">
                <X size={14} />
              </button>
            ) : null}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-4 rounded-xl border text-sm font-medium transition-all duration-150',
            showFilters || hasActiveFilters
              ? 'bg-brand-500/15 border-brand-500/30 text-brand-400'
              : 'bg-surface-700 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white',
          )}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-brand-400 ml-0.5" />
          )}
        </button>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-surface-700 border border-white/10 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-surface-800">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mb-5 p-4 rounded-2xl bg-surface-800 border border-white/10 animate-slide-up space-y-4">
          {/* Categories */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                  !selectedCategory ? 'bg-brand-500/15 border-brand-500/30 text-brand-400' : 'bg-surface-700 border-white/10 text-zinc-400 hover:border-white/25',
                )}
              >
                All
              </button>
              {CATEGORIES.map(cat => {
                const config = CATEGORY_CONFIG[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                      selectedCategory === cat ? 'bg-brand-500/15 border-brand-500/30 text-brand-400' : 'bg-surface-700 border-white/10 text-zinc-400 hover:border-white/25',
                    )}
                  >
                    {config.emoji} {config.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Dietary */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Dietary</p>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map(label => {
                const config = DIETARY_CONFIG[label]
                return (
                  <button
                    key={label}
                    onClick={() => toggleDietary(label)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                      selectedDietary.includes(label) ? 'bg-brand-500/15 border-brand-500/30 text-brand-400' : 'bg-surface-700 border-white/10 text-zinc-400 hover:border-white/25',
                    )}
                  >
                    {config.emoji} {config.label}
                  </button>
                )
              })}
            </div>
          </div>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-300 transition-colors">
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Category quick filter (chips) */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('')}
          className={cn(
            'shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border',
            !selectedCategory ? 'bg-brand-500 border-brand-500 text-white shadow-glow-sm' : 'bg-surface-700 border-white/10 text-zinc-400 hover:border-white/20',
          )}
        >
          All
        </button>
        {CATEGORIES.map(cat => {
          const config = CATEGORY_CONFIG[cat]
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
              className={cn(
                'shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border',
                selectedCategory === cat ? 'bg-brand-500 border-brand-500 text-white shadow-glow-sm' : 'bg-surface-700 border-white/10 text-zinc-400 hover:border-white/20',
              )}
            >
              {config.emoji} {config.label}
            </button>
          )
        })}
      </div>

      {/* Results */}
      {filteredCarts.length > 0 ? (
        <>
          <p className="text-xs text-zinc-600 mb-4">
            Showing {filteredCarts.length} cart{filteredCarts.length !== 1 ? 's' : ''}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {filteredCarts.map(cart => (
              <CartCard
                key={cart.id}
                cart={cart}
                isSaved={savedIds.includes(cart.id)}
                isLiked={likedIds.includes(cart.id)}
                onSave={toggleSave}
                onLike={toggleLike}
                className="animate-slide-up"
              />
            ))}
          </div>
        </>
      ) : (
        <div className="py-16 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-white font-medium mb-1">No carts found</p>
          <p className="text-sm text-zinc-500 mb-4">Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
