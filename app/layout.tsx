import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

// ─── Fonts ────────────────────────────────────────────────────
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'AutoCart — Build & Share Automatic Grocery Carts',
    template: '%s | AutoCart',
  },
  description:
    'AutoCart lets creators, meal prep influencers, and everyday shoppers build and share automatic grocery carts — with one-click generation, dietary substitutions, and future grocery store integrations.',
  keywords: ['grocery cart', 'meal prep', 'macros', 'fitness nutrition', 'grocery list', 'meal planning'],
  openGraph: {
    type: 'website',
    title: 'AutoCart — Build & Share Automatic Grocery Carts',
    description: 'One click to build your perfect grocery cart. Meal prep made simple.',
    siteName: 'AutoCart',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoCart',
    description: 'Build and share automatic grocery carts for any goal.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="bg-surface-950 text-white font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#131418',
                color: '#F9FAFB',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: 'var(--font-dm-sans)',
              },
              success: {
                iconTheme: { primary: '#4ade80', secondary: '#131418' },
              },
              error: {
                iconTheme: { primary: '#f87171', secondary: '#131418' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
