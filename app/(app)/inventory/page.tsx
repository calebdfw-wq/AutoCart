'use client'

import { useState, useMemo } from 'react'
import { Search, ExternalLink, Package, Zap, X } from 'lucide-react'
import { GROCERY_INVENTORY, INVENTORY_CATEGORIES, InventoryItem } from '@/lib/inventory'
import { cn, formatCurrency } from '@/lib/utils'

// ─── Category display config ──────────────────────────────────
const CATEGORY_DISPLAY: Record<string, { label: string; emoji: string }> = {
  protein:     { label: 'Protein',     emoji: '🥩' },
  dairy:       { label: 'Dairy',       emoji: '🥛' },
  grains:      { label: 'Grains',      emoji: '🌾' },
  produce:     { label: 'Produce',     emoji: '🥦' },
  pantry:      { label: 'Pantry',      emoji: '🏺' },
  frozen:      { label: 'Frozen',      emoji: '❄️' },
  supplements: { label: 'Supplements', emoji: '💊' },
  snacks:      { label: 'Snacks',      emoji: '🍫' },
  beverages:   { label: 'Beverages',   emoji: '🧃' },
  condiments:  { label: 'Condiments',  emoji: '🫙' },
}

// ─── Macro badge ─────────────────────────────────────────────
function MacroBadge({ label, value, unit = 'g', color }: {
  label: string; value: number; unit?: string; color: string
}) {
  return (
    <div className={cn('flex flex-col items-center px-2 py-1 rounded-lg', color)}>
      <span className="text-[10px] font-bold leading-none">{value}{unit}</span>
      <span className="text-[9px] opacity-70 mt-0.5">{label}</span>
    </div>
  )
}

// ─── Inventory Item Card ──────────────────────────────────────
function ItemCard({ item }: { item: InventoryItem }) {
  const cat = CATEGORY_DISPLAY[item.category] ?? { label: item.category, emoji: '📦' }
  const hasNutrition = item.nutrition && (
    item.nutrition.calories || item.nutrition.protein || item.nutrition.carbs || item.nutrition.fat
  )

  return (
    <div className={cn(
      'group flex flex-col p-4 rounded-2xl bg-surface-800 border transition-all duration-200',
      item.inStock
        ? 'border-white/8 hover:border-white/15 hover:bg-surface-700/80'
        : 'border-white/5 opacity-60',
    )}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-snug line-clamp-2">{item.name}</p>
          {item.brand && (
            <p className="text-[11px] text-zinc-500 mt-0.5">{item.brand}</p>
          )}
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="text-sm font-bold text-brand-400">{formatCurrency(item.price)}</span>
          <span className="text-[10px] text-zinc-600">{item.unit}</span>
        </div>
      </div>

      {/* Category + stock badges */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-zinc-400 font-medium">
          <span>{cat.emoji}</span> {cat.label}
        </span>
        {!item.inStock && (
          <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-[10px] text-red-400 font-medium">
            Out of stock
          </span>
        )}
      </div>

      {/* Macros */}
      {hasNutrition && (
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          {item.nutrition?.calories !== undefined && (
            <MacroBadge label="cal" value={item.nutrition.calories} unit="" color="bg-zinc-700/60 text-zinc-300" />
          )}
          {item.nutrition?.protein !== undefined && (
            <MacroBadge label="prot" value={item.nutrition.protein} color="bg-blue-500/15 text-blue-300" />
          )}
          {item.nutrition?.carbs !== undefined && (
            <MacroBadge label="carbs" value={item.nutrition.carbs} color="bg-yellow-500/15 text-yellow-300" />
          )}
          {item.nutrition?.fat !== undefined && (
            <MacroBadge label="fat" value={item.nutrition.fat} color="bg-orange-500/15 text-orange-300" />
          )}
        </div>
      )}

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-1.5 py-0.5 rounded-md bg-brand-500/8 text-[9px] text-brand-400/80 font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* H-E-B link */}
      <div className="mt-auto pt-2">
        <a
          href={item.hebSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 text-xs font-semibold transition-colors border border-red-500/15 hover:border-red-500/30"
        >
          <span>🏪</span> Search on H-E-B <ExternalLink size={10} />
        </a>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────
export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = ['all', ...INVENTORY_CATEGORIES]

  const filtered = useMemo(() => {
    let items = GROCERY_INVENTORY
    if (activeCategory !== 'all') {
      items = items.filter(i => i.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        (i.brand?.toLowerCase().includes(q) ?? false) ||
        i.tags.some(t => t.includes(q))
      )
    }
    return items
  }, [search, activeCategory])

  const inStockCount = GROCERY_INVENTORY.filter(i => i.inStock).length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center">
            <Package size={17} className="text-brand-400" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white">Grocery Inventory</h1>
        </div>
        <p className="text-zinc-500 text-sm ml-12">
          {GROCERY_INVENTORY.length} items across {INVENTORY_CATEGORIES.length} categories · {inStockCount} in stock
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Items',   value: GROCERY_INVENTORY.length, emoji: '📦' },
          { label: 'In Stock',      value: inStockCount,             emoji: '✅' },
          { label: 'Categories',    value: INVENTORY_CATEGORIES.length, emoji: '🗂️' },
          { label: 'With H-E-B Link', value: GROCERY_INVENTORY.filter(i => i.hebSearchUrl).length, emoji: '🏪' },
        ].map(stat => (
          <div key={stat.label} className="p-3.5 rounded-2xl bg-surface-800 border border-white/8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{stat.emoji}</span>
              <span className="text-xl font-display font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-xs text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* HEB info banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-orange-500/8 border border-orange-500/20 mb-6">
        <Zap size={16} className="text-orange-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-white mb-0.5">H-E-B Link Integration Active</p>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every item below has a direct heb.com search link. When you use{' '}
            <span className="text-orange-400 font-medium">Generate Cart → H-E-B</span>, items are
            matched against this catalog so you can shop each one on heb.com or the H-E-B app.
            No account or API key required.
          </p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search items, brands, tags…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-9 bg-surface-800 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map(cat => {
          const cfg = CATEGORY_DISPLAY[cat]
          const count = cat === 'all'
            ? GROCERY_INVENTORY.length
            : GROCERY_INVENTORY.filter(i => i.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150',
                activeCategory === cat
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/35'
                  : 'bg-surface-800 text-zinc-400 border border-white/8 hover:border-white/18 hover:text-white',
              )}
            >
              {cfg ? <span>{cfg.emoji}</span> : <span>📦</span>}
              <span className="capitalize">{cfg?.label ?? cat}</span>
              <span className={cn(
                'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                activeCategory === cat ? 'bg-brand-500/30 text-brand-300' : 'bg-white/8 text-zinc-500',
              )}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Results count */}
      <p className="text-xs text-zinc-600 mb-4">
        {filtered.length === GROCERY_INVENTORY.length
          ? `All ${filtered.length} items`
          : `${filtered.length} of ${GROCERY_INVENTORY.length} items`}
        {search && <span className="ml-1 text-brand-400">· "{search}"</span>}
      </p>

      {/* Items grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-800 border border-white/8 flex items-center justify-center mb-4">
            <Package size={24} className="text-zinc-600" />
          </div>
          <p className="text-zinc-400 font-medium mb-1">No items found</p>
          <p className="text-zinc-600 text-sm">Try a different search term or category</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory('all') }}
            className="mt-4 text-xs text-brand-400 hover:text-brand-300 transition-colors"
          >
            Clear filters →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
