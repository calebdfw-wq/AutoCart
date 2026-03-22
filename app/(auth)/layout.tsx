import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-950 mesh-bg flex flex-col">
      {/* Minimal nav */}
      <nav className="p-5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-glow-sm">
            <ShoppingCart size={15} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">
            Auto<span className="text-brand-400">Cart</span>
          </span>
        </Link>
        <Link href="/browse" className="text-sm text-zinc-500 hover:text-white transition-colors">
          Browse Carts →
        </Link>
      </nav>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        {children}
      </main>

      {/* Footer micro */}
      <div className="py-4 text-center text-xs text-zinc-700">
        By continuing you agree to our{' '}
        <Link href="/terms" className="hover:text-zinc-500 transition-colors">Terms</Link>
        {' '}and{' '}
        <Link href="/privacy" className="hover:text-zinc-500 transition-colors">Privacy Policy</Link>
      </div>
    </div>
  )
}
