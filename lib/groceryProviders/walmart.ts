// ============================================================
// Walmart Grocery Provider (Placeholder)
//
// To activate: add WALMART_API_KEY and WALMART_API_SECRET to
// your .env.local and replace the TODO stubs below with
// real Walmart Open API calls.
//
// Walmart API docs: https://developer.walmart.com/
// Affiliate product search: https://developer.walmart.com/api/us/affiliate/items
// ============================================================

import { CartItem, DietaryLabel, ItemCategory, RetailerProduct } from '../types'
import {
  GroceryProvider,
  InventoryResult,
  MappedItemResult,
  MappingOptions,
  RetailerCartResult,
  SearchOptions,
} from './types'

const WALMART_BASE_URL = 'https://developer.api.walmart.com/api-proxy/service'
const API_KEY = process.env.WALMART_API_KEY
const API_SECRET = process.env.WALMART_API_SECRET

export class WalmartProvider implements GroceryProvider {
  readonly id = 'walmart' as const
  readonly name = 'Walmart'
  readonly available = Boolean(API_KEY && API_SECRET)

  async searchProducts(query: string, options?: SearchOptions): Promise<RetailerProduct[]> {
    if (!this.available) throw new Error('Walmart provider not configured. Add WALMART_API_KEY to .env.local')

    // TODO: Implement Walmart product search
    // Endpoint: GET /affil/product/v2/search?query={query}&numItems={limit}
    // Headers: WM_SEC.KEY_VERSION, WM_CONSUMER.ID, WM_CONSUMER.INTIMESTAMP, WM_SEC.AUTH_SIGNATURE
    //
    // const response = await fetch(`${WALMART_BASE_URL}/affil/product/v2/search?query=${encodeURIComponent(query)}`, {
    //   headers: this._buildAuthHeaders(),
    // })
    // const data = await response.json()
    // return data.items.map(this._mapWalmartProduct)

    console.warn('[Walmart] searchProducts not yet implemented')
    return []
  }

  async mapCartItems(items: CartItem[], options?: MappingOptions): Promise<MappedItemResult[]> {
    if (!this.available) throw new Error('Walmart provider not configured')

    // TODO: For each item, call searchProducts and pick the best match
    // Consider brand preferences from options.preferBrand
    // Score matches by name similarity + brand + price

    console.warn('[Walmart] mapCartItems not yet implemented')
    return items.map(item => ({ originalItem: item, matchedProduct: null, confidence: 0 }))
  }

  async applySubstitutions(items: CartItem[], rules: DietaryLabel[]): Promise<CartItem[]> {
    // TODO: Implement Walmart-specific dietary substitutions
    // Could query Walmart's "dietary" filter on their search API
    console.warn('[Walmart] applySubstitutions not yet implemented')
    return items
  }

  async createRetailerCart(items: CartItem[], userId?: string): Promise<RetailerCartResult> {
    if (!this.available) throw new Error('Walmart provider not configured')

    // TODO: Walmart does not currently offer a public cart-creation API.
    // The best current approach for Walmart is:
    // 1. Generate affiliate search links for each item
    // 2. Return a list of deep links for user to manually add
    // OR: Use Walmart's Partner APIs (invite-only) for cart creation.
    //
    // Future implementation:
    // const cartItems = await this.mapCartItems(items)
    // const affiliateLinks = cartItems.map(ci => buildWalmartAffiliateLink(ci.matchedProduct?.sku))
    // return { success: true, cartUrl: affiliateLinks[0], lineItems: [], subtotal: 0, unavailableItems: [] }

    console.warn('[Walmart] createRetailerCart not yet implemented')
    return { success: false, lineItems: [], subtotal: 0, unavailableItems: items, error: 'Not implemented' }
  }

  async getInventoryAvailability(skus: string[]): Promise<InventoryResult[]> {
    // TODO: Walmart's API provides item lookup that includes availability
    // Endpoint: GET /affil/product/v2/items?ids={sku1,sku2}
    console.warn('[Walmart] getInventoryAvailability not yet implemented')
    return skus.map(sku => ({ sku, inStock: false }))
  }

  async getProductBySku(sku: string): Promise<RetailerProduct | null> {
    // TODO: GET /affil/product/v2/items?ids={sku}
    console.warn('[Walmart] getProductBySku not yet implemented')
    return null
  }

  // ─── Private helpers (implement when connecting) ───────────
  private _buildAuthHeaders(): Record<string, string> {
    // Walmart uses a signature-based auth scheme.
    // See: https://developer.walmart.com/doc/us/mp/us-mp-auth/
    // TODO: implement HMAC-SHA256 signing with timestamp + consumer ID
    return {
      'WM_CONSUMER.ID': API_KEY ?? '',
      'WM_SEC.KEY_VERSION': '1',
      'WM_CONSUMER.INTIMESTAMP': String(Date.now()),
      'WM_SEC.AUTH_SIGNATURE': 'TODO: implement signing',
      'Accept': 'application/json',
    }
  }

  private _mapWalmartProduct(item: Record<string, unknown>): RetailerProduct {
    // TODO: Map Walmart API response shape to RetailerProduct
    return {
      id: String(item.itemId),
      retailerId: 'walmart',
      sku: String(item.itemId),
      name: String(item.name),
      brand: item.brandName ? String(item.brandName) : undefined,
      category: String(item.categoryNode ?? 'pantry') as ItemCategory,
      price: Number(item.salePrice ?? item.msrp ?? 0),
      unit: String(item.upc ?? ''),
      imageUrl: item.thumbnailImage ? String(item.thumbnailImage) : undefined,
      inStock: item.stock === 'Available',
      upc: item.upc ? String(item.upc) : undefined,
      updatedAt: new Date().toISOString(),
    }
  }
}

export const walmartProvider = new WalmartProvider()
