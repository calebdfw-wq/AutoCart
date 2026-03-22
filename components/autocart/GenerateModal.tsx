'use client'

import { useState, useEffect } from 'react'
import {
  X, ShoppingCart, CheckCircle, AlertCircle, ExternalLink,
  Loader2, MapPin, Info,
} from 'lucide-react'
import { AutoCart, DietaryLabel, RetailerId, RetailerProduct } from '@/lib/types'
import { generateGroceryCart } from '@/lib/groceryProviders'
import { PROVIDER_REGISTRY } from '@/lib/groceryProviders/types'
import { DIETARY_CONFIG, RETAILER_CONFIG, formatCurrency, cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Toggle from '@/components/ui/Toggle'

interface GenerateModalProps {
  cart: AutoCart
  onClose: () => void
}

type Step = 'configure' | 'generating' | 'result'

export default function GenerateModal({ cart, onClose }: GenerateModalProps) {
  const [step, setStep] = useState<Step>('configure')
  const [selectedRetailer, setSelectedRetailer] = useState<RetailerId>('mock')
  const [activeDietary, setActiveDietary] = useState<DietaryLabel[]>(cart.dietaryLabels)
  const [brandPrefs] = useState<Record<string, string>>({})
  const [result, setResult] = useState<Awaited<ReturnType<typeof generateGroceryCart>> | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleGenerate = async () => {
    setStep('generating')
    setError(null)
    try {
      const res = await generateGroceryCart({
        retailerId: selectedRetailer,
        items: cart.items,
        activeSubstitutions: activeDietary,
        brandPreferences: brandPrefs,
      })
      setResult(res)
      setStep('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('configure')
    }
  }

  const toggleDietary = (label: DietaryLabel) => {
    setActiveDietary(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    )
  }

  const isHEB = selectedRetailer === 'heb'
  const availableRetailers = Object.values(PROVIDER_REGISTRY).filter(p => p.available || p.comingSoon)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface-800 rounded-2xl border border-white/10 shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-white/[0.07]">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center">
            <ShoppingCart size={18} className="text-brand-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-white text-base">Generate Grocery Cart</h2>
            <p className="text-xs text-zinc-500">{cart.title}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/8 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {/* ── Configure step ── */}
          {step === 'configure' && (
            <div className="space-y-5">
              {/* Retailer selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Select Store</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableRetailers.map(retailer => (
                    <button
                      key={retailer.id}
                      onClick={() => !retailer.comingSoon && setSelectedRetailer(retailer.id as RetailerId)}
                      className={cn(
                        'flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-150',
                        !retailer.comingSoon && selectedRetailer === retailer.id
                          ? 'bg-brand-500/15 border-brand-500/40 text-white'
                          : 'bg-surface-700/50 border-white/8 text-zinc-400',
                        retailer.comingSoon
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:border-white/20 hover:text-white cursor-pointer',
                      )}
                    >
                      <span className="text-base">{RETAILER_CONFIG[retailer.id as RetailerId]?.logo ?? '🛒'}</span>
                      <div>
                        <p className="text-xs font-semibold leading-tight">{retailer.name}</p>
                        {retailer.comingSoon && (
                          <p className="text-[10px] text-zinc-600 mt-0.5">Coming Soon</p>
                        )}
                        {retailer.id === 'heb' && !retailer.comingSoon && (
                          <p className="text-[10px] text-red-400/80 mt-0.5">TX · Link-Based</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* HEB info callout */}
                {isHEB && (
                  <div className="mt-3 flex items-start gap-2.5 p-3 rounded-xl bg-orange-500/8 border border-orange-500/20">
                    <MapPin size={14} className="text-orange-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      H-E-B doesn&apos;t have a public cart API. We&apos;ll match your items against our
                      catalog and give you a{' '}
                      <span className="text-orange-400 font-medium">search link for each item</span>{' '}
                      so you can add them on heb.com or the H-E-B app.
                    </p>
                  </div>
                )}
              </div>

              {/* Dietary preferences */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Dietary Preferences
                  <span className="ml-2 text-xs text-zinc-500 font-normal">Toggle substitutions</span>
                </label>
                <div className="space-y-2">
                  {(['gluten-free', 'dairy-free', 'vegan', 'high-protein', 'low-carb', 'organic'] as DietaryLabel[]).map(label => {
                    const config = DIETARY_CONFIG[label]
                    return (
                      <Toggle
                        key={label}
                        checked={activeDietary.includes(label)}
                        onChange={() => toggleDietary(label)}
                        label={`${config.emoji} ${config.label}`}
                        description={
                          label === 'dairy-free'   ? 'Swap dairy products with plant-based alternatives' :
                          label === 'gluten-free'  ? 'Replace gluten-containing items with GF options' :
                          label === 'vegan'        ? 'Replace all animal products with plant-based options' :
                          label === 'high-protein' ? 'Prioritize high-protein variants of each item' :
                          label === 'low-carb'     ? 'Prefer lower-carb alternatives where available' :
                          'Swap to organic versions of produce and staples'
                        }
                      />
                    )
                  })}
                </div>
              </div>

              {/* Cart summary */}
              <div className="p-3 rounded-xl bg-surface-700/50 border border-white/8">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-400">Cart Items</span>
                  <span className="text-white font-medium">{cart.items.length} items</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-400">Estimated Total</span>
                  <span className="text-brand-400 font-bold">{formatCurrency(cart.estimatedTotalCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Servings</span>
                  <span className="text-white font-medium">{cart.servings} meals</span>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* ── Generating step ── */}
          {step === 'generating' && (
            <div className="py-8 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center animate-pulse-glow">
                <Loader2 size={28} className="text-brand-400 animate-spin" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-base">Building Your Cart</p>
                <p className="text-sm text-zinc-500 mt-1">Matching items and applying substitutions…</p>
              </div>
              <div className="w-full space-y-2 mt-2">
                {[
                  isHEB ? 'Searching H-E-B inventory catalog…' : 'Fetching item catalog…',
                  'Matching grocery items…',
                  'Applying dietary rules…',
                  isHEB ? 'Building heb.com search links…' : 'Calculating totals…',
                ].map((s, i) => (
                  <div key={s} className="flex items-center gap-2 text-xs text-zinc-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Result step ── */}
          {step === 'result' && result && (
            <div className="space-y-4">
              {/* Success header */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
                <CheckCircle size={20} className="text-brand-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {isHEB ? 'H-E-B Links Ready!' : 'Cart Ready!'}
                  </p>
                  <p className="text-xs text-zinc-400">{result.mappedItems.length} of {cart.items.length} items matched</p>
                </div>
                <span className="ml-auto text-lg font-bold text-brand-400">{formatCurrency(result.estimatedTotal)}</span>
              </div>

              {/* HEB info strip */}
              {isHEB && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-orange-500/8 border border-orange-500/20">
                  <Info size={13} className="text-orange-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Click <span className="text-orange-400 font-medium">Shop</span> next to each item
                    to search on heb.com. Add them to your H-E-B cart manually or use curbside pickup.
                  </p>
                </div>
              )}

              {/* Substitutions applied */}
              {result.substitutionsApplied.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-zinc-400 mb-2">Substitutions Applied</p>
                  {result.substitutionsApplied.map((sub, i) => (
                    <div key={i} className="text-xs text-zinc-500 py-1 border-b border-white/5 last:border-0">
                      ✓ {sub}
                    </div>
                  ))}
                </div>
              )}

              {/* Items preview */}
              <div>
                <p className="text-xs font-semibold text-zinc-400 mb-2">Matched Items</p>
                <div className="space-y-1.5 max-h-52 overflow-y-auto">
                  {result.mappedItems.slice(0, 10).map((item, i) => {
                    // Access productUrl via retailerProduct (which is RetailerProduct at runtime)
                    const product = item.retailerProduct as unknown as RetailerProduct
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-surface-700/40"
                      >
                        <span className="text-zinc-300 truncate flex-1">{item.originalItem.name}</span>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="text-zinc-500">{formatCurrency(item.lineTotal)}</span>
                          {isHEB && product?.productUrl && (
                            <a
                              href={product.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-orange-500/15 text-orange-400 hover:bg-orange-500/25 transition-colors text-[10px] font-semibold"
                            >
                              Shop <ExternalLink size={9} />
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {result.mappedItems.length > 10 && (
                    <p className="text-[11px] text-zinc-600 text-center py-1">
                      +{result.mappedItems.length - 10} more items
                    </p>
                  )}
                </div>
              </div>

              {/* Unavailable items */}
              {result.unmappedItems.length > 0 && (
                <div className="p-3 rounded-xl bg-yellow-500/8 border border-yellow-500/20">
                  <p className="text-xs font-semibold text-yellow-400 mb-1">
                    {result.unmappedItems.length} item{result.unmappedItems.length > 1 ? 's' : ''} not matched
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {result.unmappedItems.map(i => i.name).join(', ')}
                  </p>
                  {isHEB && (
                    <a
                      href={`https://www.heb.com/search/?q=${encodeURIComponent(result.unmappedItems[0]?.name ?? 'grocery')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-orange-400 hover:underline"
                    >
                      Search these on H-E-B <ExternalLink size={9} />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.07] flex gap-3">
          {step === 'configure' && (
            <>
              <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button size="md" onClick={handleGenerate} className="flex-1" icon={<ShoppingCart size={15} />}>
                {isHEB ? 'Get H-E-B Links' : 'Generate Cart'}
              </Button>
            </>
          )}
          {step === 'result' && result && (
            <>
              <Button variant="secondary" size="md" onClick={() => setStep('configure')} className="flex-1">
                Reconfigure
              </Button>
              {isHEB ? (
                <Button
                  size="md"
                  className="flex-1"
                  icon={<ExternalLink size={15} />}
                  onClick={() => window.open('https://www.heb.com/shop-online/grocery', '_blank')}
                >
                  Open H-E-B
                </Button>
              ) : result.retailerCartUrl ? (
                <Button
                  size="md"
                  className="flex-1"
                  icon={<ExternalLink size={15} />}
                  onClick={() => window.open(result.retailerCartUrl, '_blank')}
                >
                  Open in Store
                </Button>
              ) : (
                <Button size="md" onClick={onClose} className="flex-1">
                  Done ✓
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
