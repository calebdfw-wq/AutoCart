'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, User, Eye, EyeOff, Zap, ShoppingBag } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

type UserTypeOption = { value: 'user' | 'creator'; label: string; description: string; icon: React.ElementType; color: string }

const USER_TYPES: UserTypeOption[] = [
  {
    value: 'user',
    label: 'Shopper',
    description: 'Browse and use carts from creators',
    icon: ShoppingBag,
    color: 'border-blue-500/30 text-blue-400 bg-blue-500/8',
  },
  {
    value: 'creator',
    label: 'Creator',
    description: 'Build and publish carts publicly',
    icon: Zap,
    color: 'border-brand-500/30 text-brand-400 bg-brand-500/8',
  },
]

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const defaultType = searchParams.get('type') === 'creator' ? 'creator' : 'user'

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<'user' | 'creator'>(defaultType)
  const [loading, setLoading] = useState(false)
  const [usernameError, setUsernameError] = useState('')
  const { signUp } = useAuth()
  const router = useRouter()

  const validateUsername = (val: string) => {
    if (val.length < 3) return 'Username must be at least 3 characters'
    if (!/^[a-z0-9_]+$/.test(val)) return 'Only lowercase letters, numbers, and underscores'
    return ''
  }

  const handleUsernameChange = (val: string) => {
    setUsername(val)
    setUsernameError(validateUsername(val))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validateUsername(username)
    if (err) { setUsernameError(err); return }
    if (!email || !password || !displayName) return

    setLoading(true)
    try {
      await signUp(email, password, username, displayName, userType)
      toast.success('Account created! Welcome to AutoCart 🎉')
      router.push('/dashboard')
    } catch (err) {
      toast.error('Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[420px] animate-scale-in">
      <div className="bg-surface-800 rounded-2xl border border-white/10 p-7 shadow-2xl">
        <div className="mb-6">
          <h1 className="font-display font-extrabold text-2xl text-white mb-1.5">Create your account</h1>
          <p className="text-sm text-zinc-500">Join AutoCart — free forever for shoppers</p>
        </div>

        {/* Account type selector */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-zinc-300 mb-2">I want to…</label>
          <div className="grid grid-cols-2 gap-2">
            {USER_TYPES.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => setUserType(type.value)}
                className={cn(
                  'flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all duration-150',
                  userType === type.value
                    ? type.color + ' border-opacity-100'
                    : 'bg-surface-700/50 border-white/8 text-zinc-400 hover:border-white/20',
                )}
              >
                <type.icon size={16} />
                <span className="text-sm font-semibold leading-tight">{type.label}</span>
                <span className="text-[11px] text-zinc-500 leading-relaxed">{type.description}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="Display Name"
            placeholder="Marco Ramirez"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            leftIcon={<User size={15} />}
            required
            autoComplete="name"
          />

          <Input
            label="Username"
            placeholder="macromaster"
            value={username}
            onChange={e => handleUsernameChange(e.target.value.toLowerCase())}
            error={usernameError}
            hint="Only lowercase letters, numbers, underscores"
            leftIcon={<span className="text-zinc-600 text-sm font-medium">@</span>}
            required
            autoComplete="username"
          />

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
            placeholder="Create a password (min 8 chars)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            leftIcon={<Lock size={15} />}
            rightElement={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-zinc-300 transition-colors">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
            required
            minLength={8}
            autoComplete="new-password"
          />

          <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
            Create Account
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-zinc-500 mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
