// ============================================================
// Grocery Provider — Common Interface Types
// All grocery provider integrations must implement the
// GroceryProvider interface. This ensures a single, consistent
// API surface regardless of which retailer is connected.
// ============================================================

import { CartItem, DietaryLabel, GeneratedCartResult, RetailerId, RetailerProduct } from '../types'

// ─── Core provider interface ──────────────────────────────────
// Every retailer (Walmart, Kroger, Instacart, etc.) must implement this.
export interface GroceryProvider {
  readonly id: RetailerId
  readonly name: string
  readonly logoUrl?: string
  readonly available: boolean  // Is this provider currently connected?

  /** Search for a product by keyword across this retailer's catalog */
  searchProducts(query: string, options?: SearchOptions): Promise<RetailerProduct[]>

  /** Map an array of cart items to this retailer's product catalog */
  mapCartItems(items: CartItem[], options?: MappingOptions): Promise<MappedItemResult[]>

  /** Apply substitution rules (e.g. dairy-free, gluten-free) to items */
  applySubstitutions(items: CartItem[], rules: DietaryLabel[]): Promise<CartItem[]>

  /** Generate a retailer cart and optionally return a deep link */
  createRetailerCart(items: CartItem[], userId?: string): Promise<RetailerCartResult>

  /** Check live inventory availability for a list of SKUs */
  getInventoryAvailability(skus: string[]): Promise<InventoryResult[]>

  /** Get full product details for a specific SKU */
  getProductBySku(sku: string): Promise<RetailerProduct | null>
}

// ─── Search ───────────────────────────────────────────────────
export interface SearchOptions {
  category?: string
  maxResults?: number
  inStockOnly?: boolean
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'rating'
  brandFilter?: string[]
  maxPrice?: number
}

export interface SearchResult {
  products: RetailerProduct[]
  totalResults: number
  query: string
  retailerId: RetailerId
}

// ─── Item Mapping ─────────────────────────────────────────────
export interface MappingOptions {
  preferBrand?: Record<string, string>    // itemName → preferredBrand
  allowSubstitutions?: boolean
  dietaryRestrictions?: DietaryLabel[]
}

export interface MappedItemResult {
  originalItem: CartItem
  matchedProduct: RetailerProduct | null  // null = not found
  confidence: number                       // 0-1 match confidence score
  alternatives?: RetailerProduct[]        // fallback options
  substitutionApplied?: string           // which substitution rule fired
}

// ─── Cart Creation ────────────────────────────────────────────
export interface RetailerCartResult {
  success: boolean
  cartId?: string            // retailer's internal cart ID
  cartUrl?: string           // deep link to retailer's cart page
  lineItems: RetailerLineItem[]
  subtotal: number
  unavailableItems: CartItem[]
  expiresAt?: string         // when the cart link expires
  error?: string
}

export interface RetailerLineItem {
  sku: string
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
  imageUrl?: string
  inStock: boolean
  searchUrl?: string  // per-item retailer search URL (e.g. for H-E-B link integration)
}

// ─── Inventory ────────────────────────────────────────────────
export interface InventoryResult {
  sku: string
  inStock: boolean
  quantity?: number
  nextAvailable?: string   // date string if out of stock
  storeId?: string
  price?: number           // current price (may differ from catalog)
}

// ─── Auth / Credentials ───────────────────────────────────────
export interface ProviderCredentials {
  apiKey?: string
  apiSecret?: string
  clientId?: string
  clientSecret?: string
  accessToken?: string
  refreshToken?: string
  expiresAt?: string
}

// ─── Provider registry entry ─────────────────────────────────
export interface ProviderConfig {
  id: RetailerId
  name: string
  description: string
  logoUrl: string
  websiteUrl: string
  available: boolean
  comingSoon: boolean
  features: {
    search: boolean
    liveInventory: boolean
    cartGeneration: boolean
    deepLink: boolean
    substitutions: boolean
  }
  regions?: string[]   // US states or regions where available
  authRequired: boolean
}

// ─── Provider registry ────────────────────────────────────────
export const PROVIDER_REGISTRY: Record<RetailerId, ProviderConfig> = {
  mock: {
    id: 'mock',
    name: 'Demo Store',
    description: 'Simulated store for development and demos',
    logoUrl: '',
    websiteUrl: '#',
    available: true,
    comingSoon: false,
    features: { search: true, liveInventory: true, cartGeneration: true, deepLink: false, substitutions: true },
    authRequired: false,
  },
  walmart: {
    id: 'walmart',
    name: 'Walmart',
    description: "America's largest grocery retailer with competitive pricing",
    logoUrl: '/logos/walmart.svg',
    websiteUrl: 'https://walmart.com',
    available: false,
    comingSoon: true,
    features: { search: true, liveInventory: true, cartGeneration: true, deepLink: true, substitutions: true },
    regions: ['US'],
    authRequired: true,
  },
  kroger: {
    id: 'kroger',
    name: 'Kroger',
    description: "Nation's largest supermarket chain with store pickup & delivery",
    logoUrl: '/logos/kroger.svg',
    websiteUrl: 'https://kroger.com',
    available: false,
    comingSoon: true,
    features: { search: true, liveInventory: true, cartGeneration: true, deepLink: true, substitutions: true },
    regions: ['US'],
    authRequired: true,
  },
  instacart: {
    id: 'instacart',
    name: 'Instacart',
    description: 'Same-day delivery from multiple local stores',
    logoUrl: '/logos/instacart.svg',
    websiteUrl: 'https://instacart.com',
    available: false,
    comingSoon: true,
    features: { search: true, liveInventory: false, cartGeneration: true, deepLink: true, substitutions: false },
    regions: ['US', 'CA'],
    authRequired: true,
  },
  heb: {
    id: 'heb',
    name: 'H-E-B',
    description: 'Texas-based grocer — shop via item search links on heb.com',
    logoUrl: '/logos/heb.svg',
    websiteUrl: 'https://heb.com',
    available: true,
    comingSoon: false,
    features: { search: true, liveInventory: false, cartGeneration: false, deepLink: true, substitutions: true },
    regions: ['TX'],
    authRequired: false,
  },
  target: {
    id: 'target',
    name: 'Target',
    description: 'One-stop shop with Drive Up and same-day delivery options',
    logoUrl: '/logos/target.svg',
    websiteUrl: 'https://target.com',
    available: false,
    comingSoon: true,
    features: { search: true, liveInventory: false, cartGeneration: false, deepLink: false, substitutions: false },
    regions: ['US'],
    authRequired: false,
  },
  'amazon-fresh': {
    id: 'amazon-fresh',
    name: 'Amazon Fresh',
    description: "Amazon's ultra-fast grocery delivery for Prime members",
    logoUrl: '/logos/amazon.svg',
    websiteUrl: 'https://amazon.com/fresh',
    available: false,
    comingSoon: true,
    features: { search: true, liveInventory: true, cartGeneration: true, deepLink: true, substitutions: false },
    regions: ['US'],
    authRequired: true,
  },
  'whole-foods': {
    id: 'whole-foods',
    name: 'Whole Foods',
    description: 'Premium organic and specialty grocery via Amazon',
    logoUrl: '/logos/wholefoods.svg',
    websiteUrl: 'https://wholefoodsmarket.com',
    available: false,
    comingSoon: true,
    features: { search: true, liveInventory: false, cartGeneration: false, deepLink: false, substitutions: false },
    regions: ['US'],
    authRequired: true,
  },
}
