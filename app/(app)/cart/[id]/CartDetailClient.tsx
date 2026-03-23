'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Heart, Bookmark, Share2, Copy, Zap, ArrowLeft, Users, DollarSign,
  Calendar, Eye, ChevronDown, ChevronUp, Tag, Info, Edit,
  Flame, Beef, Wheat, Droplets, Clock, ChefHat, CheckCircle2,
} from 'lucide-react'
import { getCartById } from '@/lib/seed-data'
import { useAuth } from '@/contexts/AuthContext'
import GenerateModal from '@/components/autocart/GenerateModal'
import DietaryBadges from '@/components/autocart/DietaryBadges'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { NutritionInfo, Meal } from '@/lib/types'
import {
  formatCurrency, formatNumber, formatDate, CATEGORY_CONFIG,
  PREP_GOAL_CONFIG, cn
} from '@/lib/utils'
import toast from 'react-hot-toast'

interface Props { params: { id: string } }

// ─── MacroBar ─────────────────────────────────────────────────
function MacroBar({ macros }: { macros: NutritionInfo }) {
  const { calories = 0, protein = 0, carbs = 0, fat = 0 } = macros
  const total = protein + carbs + fat || 1
  const pPct = Math.round((protein / total) * 100)
  const cPct = Math.round((carbs / total) * 100)
  const fPct = Math.round((fat / total) * 100)

  return (
    <div className="p-5 rounded-2xl bg-surface-800 border border-white/8">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/25">
          <Flame size={13} className="text-brand-400" />
          <span className="text-sm font-bold text-brand-400">{calories} cal</span>
        </div>
        <span className="text-xs text-zinc-500">per serving</span>
      </div>
      <div className="flex h-2.5 rounded-full overflow-hidden gap-px mb-3">
        <div className="bg-blue-500 rounded-full" style={{ width: `${pPct}%` }} />
        <div className="bg-yellow-500 rounded-full" style={{ width: `${cPct}%` }} />
        <div className="bg-orange-500 rounded-full" style={{ width: `${fPct}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/15">
          <Beef size={13} className="text-blue-400 mb-1" />
          <span className="text-sm font-bold text-blue-300">{protein}g</span>
          <span className="text-[10px] text-blue-400/70 mt-0.5">Protein</span>
        </div>
        <div className="flex flex-col items-center p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/15">
          <Wheat size={13} className="text-yellow-400 mb-1" />
          <span className="text-sm font-bold text-yellow-300">{carbs}g</span>
          <span className="text-[10px] text-yellow-400/70 mt-0.5">Carbs</span>
        </div>
        <div className="flex flex-col items-center p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/15">
          <Droplets size={13} className="text-orange-400 mb-1" />
          <span className="text-sm font-bold text-orange-300">{fat}g</span>
          <span className="text-[10px] text-orange-400/70 mt-0.5">Fat</span>
        </div>
      </div>
    </div>
  )
}

// ─── MealCard ─────────────────────────────────────────────────
function MealCard({ meal, index }: { meal: Meal; index: number }) {
  const [open, setOpen] = useState(index === 0)
  const { calories = 0, protein = 0, carbs = 0, fat = 0 } = meal.macros

  return (
    <div className={cn(
      'rounded-2xl border transition-all duration-200 overflow-hidden',
      open ? 'bg-surface-700/60 border-white/12' : 'bg-surface-800 border-white/8 hover:border-white/12',
    )}>
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <div className="w-10 h-10 rounded-xl bg-surface-700 border border-white/10 flex items-center justify-center text-xl shrink-0">
          {meal.emoji ?? '🍽️'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{meal.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {meal.prepTimeMinutes && (
              <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                <Clock size={9} /> {meal.prepTimeMinutes} min
              </span>
            )}
            <span className="text-[10px] text-zinc-600">
              {calories} cal · {protein}g P · {carbs}g C · {fat}g F
            </span>
          </div>
        </div>
        <div className={cn('shrink-0 transition-transform duration-200', open && 'rotate-180')}>
          <ChevronDown size={16} className="text-zinc-500" />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/8 pt-4">
          <p className="text-sm text-zinc-400 leading-relaxed">{meal.description}</p>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center p-2 rounded-xl bg-surface-700/80 border border-white/6">
              <Flame size={11} className="text-brand-400 mb-1" />
              <span className="text-xs font-bold text-white">{calories}</span>
              <span className="text-[9px] text-zinc-500 mt-0.5">cal</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-blue-500/10 border border-blue-500/15">
              <Beef size={11} className="text-blue-400 mb-1" />
              <span className="text-xs font-bold text-blue-300">{protein}g</span>
              <span className="text-[9px] text-blue-400/70 mt-0.5">prot</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/15">
              <Wheat size={11} className="text-yellow-400 mb-1" />
              <span className="text-xs font-bold text-yellow-300">{carbs}g</span>
              <span className="text-[9px] text-yellow-400/70 mt-0.5">carbs</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-orange-500/10 border border-orange-500/15">
              <Droplets size={11} className="text-orange-400 mb-1" />
              <span className="text-xs font-bold text-orange-300">{fat}g</span>
              <span className="text-[9px] text-orange-400/70 mt-0.5">fat</span>
            </div>
          </div>
          {meal.cartItems.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">Ingredients Used</p>
              <div className="flex flex-wrap gap-1.5">
                {meal.cartItems.map(item => (
                  <span key={item} className="px-2 py-0.5 rounded-full bg-brand-500/8 border border-brand-500/15 text-[11px] text-brand-400/90 font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {meal.instructions.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2 flex items-center gap-1.5">
                <ChefHat size={10} /> Directions
              </p>
              <ol className="space-y-2">
                {meal.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-zinc-400 leading-relaxed">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-brand-500/15 border border-brand-500/25 text-[10px] font-bold text-brand-400 flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function CartDetailClient({ params }: Props) {
  const { id } = params
  const cart = getCartById(id)
  const { user } = useAuth()

  const [isSaved, setIsSaved] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(cart?.likesCount ?? 0)
  const [showGenerate, setShowGenerate] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    items: true, notes: true, substitutions: false, meals: true,
  })

  if (!cart) {
    return (
      <div className="p-8 text-center">
        <p className="text-4xl mb-4">🛒</p>
        <h2 className="font-display font-bold text-xl text-white mb-2">Cart not found</h2>
        <p className="text-zinc-500 mb-4">This cart doesn&apos;t exist or has been removed.</p>
        <Link href="/browse"><Button size="sm">Browse Carts</Button></Link>
      </div>
    )
  }

  const isOwner = user?.id === cart.creatorId
  const categoryConfig = CATEGORY_CONFIG[cart.category]
  const prepGoalConfig = PREP_GOAL_CONFIG[cart.prepGoal]
  const toggleSection = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))

  const handleLike = () => {
    setIsLiked(prev => !prev)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
    toast.success(isLiked ? 'Removed like' : 'Cart liked! ❤️')
  }
  const handleSave = () => {
    setIsSaved(prev => !prev)
    toast.success(isSaved ? 'Removed from saved' : 'Cart saved! 🔖')
  }
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }
  const handleDuplicate = () => {
    toast.success('Cart duplicated to your drafts!')
  }

  const itemsByCategory = cart.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof cart.items>)

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <Link href="/browse" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-6 group">
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Browse
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="aspect-[16/7] rounded-2xl overflow-hidden bg-surface-700 border border-white/8">
            {cart.coverImage ? (
              <img src={cart.coverImage} alt={cart.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-surface-700 to-surface-600">
                {categoryConfig.emoji}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-start gap-3 flex-wrap mb-2">
              <Badge className={categoryConfig.color}>{categoryConfig.emoji} {categoryConfig.label}</Badge>
              <Badge variant="default">{prepGoalConfig.label}</Badge>
              {cart.visibility !== 'public' && <Badge variant="orange">{cart.visibility}</Badge>}
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white leading-tight mb-3">{cart.title}</h1>
            {cart.creator && (
              <Link href={`/profile/${cart.creator.username}`} className="flex items-center gap-2.5 mb-4 w-fit group">
                <img
                  src={cart.creator.avatarUrl ?? `https://api.dicebear.com/7.x/initials/svg?seed=${cart.creator.username}`}
                  alt={cart.creator.displayName}
                  className="w-8 h-8 rounded-full ring-2 ring-white/10 object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-brand-400 transition-colors">{cart.creator.displayName}</p>
                  <p className="text-xs text-zinc-500">@{cart.creator.username}</p>
                </div>
              </Link>
            )}
            <p className="text-zinc-400 text-sm leading-relaxed">{cart.description}</p>
          </div>

          <DietaryBadges labels={cart.dietaryLabels} size="md" />

          {cart.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {cart.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-[11px] text-zinc-500 bg-surface-700 px-2 py-1 rounded-md border border-white/8">
                  <Tag size={10} />{tag}
                </span>
              ))}
            </div>
          )}

          {cart.macrosPerServing && <MacroBar macros={cart.macrosPerServing} />}

          {cart.meals && cart.meals.length > 0 && (
            <div className="bg-surface-800 rounded-2xl border border-white/8 overflow-hidden">
              <button onClick={() => toggleSection('meals')} className="w-full flex items-center justify-between p-5 hover:bg-white/3 transition-colors">
                <h2 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <ChefHat size={16} className="text-brand-400" />
                  Meal Plan &amp; Directions
                  <span className="ml-1 text-sm font-normal text-zinc-500">({cart.meals.length} meals)</span>
                </h2>
                {expandedSections.meals ? <ChevronUp size={18} className="text-zinc-500" /> : <ChevronDown size={18} className="text-zinc-500" />}
              </button>
              {expandedSections.meals && (
                <div className="border-t border-white/8 p-4 space-y-3">
                  {cart.meals.map((meal, i) => <MealCard key={meal.id} meal={meal} index={i} />)}
                </div>
              )}
            </div>
          )}

          <div className="bg-surface-800 rounded-2xl border border-white/8 overflow-hidden">
            <button onClick={() => toggleSection('items')} className="w-full flex items-center justify-between p-5 hover:bg-white/3 transition-colors">
              <h2 className="font-display font-bold text-base text-white">
                Grocery Items<span className="ml-2 text-sm font-normal text-zinc-500">({cart.items.length})</span>
              </h2>
              {expandedSections.items ? <ChevronUp size={18} className="text-zinc-500" /> : <ChevronDown size={18} className="text-zinc-500" />}
            </button>
            {expandedSections.items && (
              <div className="border-t border-white/8">
                {Object.entries(itemsByCategory).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-5 py-2 bg-surface-900/50 border-b border-white/6">
                      <p className="text-[11px] uppercase tracking-widest text-zinc-600 font-semibold">{category}</p>
                    </div>
                    {items.map((item, i) => (
                      <div key={item.id} className={cn('flex items-start gap-4 px-5 py-3.5 hover:bg-white/2 transition-colors', i < items.length - 1 && 'border-b border-white/[0.04]')}>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{item.name}</p>
                          {item.preferredBrand && <p className="text-xs text-zinc-500 mt-0.5">Preferred: {item.preferredBrand}</p>}
                          {item.acceptableSubstitutions && item.acceptableSubstitutions.length > 0 && (
                            <p className="text-xs text-zinc-600 mt-0.5">Sub: {item.acceptableSubstitutions.join(', ')}</p>
                          )}
                          {item.notes && <p className="text-xs text-zinc-600 mt-0.5 italic">{item.notes}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-medium text-white">{item.quantity} {item.unit}</p>
                          <p className="text-xs text-brand-400 font-semibold mt-0.5">{formatCurrency(item.estimatedPrice * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="flex items-center justify-between px-5 py-4 bg-surface-900/50 border-t border-white/8">
                  <p className="text-sm font-semibold text-zinc-300">Estimated Total</p>
                  <p className="font-display font-extrabold text-xl text-brand-400">{formatCurrency(cart.estimatedTotalCost)}</p>
                </div>
              </div>
            )}
          </div>

          {cart.notes && (
            <div className="bg-surface-800 rounded-2xl border border-white/8 overflow-hidden">
              <button onClick={() => toggleSection('notes')} className="w-full flex items-center justify-between p-5 hover:bg-white/3 transition-colors">
                <h2 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <Info size={16} className="text-brand-400" />Prep Notes
                </h2>
                {expandedSections.notes ? <ChevronUp size={18} className="text-zinc-500" /> : <ChevronDown size={18} className="text-zinc-500" />}
              </button>
              {expandedSections.notes && (
                <div className="px-5 pb-5 border-t border-white/8">
                  <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap pt-4">{cart.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-500/10 via-surface-800 to-surface-800 border border-brand-500/20 shadow-glow-sm">
            <p className="font-display font-bold text-lg text-white mb-1">Ready to shop?</p>
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">Generate a complete grocery list from this cart with one click</p>
            <Button fullWidth size="lg" icon={<Zap size={18} />} onClick={() => setShowGenerate(true)} className="shadow-glow-md">
              Generate Grocery Cart
            </Button>
          </div>

          <div className="p-4 rounded-2xl bg-surface-800 border border-white/8">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: DollarSign, label: 'Total Cost', value: formatCurrency(cart.estimatedTotalCost) },
                { icon: DollarSign, label: 'Per Meal', value: formatCurrency(cart.estimatedCostPerMeal ?? cart.estimatedTotalCost / cart.servings) },
                { icon: Users, label: 'Servings', value: String(cart.servings) },
                { icon: Calendar, label: 'Prep Days', value: cart.prepDays ? `${cart.prepDays} days` : 'Flexible' },
              ].map(stat => (
                <div key={stat.label} className="bg-surface-700/50 rounded-xl p-3">
                  <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-sm font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {cart.macrosPerServing && (() => {
            const { calories = 0, protein = 0, carbs = 0, fat = 0 } = cart.macrosPerServing
            const macroRows = [
              { label: 'Protein', value: protein, unit: 'g', color: 'bg-blue-500', textColor: 'text-blue-400', max: 80 },
              { label: 'Carbs', value: carbs, unit: 'g', color: 'bg-yellow-500', textColor: 'text-yellow-400', max: 120 },
              { label: 'Fat', value: fat, unit: 'g', color: 'bg-orange-500', textColor: 'text-orange-400', max: 60 },
            ]
            return (
              <div className="p-4 rounded-2xl bg-surface-800 border border-white/8">
                <div className="flex items-center gap-2 mb-3">
                  <Flame size={13} className="text-brand-400" />
                  <p className="text-xs font-semibold text-white">{calories} cal <span className="text-zinc-500 font-normal">/ serving</span></p>
                </div>
                <div className="space-y-2">
                  {macroRows.map(m => (
                    <div key={m.label}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className={cn('font-medium', m.textColor)}>{m.label}</span>
                        <span className="text-zinc-500">{m.value}{m.unit}</span>
                      </div>
                      <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', m.color)} style={{ width: `${Math.min((m.value / m.max) * 100, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {cart.meals && cart.meals.length > 0 && (
            <div className="p-4 rounded-2xl bg-surface-800 border border-white/8">
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-3">Meal Breakdown</p>
              <div className="space-y-2">
                {cart.meals.map(meal => (
                  <div key={meal.id} className="flex items-center gap-2.5 py-1.5">
                    <span className="text-base shrink-0">{meal.emoji ?? '🍽️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{meal.name}</p>
                      {meal.prepTimeMinutes && (
                        <p className="text-[10px] text-zinc-600 flex items-center gap-1 mt-0.5"><Clock size={8} /> {meal.prepTimeMinutes} min</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-brand-400">{meal.macros.calories ?? 0}</p>
                      <p className="text-[9px] text-zinc-600">cal</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={handleLike} className={cn('flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all', isLiked ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-surface-800 border-white/10 text-zinc-400 hover:text-red-400 hover:border-red-500/30')}>
              <Heart size={15} className={isLiked ? 'fill-current' : ''} />{formatNumber(likesCount)}
            </button>
            <button onClick={handleSave} className={cn('flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all', isSaved ? 'bg-brand-500/10 border-brand-500/30 text-brand-400' : 'bg-surface-800 border-white/10 text-zinc-400 hover:text-brand-400 hover:border-brand-500/30')}>
              <Bookmark size={15} className={isSaved ? 'fill-current' : ''} />{formatNumber(cart.savesCount + (isSaved ? 1 : 0))}
            </button>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" size="md" fullWidth icon={<Share2 size={15} />} onClick={handleShare}>Share</Button>
            <Button variant="secondary" size="md" fullWidth icon={<Copy size={15} />} onClick={handleDuplicate}>Duplicate</Button>
          </div>

          <div className="p-4 rounded-2xl bg-surface-800 border border-white/8 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-zinc-600">
              <Eye size={12} />{formatNumber(cart.viewsCount)} views · Updated {formatDate(cart.updatedAt)}
            </div>
          </div>

          {isOwner && (
            <Link href={`/create?edit=${cart.id}`}>
              <Button variant="outline" size="md" fullWidth icon={<Edit size={15} />}>Edit Cart</Button>
            </Link>
          )}
        </div>
      </div>

      {showGenerate && <GenerateModal cart={cart} onClose={() => setShowGenerate(false)} />}
    </div>
  )
}
