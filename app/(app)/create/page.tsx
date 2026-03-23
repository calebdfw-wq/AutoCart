'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, ArrowRight, CheckCircle, Upload, Plus, Trash2,
  Globe, Lock, Eye, Zap, ShoppingBag, Tag, ChevronDown, UtensilsCrossed, X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import Input, { Textarea, Select } from '@/components/ui/Input'
import Toggle from '@/components/ui/Toggle'
import InventoryCombobox from '@/components/ui/InventoryCombobox'
import {
  CartCategory, CartVisibility, DietaryLabel, PrepGoal, CreateCartFormData, ItemCategory
} from '@/lib/types'
import {
  CATEGORY_CONFIG, DIETARY_CONFIG, PREP_GOAL_CONFIG, formatCurrency, cn
} from '@/lib/utils'
import toast from 'react-hot-toast'

// ─── Step indicator ───────────────────────────────────────────
const STEPS = [
  { id: 1, title: 'Basic Info', description: 'Name, description, category' },
  { id: 2, title: 'Grocery Items', description: 'Add your items' },
  { id: 3, title: 'Meal Plan', description: 'Meals and instructions' },
  { id: 4, title: 'Dietary Rules', description: 'Labels and substitutions' },
  { id: 5, title: 'Review', description: 'Review and publish' },
]

const MEAL_LABELS = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-Workout', 'Post-Workout', 'Meal Prep Bowl', 'Custom']
const MEAL_EMOJIS = ['🍳', '🥗', '🍗', '🥩', '🍚', '🥣', '🥙', '🌮', '🍜', '🥘', '🍱', '🫕']

interface CreateMeal {
  id: string
  label: string
  emoji: string
  description: string
  ingredients: string[]
  instructions: string[]
}

const CATEGORY_OPTIONS: CartCategory[] = ['meal-prep', 'bulking', 'cutting', 'family', 'budget', 'athlete', 'vegan', 'keto', 'quick-prep', 'college', 'gourmet']
const ITEM_CATEGORIES: ItemCategory[] = ['protein', 'produce', 'grains', 'dairy', 'pantry', 'frozen', 'beverages', 'snacks', 'condiments', 'supplements', 'bakery', 'deli']
const DIETARY_OPTIONS: DietaryLabel[] = ['gluten-free', 'dairy-free', 'nut-free', 'vegan', 'vegetarian', 'keto', 'paleo', 'high-protein', 'low-carb', 'low-calorie', 'organic']

const INITIAL_FORM: CreateCartFormData = {
  title: '',
  description: '',
  coverImage: '',
  category: 'meal-prep',
  visibility: 'public',
  prepGoal: 'general',
  servings: 7,
  items: [],
  dietaryLabels: [],
  substitutionRules: [],
  tags: [],
  notes: '',
}

const BLANK_ITEM = {
  name: '',
  quantity: 1,
  unit: 'lbs',
  category: 'protein' as ItemCategory,
  estimatedPrice: 0,
  preferredBrand: '',
  notes: '',
}

