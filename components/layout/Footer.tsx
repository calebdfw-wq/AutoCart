import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

const FOOTER_LINKS = {
  Product: [
    { label: 'Browse Carts', href: '/browse' },
    { label: 'Create Cart', href: '/create' },
    { label: 'For Creators', href: '/#creators' },
    { label: 'Integrations', href: '/#integrations' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-surface-900 border-t border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 w-fit">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-glow-sm">
                <ShoppingCart size={17} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Auto<span className="text-brand-400">Cart</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-[260px]">
              Build and share automatic grocery carts. Connect with creators, hit your macros, save time.
            </p>
            {/* Coming soon stores */}
            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-widest text-zinc-600 mb-2 font-semibold">
                Integrations Coming Soon
              </p>
              <div className="flex flex-wrap gap-2">
                {['Walmart', 'Kroger', 'Instacart', 'H-E-B', 'Target'].map(store => (
                  <span key={store} className="text-[11px] px-2 py-1 bg-surface-700 text-zinc-500 rounded-md border border-white/8">
                    {store}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs uppercase tracking-widest text-zinc-600 font-semibold mb-4">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.07] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} AutoCart. All rights reserved.
          </p>
          <p className="text-xs text-zinc-700">
            Built for creators, meal preppers, and everyday shoppers.
          </p>
        </div>
      </div>
    </footer>
  )
}
