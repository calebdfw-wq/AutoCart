'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { GROCERY_INVENTORY } from '@/lib/inventory'
import { ItemCategory } from '@/lib/types'
import { cn } from '@/lib/utils'

const CATEGORY_EMOJI: Record<string, string> = {
  protein: '🥩', dairy: '🥛', grains: '🌾', produce: '🥦',
  pantry: '🏺', frozen: '❄️', supplements: '💊', snacks: '🍫',
  beverages: '🧃', condiments: '🫙',
}

interface Props {
  value: string
  onChange: (value: string) => void
  onSelect: (name: string, price: number, unit: string, category: ItemCategory) => void
  placeholder?: string
  containerClassName?: string
}

export default function InventoryCombobox({ value, onChange, onSelect, placeholder = 'Search inventory or type custom…', containerClassName }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const results = value.trim().length >= 1
    ? GROCERY_INVENTORY.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        (item.brand?.toLowerCase().includes(value.toLowerCase()) ?? false) ||
        item.tags.some(t => t.includes(value.toLowerCase()))
      ).slice(0, 8)
    : []

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (item: typeof GROCERY_INVENTORY[0]) => {
    onChange(item.name)
    onSelect(item.name, item.price, item.unit, item.category as ItemCategory)
    setOpen(false)
  }

  return (
    <div ref={ref} className={cn('relative', containerClassName)}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
          <Search size={14} />
        </span>
        <input
          type="text"
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full h-10 pl-9 pr-8 bg-surface-700 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 transition-colors"
        />
        {value && (
          <button
            type="button"
            onClick={() => { onChange(''); setOpen(false) }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-surface-800 border border-white/12 rounded-xl shadow-2xl overflow-hidden">
          {results.map(item => (
            <button
              key={item.id}
              type="button"
              onMouseDown={() => handleSelect(item)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
            >
              <span className="text-lg shrink-0">{CATEGORY_EMOJI[item.category] ?? '📦'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{item.name}</p>
                {item.brand && <p className="text-[11px] text-zinc-500">{item.brand}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-brand-400">${item.price.toFixed(2)}</p>
                <p className="text-[10px] text-zinc-600">{item.unit}</p>
              </div>
            </button>
          ))}
          <div className="px-3 py-2 border-t border-white/8">
            <p className="text-[10px] text-zinc-600">Select to auto-fill price, unit & category — or keep typing for custom item</p>
          </div>
        </div>
      )}
    </div>
  )
}
