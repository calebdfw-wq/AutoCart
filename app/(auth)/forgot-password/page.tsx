'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="w-full max-w-[380px] animate-scale-in">
      <div className="bg-surface-800 rounded-2xl border border-white/10 p-7 shadow-2xl">
        {!sent ? (
          <>
            <div className="mb-6">
              <h1 className="font-display font-extrabold text-2xl text-white mb-1.5">Reset password</h1>
              <p className="text-sm text-zinc-500">
                Enter your email and we'll send you a reset link.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={<Mail size={15} />}
                required
                autoComplete="email"
              />
              <Button type="submit" fullWidth size="lg" loading={loading}>
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={26} className="text-brand-400" />
            </div>
            <h2 className="font-display font-bold text-xl text-white mb-2">Check your inbox</h2>
            <p className="text-sm text-zinc-500 leading-relaxed mb-5">
              We sent a reset link to <span className="text-white font-medium">{email}</span>.
              Check your spam folder if you don't see it.
            </p>
            <Button variant="secondary" size="md" fullWidth onClick={() => setSent(false)}>
              Resend Email
            </Button>
          </div>
        )}
      </div>

      <div className="text-center mt-5">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
