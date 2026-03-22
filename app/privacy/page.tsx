import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

export const metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
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
        <h1 className="font-display font-extrabold text-4xl text-white mb-2">Privacy Policy</h1>
        <p className="text-zinc-500 text-sm mb-10">Last updated: March 2026</p>
        {[
          { title: 'Information We Collect', body: 'We collect information you provide directly (email, username, profile info), information generated through your use of the service (carts created, items saved, preferences), and standard server logs (IP address, browser type, pages visited).' },
          { title: 'How We Use Your Information', body: 'We use collected information to operate and improve AutoCart, personalize your experience, send relevant notifications (with your consent), analyze usage patterns, and prevent fraud or abuse.' },
          { title: 'Information Sharing', body: 'We do not sell your personal information. We may share information with service providers who assist us in operating the platform (hosting, analytics, email delivery) under strict confidentiality agreements. Public AutoCarts and public profile information are visible to all users by design.' },
          { title: 'Grocery Store Links', body: 'When you use the "Generate Cart" feature, we may pass item names to third-party grocery retailer websites (e.g. heb.com, walmart.com) via standard URL parameters. These sites have their own privacy policies. We do not share your personal account information with any retailer.' },
          { title: 'Data Retention', body: 'We retain your account information as long as your account is active. You may delete your account at any time from Settings, which will remove your personal data within 30 days. Public carts you created may be retained in anonymized form.' },
          { title: 'Cookies', body: 'We use essential cookies for authentication and preferences. We do not use third-party advertising cookies. You can disable cookies in your browser settings, but this may affect functionality.' },
          { title: 'Security', body: 'We implement industry-standard security measures including encryption in transit (HTTPS) and at rest. However, no system is 100% secure. Please use a strong, unique password for your AutoCart account.' },
          { title: 'Contact', body: 'Privacy questions or requests should be sent to privacy@autocart.app. We will respond within 30 days.' },
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
