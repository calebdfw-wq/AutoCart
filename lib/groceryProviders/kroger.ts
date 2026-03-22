// ============================================================
// Kroger Grocery Provider (Placeholder)
//
// To activate: add KROGER_CLIENT_ID and KROGER_CLIENT_SECRET
// to .env.local and implement OAuth 2.0 flow below.
//
// Kroger Developer Portal: https://developer.kroger.com/
// Supports: Product search, Cart API, Locations API
// Auth: OAuth 2.0 Client Credentials + Authorization Code
// ============================================================

import { CartItem, DietaryLabel, RetailerProduct } from '../types'
import {
  GroceryProvider,
  InventoryResult,
  MappedItemResult,
  MappingOptions,
  RetailerCartResult,
  SearchOptions,
} from './types'

const KROGER_BASE_URL = 'https://api.kroger.com/v1'
const CLIENT_ID = process.env.KROGER_CLIENT_ID
const CLIENT_SECRET = process.env.KROGER_CLIENT_SECRET

export class KrogerProvider implements GroceryProvider {
  readonly id = 'kroger' as const
  readonly name = 'Kroger'
  readonly available = Boolean(CLIENT_ID && CLIENT_SECRET)

  private _accessToken: string | null = null
  private _tokenExpiry: number = 0

  async searchProducts(query: string, options?: SearchOptions): Promise<RetailerProduct[]> {
    if (!this.available) throw new Error('Kroger provider not configured. Add KROGER_CLIENT_ID to .env.local')

    const token = await this._getAccessToken()

    // TODO: Implement Kroger product search
    // Endpoint: GET /products?filter.term={query}&filter.limit={limit}
    //
    // const response = await fetch(`${KROGER_BASE_URL}/products?filter.term=${encodeURIComponent(query)}&filter.limit=10`, {
    //   headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    // })
    // const { data } = await response.json()
    // return data.map(this._mapKrogerProduct)

    console.warn('[Kroger] searchProducts not yet implemented')
    return []
  }

  async mapCartItems(items: CartItem[], options?: MappingOptions): Promise<MappedItemResult[]> {
    if (!this.available) throw new Error('Kroger provider not configured')

    // TODO: Map each cart item to Kroger's product catalog
    // Kroger has excellent API support for product search by term
    // Consider using filter.brand and filter.productId for precise matching

    console.warn('[Kroger] mapCartItems not yet implemented')
    return items.map(item => ({ originalItem: item, matchedProduct: null, confidence: 0 }))
  }

  async applySubstitutions(items: CartItem[], rules: DietaryLabel[]): Promise<CartItem[]> {
    // TODO: Kroger supports filter.tag on their product search (e.g. 'GLUTEN_FREE', 'ORGANIC')
    // Use these tags to find substitutions matching dietary rules
    console.warn('[Kroger] applySubstitutions not yet implemented')
    return items
  }

  async createRetailerCart(items: CartItem[], userId?: string): Promise<RetailerCartResult> {
    if (!this.available) throw new Error('Kroger provider not configured')

    // Kroger has a proper Cart API!
    // Endpoint: PUT /cart/add
    // Body: { items: [{ upc, quantity }] }
    // Requires user-level access token (Authorization Code flow, not client credentials)
    //
    // Steps:
    // 1. Get user OAuth token via Authorization Code flow
    // 2. Map cart items to Kroger UPCs (via product search)
    // 3. PUT /cart/add with the UPCs
    // 4. Return the Kroger cart URL for the user to complete checkout
    //
    // TODO: Implement full Kroger cart creation

    console.warn('[Kroger] createRetailerCart not yet implemented')
    return { success: false, lineItems: [], subtotal: 0, unavailableItems: items, error: 'Not implemented' }
  }

  async getInventoryAvailability(skus: string[]): Promise<InventoryResult[]> {
    // TODO: GET /products?filter.productId={sku} for each SKU
    // Response includes inventory status and price by location
    console.warn('[Kroger] getInventoryAvailability not yet implemented')
    return skus.map(sku => ({ sku, inStock: false }))
  }

  async getProductBySku(sku: string): Promise<RetailerProduct | null> {
    console.warn('[Kroger] getProductBySku not yet implemented')
    return null
  }

  // ─── OAuth 2.0 Client Credentials Flow ───────────────────
  private async _getAccessToken(): Promise<string> {
    if (this._accessToken && Date.now() < this._tokenExpiry) {
      return this._accessToken
    }

    // TODO: Exchange client credentials for access token
    // POST https://api.kroger.com/v1/connect/oauth2/token
    // Body: grant_type=client_credentials&scope=product.compact
    //
    // const response = await fetch('https://api.kroger.com/v1/connect/oauth2/token', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    //   },
    //   body: 'grant_type=client_credentials&scope=product.compact',
    // })
    // const { access_token, expires_in } = await response.json()
    // this._accessToken = access_token
    // this._tokenExpiry = Date.now() + (expires_in * 1000) - 60000 // refresh 1 min early
    // return this._accessToken

    throw new Error('Kroger OAuth not implemented')
  }

  private _mapKrogerProduct(item: Record<string, unknown>): RetailerProduct {
    // TODO: Map Kroger product response to RetailerProduct
    const price = item.items as Array<{ price?: { regular?: number } }> | undefined
    return {
      id: String(item.productId),
      retailerId: 'kroger',
      sku: String(item.productId),
      name: String(item.description),
      brand: item.brand ? String(item.brand) : undefined,
      category: 'pantry', // derive from item.categories
      price: price?.[0]?.price?.regular ?? 0,
      imageUrl: (item.images as Array<{ url?: string }>)?.[0]?.url,
      inStock: true,
      upc: item.upc ? String(item.upc) : undefined,
      updatedAt: new Date().toISOString(),
    }
  }
}

export const krogerProvider = new KrogerProvider()
