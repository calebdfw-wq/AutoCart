import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

export const metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-950">
      <nav className="p-5 border-b border-white/8">
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
            <ShoppingCart size={15} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">Auto<span className="text-brand-400">Cart</span></span>
        </Link>
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-14">
        <h1 className="font-display font-extrabold text-4xl text-white mb-2">Terms of Service</h1>
        <p className="text-zinc-500 text-sm mb-10">Last updated: March 2026</p>
        {[
          { title: '1. Acceptance of Terms', body: 'By accessing and using AutoCart, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.' },
          { title: '2. Use License', body: 'AutoCart grants you a limited, non-exclusive, non-transferable license to use the platform for personal, non-commercial purposes. You may not: modify or copy our materials, use materials for commercial purposes, remove copyright or proprietary notations, or transfer materials to another person.' },
          { title: '3. User Content', body: 'By posting AutoCarts or other content, you grant AutoCart a non-exclusive, worldwide, royalty-free license to use, reproduce, and display that content in connection with operating the service. You are responsible for ensuring your content does not violate any third-party rights.' },
          { title: '4. Grocery Store Integrations', body: 'AutoCart is not affiliated with, endorsed by, or a partner of Walmart, Kroger, H-E-B, Instacart, Amazon Fresh, Target, or any other grocery retailer. Links to these retailers are provided for user convenience. Prices and availability shown are estimates and may not reflect actual store prices.' },
          { title: '5. Disclaimer', body: 'AutoCart is provided "as is" without warranties of any kind. Nutritional information, cost estimates, and product availability are for informational purposes only and should not be relied upon for medical or dietary decisions. Always consult a qualified healthcare professional for dietary advice.' },
          { title: '6. Limitation of Liability', body: 'AutoCart shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of the service, including but not limited to loss of data, profits, or goodwill.' },
          { title: '7. Modifications', body: 'AutoCart reserves the right to modify these terms at any time. We will provide notice of significant changes by updating the "Last updated" date above. Your continued use after changes constitutes acceptance of the new terms.' },
          { title: '8. Contact', body: 'Questions about these Terms should be sent to legal@autocart.app.' },
        ].map(section => (
          <div key={section.title} className="mb-8">
            <h2 className="font-display font-bold text-lg text-white mb-2">{section.title}</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">{section.body}</p>
          </div>
        ))}
      </main>
    </div>
  )
}
