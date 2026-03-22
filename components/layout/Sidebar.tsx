'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ShoppingCart, LayoutDashboard, Compass, PlusCircle,
  User, Settings, LogOut, Bookmark, Zap, ChevronRight, Package,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn, getAvatarUrl, formatNumber } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/browse', icon: Compass, label: 'Discover' },
  { href: '/saved', icon: Bookmark, label: 'Saved Carts' },
  { href: '/inventory', icon: Package, label: 'Inventory' },
  { href: '/create', icon: PlusCircle, label: 'Create Cart', highlight: true },
]

const BOTTOM_ITEMS = [
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-surface-900 border-r border-white/[0.07] z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.07]">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-all duration-300">
            <ShoppingCart size={15} className="text-white" />
          </div>
          <span className="font-display font-bold text-[17px] text-white tracking-tight">
            Auto<span className="text-brand-400">Cart</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                  : item.highlight
                  ? 'text-zinc-300 hover:bg-brand-500/10 hover:text-brand-400 border border-dashed border-white/10 hover:border-brand-500/30'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white',
              )}
            >
              <item.icon
                size={17}
                className={cn(
                  'shrink-0 transition-colors',
                  isActive ? 'text-brand-400' : item.highlight ? 'text-brand-500/70 group-hover:text-brand-400' : 'text-zinc-500 group-hover:text-zinc-300',
                )}
              />
              <span>{item.label}</span>
              {isActive && <ChevronRight size={14} className="ml-auto text-brand-400/60" />}
            </Link>
          )
        })}

        {/* Divider */}
        <div className="my-3 border-t border-white/[0.07]" />

        <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-zinc-600 font-semibold">
          Creator
        </p>
        {user && (
          <Link
            href={`/profile/${user.username}`}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              pathname.startsWith('/profile')
                ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                : 'text-zinc-400 hover:bg-white/5 hover:text-white',
            )}
          >
            <User size={17} className="shrink-0 text-zinc-500" />
            <span>My Profile</span>
          </Link>
        )}
      </nav>

      {/* Upgrade banner (for regular users) */}
      {user?.userType === 'user' && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 border border-white/10">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap size={13} className="text-brand-400" />
            <span className="text-xs font-bold text-white">Go Creator</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">
            Share carts publicly and build your audience.
          </p>
          <button className="w-full text-[11px] font-semibold text-brand-400 bg-brand-500/15 hover:bg-brand-500/25 rounded-lg py-1.5 transition-colors">
            Upgrade Free →
          </button>
        </div>
      )}

      {/* User section */}
      <div className="p-3 border-t border-white/[0.07]">
        {user ? (
          <div className="flex items-center gap-3">
            <img
              src={user.avatarUrl ?? getAvatarUrl(user.username)}
              alt={user.displayName}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.displayName}</p>
              <p className="text-[11px] text-zinc-500 truncate">@{user.username}</p>
            </div>
            <button
              onClick={signOut}
              className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
              title="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <Link href="/login">
            <div className="text-center text-sm text-zinc-400 hover:text-white transition-colors py-1">
              Sign in →
            </div>
          </Link>
        )}
      </div>
    </aside>
  )
}
