// ============================================================
// Supabase Client Configuration
// Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
// to your .env.local file to connect to a real database.
// Without credentials the app runs on mock/seed data.
// ============================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create the client if credentials are present
let supabaseClient: SupabaseClient | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

export const supabase = supabaseClient

// Utility: check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

// ─── Database query helpers (when Supabase is connected) ──────
// These functions are wrappers so the rest of the app uses them
// without knowing whether Supabase or mock data is active.

export async function fetchPublicCarts(filters?: {
  category?: string
  dietary?: string[]
  search?: string
  limit?: number
}) {
  if (!supabaseClient) return null

  let query = supabaseClient
    .from('autocarts')
    .select(`
      *,
      creator:profiles!creator_id (
        id, username, display_name, avatar_url
      )
    `)
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })

  if (filters?.category) query = query.eq('category', filters.category)
  if (filters?.search) query = query.ilike('title', `%${filters.search}%`)
  if (filters?.limit) query = query.limit(filters.limit)

  const { data, error } = await query
  if (error) { console.error('[Supabase] fetchPublicCarts error:', error); return null }
  return data
}

export async function fetchCartById(id: string) {
  if (!supabaseClient) return null

  const { data, error } = await supabaseClient
    .from('autocarts')
    .select(`
      *,
      creator:profiles!creator_id (*),
      items:cart_items (*),
      substitution_rules (*)
    `)
    .eq('id', id)
    .single()

  if (error) { console.error('[Supabase] fetchCartById error:', error); return null }
  return data
}

export async function fetchUserProfile(username: string) {
  if (!supabaseClient) return null

  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (error) { console.error('[Supabase] fetchUserProfile error:', error); return null }
  return data
}

export async function saveCartFavorite(userId: string, cartId: string) {
  if (!supabaseClient) return null

  const { data, error } = await supabaseClient
    .from('favorites')
    .insert({ user_id: userId, cart_id: cartId })
    .select()
    .single()

  if (error) { console.error('[Supabase] saveCartFavorite error:', error); return null }
  return data
}

export async function removeFavorite(userId: string, cartId: string) {
  if (!supabaseClient) return null

  const { error } = await supabaseClient
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('cart_id', cartId)

  if (error) { console.error('[Supabase] removeFavorite error:', error); return null }
  return true
}

export async function createAutoCart(cart: Record<string, unknown>) {
  if (!supabaseClient) return null

  const { data, error } = await supabaseClient
    .from('autocarts')
    .insert(cart)
    .select()
    .single()

  if (error) { console.error('[Supabase] createAutoCart error:', error); return null }
  return data
}

export async function incrementCartViews(cartId: string) {
  if (!supabaseClient) return
  await supabaseClient.rpc('increment_cart_views', { cart_id: cartId })
}
