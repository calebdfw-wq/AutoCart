import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CartCategory, DietaryLabel, PrepGoal, RetailerId } from './types'

// ─── Tailwind class merger ────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Currency formatting ──────────────────────────────────────
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

// ─── Date formatting ─────────────────────────────────────────
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function timeAgo(dateString: string): string {
  const now = Date.now()
  const past = new Date(dateString).getTime()
  const diff = now - past

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (weeks < 5) return `${weeks}w ago`
  if (months < 12) return `${months}mo ago`
  return formatDate(dateString)
}

// ─── Number formatting ────────────────────────────────────────
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

// ─── Category labels ─────────────────────────────────────────
export const CATEGORY_CONFIG: Record<CartCategory, { label: string; emoji: string; color: string }> = {
  'meal-prep':  { label: 'Meal Prep',    emoji: '🥗', color: 'text-green-400 bg-green-400/10' },
  'bulking':    { label: 'Bulking',      emoji: '💪', color: 'text-blue-400 bg-blue-400/10' },
  'cutting':    { label: 'Cutting',      emoji: '🔥', color: 'text-orange-400 bg-orange-400/10' },
  'family':     { label: 'Family',       emoji: '👨‍👩‍👧‍👦', color: 'text-purple-400 bg-purple-400/10' },
  'budget':     { label: 'Budget',       emoji: '💰', color: 'text-yellow-400 bg-yellow-400/10' },
  'athlete':    { label: 'Athlete',      emoji: '⚡', color: 'text-cyan-400 bg-cyan-400/10' },
  'vegan':      { label: 'Vegan',        emoji: '🌱', color: 'text-emerald-400 bg-emerald-400/10' },
  'keto':       { label: 'Keto',         emoji: '🥑', color: 'text-lime-400 bg-lime-400/10' },
  'quick-prep': { label: 'Quick Prep',   emoji: '⚡', color: 'text-amber-400 bg-amber-400/10' },
  'college':    { label: 'College',      emoji: '🎓', color: 'text-pink-400 bg-pink-400/10' },
  'gourmet':    { label: 'Gourmet',      emoji: '👨‍🍳', color: 'text-rose-400 bg-rose-400/10' },
  'snacks':     { label: 'Snacks',       emoji: '🍎', color: 'text-red-400 bg-red-400/10' },
}

// ─── Dietary label config ─────────────────────────────────────
export const DIETARY_CONFIG: Record<DietaryLabel, { label: string; emoji: string }> = {
  'gluten-free':  { label: 'Gluten-Free', emoji: '🌾' },
  'dairy-free':   { label: 'Dairy-Free',  emoji: '🥛' },
  'nut-free':     { label: 'Nut-Free',    emoji: '🥜' },
  'vegan':        { label: 'Vegan',       emoji: '🌱' },
  'vegetarian':   { label: 'Vegetarian',  emoji: '🥦' },
  'keto':         { label: 'Keto',        emoji: '🥑' },
  'paleo':        { label: 'Paleo',       emoji: '🥩' },
  'high-protein': { label: 'High Protein', emoji: '💪' },
  'low-carb':     { label: 'Low Carb',    emoji: '🍞' },
  'low-calorie':  { label: 'Low Cal',     emoji: '⚖️' },
  'low-sodium':   { label: 'Low Sodium',  emoji: '🧂' },
  'whole30':      { label: 'Whole30',     emoji: '✅' },
  'organic':      { label: 'Organic',     emoji: '🌿' },
}

// ─── Prep goal config ─────────────────────────────────────────
export const PREP_GOAL_CONFIG: Record<PrepGoal, { label: string; description: string }> = {
  'bulking':          { label: 'Bulking',       description: 'High calorie, high protein to gain mass' },
  'cutting':          { label: 'Cutting',       description: 'Calorie deficit, lean protein to lose fat' },
  'maintenance':      { label: 'Maintenance',   description: 'Balanced macros to maintain weight' },
  'family-meal-prep': { label: 'Family Prep',   description: 'Scaled for a family of 4+' },
  'budget':           { label: 'Budget',         description: 'Maximum nutrition per dollar' },
  'performance':      { label: 'Performance',   description: 'Optimized for athletic performance' },
  'general':          { label: 'General',        description: 'General healthy eating' },
}

// ─── Retailer config ─────────────────────────────────────────
export const RETAILER_CONFIG: Record<RetailerId, { name: string; logo: string; color: string; available: boolean }> = {
  'walmart':      { name: 'Walmart',       logo: '🛒', color: 'text-blue-500',   available: false },
  'kroger':       { name: 'Kroger',        logo: '🛍️', color: 'text-red-500',    available: false },
  'instacart':    { name: 'Instacart',     logo: '🥕', color: 'text-orange-500', available: false },
  'heb':          { name: 'H-E-B',         logo: '🏪', color: 'text-red-600',    available: true },
  'target':       { name: 'Target',        logo: '🎯', color: 'text-red-500',    available: false },
  'amazon-fresh': { name: 'Amazon Fresh',  logo: '📦', color: 'text-cyan-500',   available: false },
  'whole-foods':  { name: 'Whole Foods',   logo: '🌿', color: 'text-green-600',  available: false },
  'mock':         { name: 'Demo Store',    logo: '🛒', color: 'text-brand-400',  available: true },
}

// ─── Generate a simple avatar URL ────────────────────────────
export function getAvatarUrl(username: string, size = 40): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${username}&size=${size}&backgroundColor=0D1117&textColor=4ade80`
}

// ─── Truncate text ────────────────────────────────────────────
export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + '…'
}

// ─── Calculate cart totals ────────────────────────────────────
export function calculateCartTotal(items: { estimatedPrice: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.estimatedPrice * item.quantity, 0)
}

export function calculateCostPerMeal(totalCost: number, servings: number): number {
  if (servings <= 0) return totalCost
  return totalCost / servings
}

// ─── Slugify ──────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
