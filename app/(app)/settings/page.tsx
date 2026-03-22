'use client'

import { useState } from 'react'
import {
  User, Mail, Lock, Globe, Instagram, Youtube, Twitter, Save,
  Camera, Zap, Plus, X, ArrowRight, Repeat2, Info,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import Input, { Textarea } from '@/components/ui/Input'
import Toggle from '@/components/ui/Toggle'
import { FoodSubstitution } from '@/lib/types'
import { getAvatarUrl, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

type Tab = 'profile' | 'substitutions' | 'account' | 'notifications'

// ─── Common food types to quick-pick ─────────────────────────
const COMMON_FOOD_TYPES = [
  'bread', 'pasta', 'milk', 'butter', 'cheese', 'yogurt',
  'eggs', 'rice', 'flour', 'soy sauce', 'tortillas', 'crackers',
  'oats', 'cream', 'mayonnaise', 'beef', 'chicken', 'pork',
]

// ─── Single substitution row ──────────────────────────────────
function SubRow({
  sub,
  onDelete,
}: {
  sub: FoodSubstitution
  onDelete: () => void
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-700/60 border border-white/8 group">
      {/* Food type pill */}
      <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-600 border border-white/10 min-w-0">
        <span className="text-xs font-semibold text-zinc-300 truncate max-w-[90px]">{sub.foodType}</span>
      </div>

      {/* Arrow */}
      <ArrowRight size={14} className="text-brand-400 shrink-0 mt-1.5" />

      {/* Substitute */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{sub.substituteWith}</p>
        {sub.notes && (
          <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{sub.notes}</p>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="shrink-0 p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
        title="Remove substitution"
      >
        <X size={14} />
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [saving, setSaving] = useState(false)

  // ── Profile form state ─────────────────────────────────────
  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [isPublic, setIsPublic] = useState(user?.isPublic ?? true)
  const [instagram, setInstagram] = useState(user?.socialLinks?.instagram ?? '')
  const [tiktok, setTiktok] = useState(user?.socialLinks?.tiktok ?? '')
  const [youtube, setYoutube] = useState(user?.socialLinks?.youtube ?? '')
  const [twitter, setTwitter] = useState(user?.socialLinks?.twitter ?? '')
  const [website, setWebsite] = useState(user?.socialLinks?.website ?? '')

  // ── Substitutions state ────────────────────────────────────
  const [subs, setSubs] = useState<FoodSubstitution[]>(
    user?.foodSubstitutions ?? []
  )
  const [foodInput, setFoodInput] = useState('')
  const [subInput, setSubInput] = useState('')
  const [notesInput, setNotesInput] = useState('')
  const [subSaving, setSubSaving] = useState(false)

  // ── Notification preferences ───────────────────────────────
  const [notifyLikes, setNotifyLikes] = useState(true)
  const [notifyFollowers, setNotifyFollowers] = useState(true)
  const [notifyNewCarts, setNotifyNewCarts] = useState(false)
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(true)

  const saveProfile = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    updateProfile({
      displayName,
      bio,
      isPublic,
      socialLinks: { instagram, tiktok, youtube, twitter, website },
    })
    toast.success('Profile saved!')
    setSaving(false)
  }

  const addSub = () => {
    const food = foodInput.trim().toLowerCase()
    const sub = subInput.trim()
    if (!food || !sub) {
      toast.error('Please fill in both fields')
      return
    }
    if (subs.some(s => s.foodType === food)) {
      toast.error(`You already have a rule for "${food}"`)
      return
    }
    const newSub: FoodSubstitution = {
      id: `sub-${Date.now()}`,
      foodType: food,
      substituteWith: sub,
      notes: notesInput.trim() || undefined,
      createdAt: new Date().toISOString(),
    }
    setSubs(prev => [...prev, newSub])
    setFoodInput('')
    setSubInput('')
    setNotesInput('')
  }

  const deleteSub = (id: string) => {
    setSubs(prev => prev.filter(s => s.id !== id))
  }

  const saveSubs = async () => {
    setSubSaving(true)
    await new Promise(r => setTimeout(r, 600))
    updateProfile({ foodSubstitutions: subs })
    toast.success('Substitutions saved!')
    setSubSaving(false)
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'substitutions', label: 'Auto-Subs' },
    { id: 'account', label: 'Account' },
    { id: 'notifications', label: 'Notifications' },
  ]

  if (!user) return null

  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-8">
      <div className="mb-7">
        <h1 className="font-display font-extrabold text-2xl text-white mb-1">Settings</h1>
        <p className="text-zinc-500 text-sm">Manage your account and preferences</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-surface-800 rounded-xl border border-white/8 mb-7 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
              activeTab === tab.id
                ? 'bg-surface-600 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Profile tab ──────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Avatar */}
          <div className="p-5 bg-surface-800 rounded-2xl border border-white/8">
            <h2 className="font-display font-bold text-base text-white mb-4">Profile Photo</h2>
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={user.avatarUrl ?? getAvatarUrl(user.username)}
                  alt={user.displayName}
                  className="w-20 h-20 rounded-2xl ring-2 ring-white/10 object-cover"
                />
                <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center shadow-glow-sm hover:bg-brand-400 transition-colors">
                  <Camera size={13} className="text-white" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user.displayName}</p>
                <p className="text-xs text-zinc-500 mt-0.5">@{user.username}</p>
                <button className="text-xs text-brand-400 hover:text-brand-300 mt-2 transition-colors">
                  Upload new photo
                </button>
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div className="p-5 bg-surface-800 rounded-2xl border border-white/8 space-y-4">
            <h2 className="font-display font-bold text-base text-white">Basic Info</h2>
            <Input
              label="Display Name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              leftIcon={<User size={15} />}
            />
            <Input
              label="Username"
              value={user.username}
              disabled
              leftIcon={<span className="text-zinc-600 text-sm font-medium">@</span>}
              hint="Username cannot be changed"
            />
            <Textarea
              label="Bio"
              placeholder="Tell people a bit about yourself…"
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
            />
            <Toggle
              checked={isPublic}
              onChange={setIsPublic}
              label="Public Profile"
              description="Allow anyone to view your profile and public carts"
            />
          </div>

          {/* Social links */}
          <div className="p-5 bg-surface-800 rounded-2xl border border-white/8 space-y-4">
            <h2 className="font-display font-bold text-base text-white">Social Links</h2>
            {[
              { icon: Instagram, label: 'Instagram', value: instagram, setter: setInstagram, placeholder: '@yourusername' },
              { icon: Twitter, label: 'TikTok', value: tiktok, setter: setTiktok, placeholder: '@yourusername' },
              { icon: Youtube, label: 'YouTube', value: youtube, setter: setYoutube, placeholder: 'YourChannel' },
              { icon: Twitter, label: 'Twitter / X', value: twitter, setter: setTwitter, placeholder: '@yourusername' },
              { icon: Globe, label: 'Website', value: website, setter: setWebsite, placeholder: 'https://yoursite.com' },
            ].map(field => (
              <Input
                key={field.label}
                label={field.label}
                placeholder={field.placeholder}
                value={field.value}
                onChange={e => field.setter(e.target.value)}
                leftIcon={<field.icon size={15} />}
              />
            ))}
          </div>

          <Button size="lg" icon={<Save size={16} />} onClick={saveProfile} loading={saving}>
            Save Changes
          </Button>
        </div>
      )}

      {/* ── Substitutions tab ─────────────────────────────────── */}
      {activeTab === 'substitutions' && (
        <div className="space-y-5">

          {/* Explainer */}
          <div className="flex gap-3 p-4 rounded-2xl bg-brand-500/8 border border-brand-500/20">
            <Repeat2 size={16} className="text-brand-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">Auto Food Substitutions</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Set personal swap rules that apply every time you generate a grocery cart.
                For example: replace any <span className="text-white font-medium">bread</span> with{' '}
                <span className="text-white font-medium">Canyon Bakehouse Gluten Free Bread</span>.
                Rules match any cart item whose name contains your food keyword.
              </p>
            </div>
          </div>

          {/* Add form */}
          <div className="p-5 bg-surface-800 rounded-2xl border border-white/8 space-y-4">
            <h2 className="font-display font-bold text-base text-white">Add a Substitution</h2>

            {/* Quick-pick chips */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">Quick pick food type</p>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_FOOD_TYPES.map(food => (
                  <button
                    key={food}
                    onClick={() => setFoodInput(food)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-medium border transition-all duration-150',
                      foodInput === food
                        ? 'bg-brand-500/20 text-brand-400 border-brand-500/40'
                        : 'bg-surface-700 text-zinc-400 border-white/8 hover:border-white/18 hover:text-white',
                    )}
                  >
                    {food}
                  </button>
                ))}
              </div>
            </div>

            {/* Two-column form */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Food to replace <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder='e.g. "bread", "pasta", "milk"'
                  value={foodInput}
                  onChange={e => setFoodInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && subInput && addSub()}
                  className="w-full h-10 px-3 bg-surface-700 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 transition-colors"
                />
                <p className="text-[10px] text-zinc-600 mt-1">Matches items whose name contains this word</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Replace with <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder='e.g. "Canyon Bakehouse GF Bread"'
                  value={subInput}
                  onChange={e => setSubInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && foodInput && addSub()}
                  className="w-full h-10 px-3 bg-surface-700 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 transition-colors"
                />
                <p className="text-[10px] text-zinc-600 mt-1">The exact product to use instead</p>
              </div>
            </div>

            {/* Notes + add button row */}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Notes <span className="text-zinc-600">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder='e.g. "Found in the gluten-free aisle at H-E-B"'
                  value={notesInput}
                  onChange={e => setNotesInput(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-700 border border-white/10 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 transition-colors"
                />
              </div>
              <button
                onClick={addSub}
                disabled={!foodInput.trim() || !subInput.trim()}
                className="h-10 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center gap-2 transition-colors shrink-0"
              >
                <Plus size={15} />
                Add
              </button>
            </div>
          </div>

          {/* Current substitutions list */}
          <div className="p-5 bg-surface-800 rounded-2xl border border-white/8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-base text-white">
                Your Substitutions
                {subs.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-zinc-500">({subs.length})</span>
                )}
              </h2>
            </div>

            {subs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-surface-700 border border-white/8 flex items-center justify-center mb-3">
                  <Repeat2 size={20} className="text-zinc-600" />
                </div>
                <p className="text-sm text-zinc-400 font-medium mb-1">No substitutions yet</p>
                <p className="text-xs text-zinc-600">
                  Add your first rule above — like swapping all bread for your preferred GF brand.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {subs.map(sub => (
                  <SubRow key={sub.id} sub={sub} onDelete={() => deleteSub(sub.id)} />
                ))}
              </div>
            )}
          </div>

          {/* How it works callout */}
          <div className="flex gap-3 p-4 rounded-2xl bg-surface-800 border border-white/8">
            <Info size={14} className="text-zinc-500 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-500 leading-relaxed">
              These rules run automatically when you click <span className="text-white font-medium">Generate Grocery Cart</span> on any AutoCart.
              If a cart item name contains your food keyword (e.g. <span className="text-zinc-300">"bread"</span>),
              it will be swapped for your preferred substitute before the list is generated.
              Substitutions are personal and only apply to your account.
            </p>
          </div>

          <Button
            size="lg"
            icon={<Save size={16} />}
            onClick={saveSubs}
            loading={subSaving}
          >
            Save Substitutions
          </Button>
        </div>
      )}

      {/* ── Account tab ──────────────────────────────────────── */}
      {activeTab === 'account' && (
        <div className="space-y-5">
          <div className="p-5 bg-surface-800 rounded-2xl border border-white/8 space-y-4">
            <h2 className="font-display font-bold text-base text-white">Email &amp; Password</h2>
            <Input
              label="Email"
              type="email"
              value={user.email}
              disabled
              leftIcon={<Mail size={15} />}
              hint="Contact support to change your email"
            />
            <Button variant="secondary" size="md" icon={<Lock size={15} />} onClick={() => toast.success('Password reset email sent!')}>
              Change Password
            </Button>
          </div>

          <div className="p-5 bg-surface-800 rounded-2xl border border-white/8">
            <h2 className="font-display font-bold text-base text-white mb-1">Account Type</h2>
            <p className="text-xs text-zinc-500 mb-4">
              You are currently a <span className="text-white font-medium capitalize">{user.userType}</span>.
            </p>
            {user.userType === 'user' && (
              <div className="p-4 rounded-xl bg-brand-500/8 border border-brand-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={15} className="text-brand-400" />
                  <span className="text-sm font-bold text-white">Become a Creator</span>
                </div>
                <p className="text-xs text-zinc-500 mb-3">
                  Publish public AutoCarts, build your audience, and help people eat better.
                </p>
                <Button size="sm" onClick={() => toast.success('Creator upgrade coming soon!')}>
                  Upgrade to Creator
                </Button>
              </div>
            )}
          </div>

          <div className="p-5 bg-surface-800 rounded-2xl border border-red-500/15">
            <h2 className="font-display font-bold text-base text-red-400 mb-1">Danger Zone</h2>
            <p className="text-xs text-zinc-500 mb-4">These actions are permanent and cannot be undone.</p>
            <Button variant="danger" size="sm" onClick={() => toast.error('Account deletion requires contacting support')}>
              Delete Account
            </Button>
          </div>
        </div>
      )}

      {/* ── Notifications tab ─────────────────────────────────── */}
      {activeTab === 'notifications' && (
        <div className="p-5 bg-surface-800 rounded-2xl border border-white/8 space-y-5">
          <h2 className="font-display font-bold text-base text-white">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              { checked: notifyLikes, setter: setNotifyLikes, label: 'Likes on your carts', description: 'Get notified when someone likes one of your AutoCarts' },
              { checked: notifyFollowers, setter: setNotifyFollowers, label: 'New followers', description: 'Get notified when someone follows your profile' },
              { checked: notifyNewCarts, setter: setNotifyNewCarts, label: 'New carts from creators you follow', description: 'Get notified when someone you follow publishes a new cart' },
              { checked: notifyWeeklyDigest, setter: setNotifyWeeklyDigest, label: 'Weekly digest', description: 'A weekly summary of trending carts and your stats' },
            ].map(item => (
              <div key={item.label} className="py-3 border-b border-white/6 last:border-0">
                <Toggle checked={item.checked} onChange={item.setter} label={item.label} description={item.description} />
              </div>
            ))}
          </div>
          <Button size="md" icon={<Save size={15} />} onClick={() => toast.success('Notification preferences saved!')}>
            Save Preferences
          </Button>
        </div>
      )}
    </div>
  )
}
