'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    try {
      await signIn(email, password)
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (err) {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    try {
      await signIn('macromaster@demo.com', 'demo')
      toast.success('Signed in as MacroMaster 👋')
      router.push('/dashboard')
    } catch {
      toast.error('Demo login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[400px] animate-scale-in">
      {/* Card */}
      <div className="bg-surface-800 rounded-2xl border border-white/10 p-7 shadow-2xl">
        <div className="mb-7">
          <h1 className="font-display font-extrabold text-2xl text-white mb-1.5">Welcome back</h1>
          <p className="text-sm text-zinc-500">Sign in to your AutoCart account</p>
        </div>

        {/* Demo login banner */}
        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full mb-5 p-3 rounded-xl bg-brand-500/10 border border-brand-500/25 border-dashed text-sm text-brand-400 hover:bg-brand-500/15 transition-colors text-left group"
        >
          <span className="font-semibold">Try Demo Mode</span>
          <span className="text-zinc-500 ml-2 group-hover:text-zinc-400 transition-colors">Sign in as @macromaster →</span>
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-xs text-zinc-600">or sign in with email</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            leftIcon={<Mail size={15} />}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            leftIcon={<Lock size={15} />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
            required
            autoComplete="current-password"
          />

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-zinc-500 hover:text-white transition-colors">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Sign In
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-zinc-500 mt-5">
        Don't have an account?{' '}
        <Link href="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Sign up free
        </Link>
      </p>
    </div>
  )
}
