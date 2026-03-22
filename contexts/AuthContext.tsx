'use client'

// ============================================================
// Auth Context
// Provides authentication state throughout the app.
// Currently uses localStorage-based mock auth for demo purposes.
// Swap the signIn/signUp/signOut implementations for real
// Supabase auth calls when you add credentials to .env.local
// ============================================================

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { User } from '@/lib/types'
import { DEMO_USERS } from '@/lib/seed-data'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string, displayName: string, userType: 'user' | 'creator') => Promise<void>
  signOut: () => void
  updateProfile: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'autocart_auth_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // Ignore parse errors
    } finally {
      setLoading(false)
    }
  }, [])

  const signIn = useCallback(async (email: string, _password: string): Promise<void> => {
    setLoading(true)
    // Simulate API call delay
    await new Promise(r => setTimeout(r, 800))

    // For demo: match any demo user by email, or create a session for demo@autocart.app
    const match = DEMO_USERS.find(u => u.email === email) ?? DEMO_USERS[DEMO_USERS.length - 1]
    const sessionUser = { ...match, email }

    setUser(sessionUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser))
    setLoading(false)

    // ── Swap for real Supabase auth ────────────────────────
    // import { supabase } from '@/lib/supabase'
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    // if (error) throw error
    // const profile = await fetchUserProfile(data.user.id)
    // setUser(profile)
  }, [])

  const signUp = useCallback(async (
    email: string,
    _password: string,
    username: string,
    displayName: string,
    userType: 'user' | 'creator'
  ): Promise<void> => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      username,
      displayName,
      bio: '',
      isPublic: true,
      userType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    setLoading(false)

    // ── Swap for real Supabase auth ────────────────────────
    // const { data, error } = await supabase.auth.signUp({
    //   email, password,
    //   options: { data: { username, display_name: displayName, user_type: userType } }
    // })
    // if (error) throw error
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    // supabase?.auth.signOut()
  }, [])

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev
      const updated = { ...prev, ...updates, updatedAt: new Date().toISOString() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