export default function CreatePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<CreateCartFormData>(INITIAL_FORM)
  const [tagInput, setTagInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [meals, setMeals] = useState<CreateMeal[]>([])
  const [itemSearchValues, setItemSearchValues] = useState<string[]>([])

  const setField = <K extends keyof CreateCartFormData>(key: K, value: CreateCartFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const addItem = () => {
    setField('items', [...form.items, { ...BLANK_ITEM }])
    setItemSearchValues(prev => [...prev, ''])
  }

  const updateItem = (i: number, key: string, value: string | number) => {
    const updated = form.items.map((item, idx) => idx === i ? { ...item, [key]: value } : item)
    setField('items', updated)
  }

  const removeItem = (i: number) => {
    setField('items', form.items.filter((_, idx) => idx !== i))
    setItemSearchValues(prev => prev.filter((_, idx) => idx !== i))
  }

  const addMeal = () => {
    setMeals(prev => [...prev, {
      id: crypto.randomUUID(),
      label: 'Meal Prep Bowl',
      emoji: '🥘',
      description: '',
      ingredients: [],
      instructions: [''],
    }])
  }

  const updateMeal = (id: string, key: keyof CreateMeal, value: any) => {
    setMeals(prev => prev.map(m => m.id === id ? { ...m, [key]: value } : m))
  }

  const removeMeal = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id))
  }

  const toggleMealIngredient = (id: string, ingredient: string) => {
    setMeals(prev => prev.map(m => {
      if (m.id !== id) return m
      return {
        ...m,
        ingredients: m.ingredients.includes(ingredient)
          ? m.ingredients.filter(i => i !== ingredient)
          : [...m.ingredients, ingredient],
      }
    }))
  }

  const addInstruction = (id: string) => {
    setMeals(prev => prev.map(m => m.id === id ? { ...m, instructions: [...m.instructions, ''] } : m))
  }

  const updateInstruction = (id: string, idx: number, val: string) => {
    setMeals(prev => prev.map(m => {
      if (m.id !== id) return m
      const instructions = m.instructions.map((s, i) => i === idx ? val : s)
      return { ...m, instructions }
    }))
  }

  const removeInstruction = (id: string, idx: number) => {
    setMeals(prev => prev.map(m => {
      if (m.id !== id) return m
      return { ...m, instructions: m.instructions.filter((_, i) => i !== idx) }
    }))
  }

  const toggleDietary = (label: DietaryLabel) => {
    setField('dietaryLabels', form.dietaryLabels.includes(label)
      ? form.dietaryLabels.filter(l => l !== label)
      : [...form.dietaryLabels, label]
    )
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (tag && !form.tags.includes(tag)) {
      setField('tags', [...form.tags, tag])
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => setField('tags', form.tags.filter(t => t !== tag))

  const estimatedTotal = form.items.reduce((sum, item) => sum + (item.estimatedPrice * item.quantity), 0)

  const canProceed = () => {
    if (step === 1) return form.title.trim().length >= 3 && form.description.trim().length >= 10
    if (step === 2) return form.items.length >= 1 && form.items.every(i => i.name.trim())
    return true
  }

  const itemNames = form.items.map(i => i.name).filter(Boolean)

  const handlePublish = async () => {
    setSubmitting(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200))
    toast.success('AutoCart published! 🎉')
    router.push('/dashboard')
  }

  const visibilityOptions: { value: CartVisibility; label: string; icon: typeof Globe; desc: string }[] = [
    { value: 'public', label: 'Public', icon: Globe, desc: 'Anyone can discover and use this cart' },
    { value: 'unlisted', label: 'Unlisted', icon: Eye, desc: 'Only accessible via direct link' },
    { value: 'private', label: 'Private', icon: Lock, desc: 'Only visible to you' },
  ]

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl text-white mb-1">Create AutoCart</h1>
        <p className="text-zinc-500 text-sm">Build and share your grocery cart with the community</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center shrink-0">
            <button
              onClick={() => s.id < step && setStep(s.id)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                step === s.id
                  ? 'bg-brand-500/15 border border-brand-500/25 text-brand-400'
                  : s.id < step
                  ? 'text-zinc-400 hover:text-white cursor-pointer'
                  : 'text-zinc-600 cursor-not-allowed',
              )}
            >
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                step === s.id ? 'bg-brand-500 text-white' :
                s.id < step ? 'bg-brand-500/20 text-brand-400' :
                'bg-surface-600 text-zinc-600'
              )}>
                {s.id < step ? <CheckCircle size={14} /> : s.id}
              </div>
              <span className="hidden sm:block">{s.title}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={cn('w-8 h-px mx-1', step > s.id ? 'bg-brand-500/40' : 'bg-white/10')} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-surface-800 rounded-2xl border border-white/10 p-6 mb-5 animate-fade-in">

        {/* ── Step 1: Basic Info ─────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-lg text-white">Basic Information</h2>

            <Input
              label="Cart Title"
              placeholder="e.g. High Protein Budget Meal Prep"
              value={form.title}
              onChange={e => setField('title', e.target.value)}
              required
              hint="Make it descriptive and searchable"
            />

            <Textarea
              label="Description"
              placeholder="Tell people what this cart is about, who it's for, and what makes it great…"
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              rows={4}
              required
            />

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {CATEGORY_OPTIONS.map(cat => {
                  const config = CATEGORY_CONFIG[cat]
                  return (
                    <button
                      key={cat}
                      onClick={() => setField('category', cat)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all',
                        form.category === cat
                          ? 'bg-brand-500/15 border-brand-500/30 text-brand-400'
                          : 'bg-surface-700/50 border-white/8 text-zinc-400 hover:border-white/20',
                      )}
                    >
                      <span className="text-xl">{config.emoji}</span>
                      <span className="text-xs font-medium leading-tight">{config.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Visibility</label>
              <div className="space-y-2">
                {visibilityOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setField('visibility', opt.value)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                      form.visibility === opt.value
                        ? 'bg-brand-500/10 border-brand-500/25'
                        : 'bg-surface-700/50 border-white/8 hover:border-white/18',
                    )}
                  >
                    <opt.icon size={16} className={form.visibility === opt.value ? 'text-brand-400' : 'text-zinc-500'} />
                    <div>
                      <p className={cn('text-sm font-medium', form.visibility === opt.value ? 'text-white' : 'text-zinc-300')}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-zinc-500">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Prep Goal"
                value={form.prepGoal}
                onChange={e => setField('prepGoal', e.target.value as PrepGoal)}
                options={Object.entries(PREP_GOAL_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))}
              />
              <Input
                label="Servings / Meals"
                type="number"
                min="1"
                max="200"
                value={String(form.servings)}
                onChange={e => setField('servings', parseInt(e.target.value) || 1)}
                hint="How many meals does this make?"
              />
            </div>
          </div>
        )}

        {/* ── Step 2: Grocery Items ──────────────────────────── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-white">Grocery Items</h2>
              <Button size="sm" variant="secondary" icon={<Plus size={14} />} onClick={addItem}>
                Add Item
              </Button>
            </div>

            {form.items.length === 0 ? (
              <div className="py-10 text-center rounded-xl border border-dashed border-white/10">
                <ShoppingBag size={32} className="text-zinc-600 mx-auto mb-3" />
                <p className="text-white font-medium mb-1">No items yet</p>
                <p className="text-sm text-zinc-500 mb-4">Add grocery items to your cart</p>
                <Button size="sm" icon={<Plus size={14} />} onClick={addItem}>Add First Item</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {form.items.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-surface-700/50 border border-white/8 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-500">Item {i + 1}</span>
                      <button
                        onClick={() => removeItem(i)}
                        className="p-1 text-zinc-600 hover:text-red-400 transition-colors rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <InventoryCombobox
                        value={itemSearchValues[i] ?? item.name}
                        onChange={val => {
                          const newSearchValues = [...itemSearchValues]
                          newSearchValues[i] = val
                          setItemSearchValues(newSearchValues)
                          updateItem(i, 'name', val)
                        }}
                        onSelect={(name, price, unit, category) => {
                          updateItem(i, 'name', name)
                          updateItem(i, 'estimatedPrice', price)
                          updateItem(i, 'unit', unit)
                          updateItem(i, 'category', category)
                          const newSearchValues = [...itemSearchValues]
                          newSearchValues[i] = name
                          setItemSearchValues(newSearchValues)
                        }}
                        containerClassName="col-span-2"
                      />
                      <Input
                        placeholder="Quantity"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={String(item.quantity)}
                        onChange={e => updateItem(i, 'quantity', parseFloat(e.target.value) || 1)}
                      />
                      <Input
                        placeholder="Unit (lbs, oz, count…)"
                        value={item.unit}
                        onChange={e => updateItem(i, 'unit', e.target.value)}
                      />
                      <Select
                        placeholder="Category"
                        value={item.category}
                        onChange={e => updateItem(i, 'category', e.target.value)}
                        options={ITEM_CATEGORIES.map(c => ({ value: c, label: c }))}
                      />
                      <Input
                        placeholder="Est. price ($)"
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.estimatedPrice === 0 ? '' : String(item.estimatedPrice)}
                        onChange={e => updateItem(i, 'estimatedPrice', parseFloat(e.target.value) || 0)}
                      />
                      <Input
                        placeholder="Preferred brand (optional)"
                        value={item.preferredBrand ?? ''}
                        onChange={e => updateItem(i, 'preferredBrand', e.target.value)}
                        containerClassName="col-span-2"
                      />
                    </div>
                  </div>
                ))}

                {/* Running total */}
                {estimatedTotal > 0 && (
                  <div className="flex justify-between items-center p-3 rounded-xl bg-surface-900/50 border border-white/8">
                    <span className="text-sm text-zinc-400">Estimated Total</span>
                    <span className="font-display font-bold text-brand-400 text-lg">{formatCurrency(estimatedTotal)}</span>
                  </div>
                )}

                <button
                  onClick={addItem}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/15 text-sm text-zinc-500 hover:text-white hover:border-white/30 transition-all"
                >
                  <Plus size={15} />
                  Add another item
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Meal Plan ─────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-white">Meal Plan</h2>
                <p className="text-sm text-zinc-500 mt-0.5">Add meals with instructions (optional)</p>
              </div>
              <Button size="sm" variant="secondary" icon={<Plus size={14} />} onClick={addMeal}>
                Add Meal
              </Button>
            </div>

            {meals.length === 0 ? (
              <div className="py-10 text-center rounded-xl border border-dashed border-white/10">
                <UtensilsCrossed size={32} className="text-zinc-600 mx-auto mb-3" />
                <p className="text-white font-medium mb-1">No meals yet</p>
                <p className="text-sm text-zinc-500 mb-4">Add meals with step-by-step cooking instructions</p>
                <Button size="sm" icon={<Plus size={14} />} onClick={addMeal}>Add First Meal</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {meals.map(meal => (
                  <div key={meal.id} className="p-4 rounded-xl bg-surface-700/50 border border-white/8 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                        {/* Emoji picker */}
                        <div className="flex flex-wrap gap-1 mb-1">
                          {MEAL_EMOJIS.map(e => (
                            <button
                              key={e}
                              type="button"
                              onClick={() => updateMeal(meal.id, 'emoji', e)}
                              className={cn(
                                'text-lg p-1 rounded-lg transition-all',
                                meal.emoji === e ? 'bg-brand-500/20 ring-1 ring-brand-500/40' : 'hover:bg-white/5',
                              )}
                            >{e}</button>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMeal(meal.id)}
                        className="p-1 text-zinc-600 hover:text-red-400 transition-colors rounded shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Label selector */}
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5">Meal Type</label>
                      <div className="flex flex-wrap gap-1.5">
                        {MEAL_LABELS.map(lbl => (
                          <button
                            key={lbl}
                            type="button"
                            onClick={() => updateMeal(meal.id, 'label', lbl)}
                            className={cn(
                              'text-xs px-2.5 py-1 rounded-full border transition-all font-medium',
                              meal.label === lbl
                                ? 'bg-brand-500/20 border-brand-500/30 text-brand-300'
                                : 'border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300',
                            )}
                          >{lbl}</button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <Input
                      placeholder={`${meal.emoji} ${meal.label} description (optional)`}
                      value={meal.description}
                      onChange={e => updateMeal(meal.id, 'description', e.target.value)}
                    />

                    {/* Ingredients from items */}
                    {itemNames.length > 0 && (
                      <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Ingredients (from your items)</label>
                        <div className="flex flex-wrap gap-1.5">
                          {itemNames.map(name => (
                            <button
                              key={name}
                              type="button"
                              onClick={() => toggleMealIngredient(meal.id, name)}
                              className={cn(
                                'text-xs px-2.5 py-1 rounded-full border transition-all',
                                meal.ingredients.includes(name)
                                  ? 'bg-brand-500/20 border-brand-500/30 text-brand-300'
                                  : 'border-white/10 text-zinc-500 hover:border-white/20',
                              )}
                            >{name}</button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step-by-step instructions */}
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1.5">Step-by-step Instructions</label>
                      <div className="space-y-2">
                        {meal.instructions.map((step, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                            <input
                              type="text"
                              value={step}
                              onChange={e => updateInstruction(meal.id, idx, e.target.value)}
                              placeholder={`Step ${idx + 1}…`}
                              className="flex-1 h-9 px-3 bg-surface-800 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 transition-colors"
                            />
                            {meal.instructions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeInstruction(meal.id, idx)}
                                className="p-1 text-zinc-600 hover:text-red-400 transition-colors rounded"
                              >
                                <X size={13} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addInstruction(meal.id)}
                          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mt-1"
                        >
                          <Plus size={12} /> Add step
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Step 4: Dietary ───────────────────────────────── */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-lg text-white">Dietary Labels & Substitutions</h2>
            <p className="text-sm text-zinc-500">Help people discover your cart and set up automatic substitution rules.</p>

            {/* Dietary labels */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Dietary Labels</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DIETARY_OPTIONS.map(label => {
                  const config = DIETARY_CONFIG[label]
                  const active = form.dietaryLabels.includes(label)
                  return (
                    <button
                      key={label}
                      onClick={() => toggleDietary(label)}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-xl border text-left transition-all text-sm',
                        active ? 'bg-brand-500/15 border-brand-500/25 text-brand-300' : 'bg-surface-700/50 border-white/8 text-zinc-400 hover:border-white/20',
                      )}
                    >
                      <span>{config.emoji}</span>
                      <span className="font-medium">{config.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add tag (e.g. budget, chicken, weekly)"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  containerClassName="flex-1"
                />
                <Button size="md" variant="secondary" icon={<Plus size={15} />} onClick={addTag} />
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map(tag => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-xs text-zinc-300 bg-surface-700 px-2.5 py-1 rounded-full border border-white/10"
                    >
                      <Tag size={10} />
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-0.5 text-zinc-600 hover:text-red-400 transition-colors">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <Textarea
              label="Prep Notes (optional)"
              placeholder="Share prep tips, timing, storage advice, or anything helpful for people using this cart…"
              value={form.notes ?? ''}
              onChange={e => setField('notes', e.target.value)}
              rows={4}
            />
          </div>
        )}

        {/* ── Step 5: Review ────────────────────────────────── */}
        {step === 5 && (
          <div className="space-y-5">
            <h2 className="font-display font-bold text-lg text-white">Review & Publish</h2>

            <div className="space-y-3">
              {/* Summary card */}
              <div className="p-4 rounded-xl bg-surface-700/50 border border-white/8 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display font-bold text-white">{form.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{form.description.slice(0, 80)}…</p>
                  </div>
                  <span className={cn('text-xs px-2 py-1 rounded-full border font-medium shrink-0', CATEGORY_CONFIG[form.category].color)}>
                    {CATEGORY_CONFIG[form.category].emoji} {CATEGORY_CONFIG[form.category].label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Items', value: String(form.items.length) },
                    { label: 'Servings', value: String(form.servings) },
                    { label: 'Est. Cost', value: formatCurrency(estimatedTotal) },
                  ].map(stat => (
                    <div key={stat.label} className="bg-surface-800/60 rounded-lg p-2.5 text-center">
                      <p className="font-bold text-white text-sm">{stat.value}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wide">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {form.dietaryLabels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {form.dietaryLabels.map(label => (
                      <span key={label} className="text-[11px] px-2 py-0.5 rounded-full bg-surface-600 text-zinc-300 border border-white/10">
                        {DIETARY_CONFIG[label].emoji} {DIETARY_CONFIG[label].label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Visibility */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-700/50 border border-white/8 text-sm">
                {form.visibility === 'public' ? <Globe size={15} className="text-brand-400" /> :
                 form.visibility === 'unlisted' ? <Eye size={15} className="text-yellow-400" /> :
                 <Lock size={15} className="text-zinc-500" />}
                <span className="text-white font-medium capitalize">{form.visibility}</span>
                <span className="text-zinc-500">—</span>
                <span className="text-zinc-500 text-xs">
                  {form.visibility === 'public' ? 'Visible to everyone' :
                   form.visibility === 'unlisted' ? 'Accessible via link only' :
                   'Only visible to you'}
                </span>
              </div>

              {/* Ready check */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-500/8 border border-brand-500/15">
                <CheckCircle size={18} className="text-brand-400 shrink-0" />
                <p className="text-sm text-white">
                  Your cart looks great! Ready to publish.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="md"
          icon={<ArrowLeft size={16} />}
          onClick={() => step > 1 ? setStep(step - 1) : router.push('/dashboard')}
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>

        {step < 5 ? (
          <Button
            size="md"
            icon={<ArrowRight size={16} />}
            iconPosition="right"
            disabled={!canProceed()}
            onClick={() => setStep(step + 1)}
          >
            Next: {STEPS[step].title}
          </Button>
        ) : (
          <Button
            size="lg"
            icon={<Zap size={18} />}
            loading={submitting}
            onClick={handlePublish}
            className="shadow-glow-md"
          >
            {form.visibility === 'public' ? 'Publish AutoCart' : 'Save Cart'}
          </Button>
        )}
      </div>
    </div>
  )
}
