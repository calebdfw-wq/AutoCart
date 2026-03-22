'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, Zap } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function MarketingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-surface-900/90 backdrop-blur-xl border-b border-white/8'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-all duration-300">
              <ShoppingCart size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              Auto<span className="text-brand-400">Cart</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '/browse', label: 'Browse Carts' },
              { href: '/#how-it-works', label: 'How It Works' },
              { href: '/#features', label: 'Features' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors duration-150 rounded-lg hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" icon={<Zap size={14} />}>
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-white/8 animate-fade-in">
            <nav className="flex flex-col gap-1 mb-4">
              {[
                { href: '/browse', label: 'Browse Carts' },
                { href: '/#how-it-works', label: 'How It Works' },
                { href: '/#features', label: 'Features' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="secondary" size="md" fullWidth>Sign In</Button>
              </Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)}>
                <Button size="md" fullWidth icon={<Zap size={16} />}>Get Started Free</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
