'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Settings } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import { useAuth } from '@/contexts/AuthContext'
import { getAvatarUrl } from '@/lib/utils'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center animate-pulse">
            <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-zinc-500">Loading…</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Desktop sidebar — hidden on mobile */}
      <Sidebar />

      {/* Mobile top bar — hidden on desktop */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 bg-surface-900/95 backdrop-blur-xl border-b border-white/[0.07]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center shadow-glow-sm">
            <ShoppingCart size={13} className="text-white" />
          </div>
          <span className="font-display font-bold text-[15px] text-white tracking-tight">
            Auto<span className="text-brand-400">Cart</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-500 hover:text-white transition-colors"
          >
            <Settings size={17} />
          </Link>
          <Link href={`/profile/${user.username}`}>
            <img
              src={user.avatarUrl ?? getAvatarUrl(user.username)}
              alt={user.displayName}
              className="w-8 h-8 rounded-full ring-2 ring-white/20 object-cover"
            />
          </Link>
        </div>
      </header>

      {/* Main content — offset for top bar on mobile, sidebar on desktop, bottom nav on mobile */}
      <main className="flex-1 min-h-screen overflow-x-hidden lg:ml-64 pt-14 lg:pt-0 pb-24 lg:pb-0">
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  )
}
