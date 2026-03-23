'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Compass, PlusCircle, Bookmark, Package } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getAvatarUrl, cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/browse',    icon: Compass,         label: 'Discover' },
  { href: '/create',    icon: PlusCircle,      label: 'Create',  highlight: true },
  { href: '/saved',     icon: Bookmark,        label: 'Saved' },
  { href: '/inventory', icon: Package,         label: 'Inventory' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-surface-900/96 backdrop-blur-xl border-t border-white/[0.07]">
      <div className="flex items-center justify-around px-1 pt-1 pb-safe-or-2">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 px-2 py-1.5"
              >
                <div className={cn(
                  'w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200',
                  isActive
                    ? 'bg-brand-500 shadow-glow-md'
                    : 'bg-brand-500/20 border border-brand-500/30',
                )}>
                  <item.icon size={21} className={isActive ? 'text-white' : 'text-brand-400'} />
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors',
                isActive ? 'text-brand-400' : 'text-zinc-500',
              )}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[9px] font-semibold tracking-wide leading-none">
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* Profile avatar tab */}
        {user && (
          <Link
            href="/account"
            className={cn(
              'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors',
              pathname === '/account' ? 'text-brand-400' : 'text-zinc-500',
            )}
          >
            <img
              src={user.avatarUrl ?? getAvatarUrl(user.username)}
              alt={user.displayName}
              className={cn(
                'w-6 h-6 rounded-full ring-2 transition-all',
                pathname === '/account' ? 'ring-brand-400' : 'ring-white/20',
              )}
            />
            <span className="text-[9px] font-semibold tracking-wide leading-none">
              Profile
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}
