import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ShoppingCart, Zap, ArrowRight, Check, Star, Users, TrendingUp,
  Dumbbell, Leaf, DollarSign, RefreshCw, Share2, Store
} from 'lucide-react'
import MarketingNav from '@/components/layout/MarketingNav'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import CartCard from '@/components/autocart/CartCard'
import { DEMO_CARTS } from '@/lib/seed-data'
import { formatNumber } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'AutoCart — Build & Share Automatic Grocery Carts',
}

const FEATURES = [
  { icon: Zap, title: 'One-Click Cart Generation', description: 'Select any AutoCart and generate a full, ready-to-shop grocery list in seconds.', color: 'text-brand-400 bg-brand-500/10 border-brand-500/20' },
  { icon: RefreshCw, title: 'Smart Substitutions', description: 'Gluten-free, dairy-free, vegan, or budget swaps applied automatically based on your preferences.', color: 'text-accent-400 bg-accent-500/10 border-accent-500/20' },
  { icon: Users, title: 'Creator-Powered Carts', description: 'Meal prep influencers publish expert carts so you can shop exactly like the pros do.', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { icon: Share2, title: 'Share with Anyone', description: 'Send your cart to friends, family, or followers. Public, private, or unlisted — you control it.', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { icon: Store, title: 'Multi-Store Ready', description: 'Designed for Walmart, Kroger, Instacart, H-E-B, Target, and Amazon Fresh integrations.', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { icon: TrendingUp, title: 'Track & Optimize', description: 'See estimated cost, cost-per-meal, total servings, and nutritional summaries at a glance.', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Browse or Create a Cart', description: 'Find a cart from a trusted creator or build your own from scratch in minutes.', emoji: '🔍' },
  { step: '02', title: 'Customize & Substitute', description: "Toggle dietary preferences. The cart auto-adapts to your restrictions and brand choices.", emoji: '⚙️' },
  { step: '03', title: 'Generate & Shop', description: "Hit Generate and get a complete shopping list ready for your favorite store.", emoji: '🛒' },
]

const STATS = [
  { value: '50K+', label: 'AutoCarts Created' },
  { value: '2.1M', label: 'Grocery Lists Generated' },
  { value: '$47', label: 'Avg. Weekly Savings' },
  { value: '400+', label: 'Active Creators' },
]

export default function LandingPage() {
  const featuredCarts = DEMO_CARTS.filter(c => c.visibility === 'public').slice(0, 3)

  return (
    <div className="min-h-screen bg-surface-950 overflow-x-hidden">
      <MarketingNav />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 px-4 sm:px-6 mesh-bg">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-500/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-accent-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-400 text-sm font-medium animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            Now with dietary substitution engine
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight mb-6 animate-slide-up">
            Grocery Shopping on{' '}
            <span className="text-gradient">Autopilot</span>
          </h1>

          <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '80ms' }}>
            Build, browse, and share automatic grocery carts. Get expert meal prep carts from top creators, customize to your diet, and generate your shopping list in one click.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12 animate-slide-up" style={{ animationDelay: '160ms' }}>
            <Link href="/signup">
              <Button size="xl" icon={<Zap size={20} />} className="min-w-[200px] shadow-glow-md">
                Start for Free
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="xl" variant="secondary" icon={<ArrowRight size={20} />} iconPosition="right" className="min-w-[200px]">
                Browse AutoCarts
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-zinc-500 animate-fade-in" style={{ animationDelay: '300ms' }}>
            {[
              { icon: Check, text: 'No credit card required' },
              { icon: Check, text: 'Free forever for shoppers' },
              { icon: Check, text: '400+ creator carts' },
            ].map(item => (
              <span key={item.text} className="flex items-center gap-1.5">
                <item.icon size={14} className="text-brand-500" />
                {item.text}
              </span>
            ))}
          </div>
        </div>

        {/* Hero mockup / preview cards */}
        <div className="max-w-6xl mx-auto mt-16 px-4 relative animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-surface-800">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-900 border-b border-white/8">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-brand-500/60" />
              </div>
              <div className="flex-1 mx-4 h-6 bg-surface-700/60 rounded-md flex items-center px-3">
                <span className="text-xs text-zinc-600">autocart.app/browse</span>
              </div>
            </div>
            {/* Preview grid */}
            <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featuredCarts.map(cart => (
                <div key={cart.id} className="bg-surface-700/50 rounded-xl border border-white/8 overflow-hidden">
                  <div className="aspect-[16/7] overflow-hidden">
                    {cart.coverImage ? (
                      <img src={cart.coverImage} alt={cart.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-surface-600 flex items-center justify-center text-3xl">🥗</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-white truncate">{cart.title}</p>
                    <p className="text-xs text-zinc-500 mt-1">~${cart.estimatedTotalCost.toFixed(0)}/week · {cart.servings} servings</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="h-1.5 flex-1 rounded-full bg-brand-500/30 overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: '85%' }} />
                      </div>
                      <span className="text-[10px] text-brand-400 font-semibold">Ready</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Floating badge */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-brand-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-glow-md rotate-12 hidden sm:block">
            ✓ Cart Generated
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="py-12 border-y border-white/[0.06] bg-surface-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-brand-400 font-semibold mb-3">Simple Process</p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-4">
              From idea to grocery cart in 3 steps
            </h2>
            <p className="text-zinc-500 text-base max-w-lg mx-auto">
              No more aimlessly wandering grocery aisles. AutoCart gives you a structured, goal-driven list every time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="relative p-6 rounded-2xl bg-surface-800 border border-white/8 group hover:border-brand-500/20 transition-all duration-200">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <div className="font-display font-extrabold text-4xl text-brand-500/20 mb-2">{item.step}</div>
                <h3 className="font-display font-bold text-lg text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.description}</p>
                {i < 2 && (
                  <ArrowRight size={18} className="absolute -right-3 top-1/2 -translate-y-1/2 text-zinc-700 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 bg-surface-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-brand-400 font-semibold mb-3">Everything You Need</p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-4">
              Built for every kind of shopper
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(feature => (
              <div key={feature.title} className="p-5 rounded-2xl bg-surface-800 border border-white/8 hover:border-white/15 transition-all duration-200 group">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon size={20} />
                </div>
                <h3 className="font-display font-bold text-base text-white mb-2 group-hover:text-brand-300 transition-colors">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Carts ────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-400 font-semibold mb-2">Trending Now</p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
                Popular AutoCarts
              </h2>
            </div>
            <Link href="/browse">
              <Button variant="ghost" size="md" icon={<ArrowRight size={16} />} iconPosition="right">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEMO_CARTS.slice(0, 6).map(cart => (
              <CartCard key={cart.id} cart={cart} variant="feed" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Creator Section ───────────────────────────────────── */}
      <section id="creators" className="py-20 sm:py-28 px-4 sm:px-6 bg-surface-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-brand-500/8 via-surface-800 to-accent-500/8 border border-white/10 p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 mesh-bg opacity-60 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center mx-auto mb-6">
                <Dumbbell size={24} className="text-brand-400" />
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-4">
                Are you a creator or trainer?
              </h2>
              <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                Publish your meal prep carts, grow your audience, and help thousands of people eat better. Free forever for creators.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/signup?type=creator">
                  <Button size="lg" icon={<Zap size={18} />} className="shadow-glow-md min-w-[200px]">
                    Become a Creator
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button size="lg" variant="secondary" className="min-w-[180px]">
                    See Creator Carts
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-5 leading-tight">
            Ready to shop smarter?
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Join thousands of shoppers building better carts, hitting their macros, and saving time every week.
          </p>
          <Link href="/signup">
            <Button size="xl" icon={<ShoppingCart size={20} />} className="shadow-glow-lg">
              Create Free Account
            </Button>
          </Link>
          <p className="text-xs text-zinc-600 mt-4">No credit card · No commitment · Cancel anytime</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
