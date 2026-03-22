// ============================================================
// Instacart Grocery Provider (Placeholder)
//
// Instacart Connect API allows creating shoppable links that
// open a pre-filled Instacart cart for the user.
// Apply for access: https://www.instacart.com/business/instacart-connect
//
// Add INSTACART_API_KEY to .env.local to activate.
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

const INSTACART_BASE_URL = 'https://connect.instacart.com'
const API_KEY = process.env.INSTACART_API_KEY

export class InstacartProvider implements GroceryProvider {
  readonly id = 'instacart' as const
  readonly name = 'Instacart'
  readonly available = Boolean(API_KEY)

  async searchProducts(query: string, _options?: SearchOptions): Promise<RetailerProduct[]> {
    if (!this.available) throw new Error('Instacart provider not configured. Add INSTACART_API_KEY to .env.local')

    // TODO: Instacart Connect offers product catalog search
    // POST /v1/products/search
    // Body: { query, retailer_key, ... }
    //
    // Note: Instacart's public API is limited; most product access
    // requires the Instacart Connect enterprise partnership.

    console.warn('[Instacart] searchProducts not yet implemented')
    return []
  }

  async mapCartItems(items: CartItem[], _options?: MappingOptions): Promise<MappedItemResult[]> {
    console.warn('[Instacart] mapCartItems not yet implemented')
    return items.map(item => ({ originalItem: item, matchedProduct: null, confidence: 0 }))
  }

  async applySubstitutions(items: CartItem[], _rules: DietaryLabel[]): Promise<CartItem[]> {
    // Instacart allows item-level substitution preferences in their cart creation API
    // Each line item can have an "instructions" field for the shopper
    console.warn('[Instacart] applySubstitutions not yet implemented')
    return items
  }

  async createRetailerCart(items: CartItem[], _userId?: string): Promise<RetailerCartResult> {
    if (!this.available) throw new Error('Instacart provider not configured')

    // Instacart Connect approach:
    // POST /v1/carts
    // Body: {
    //   line_items: [{ name, quantity, unit, special_instructions }],
    //   retailer_key: 'kroger', // or other supported retailer
    // }
    // Returns a shareable cart_url that opens Instacart with items pre-filled
    //
    // The user can then choose their preferred store within Instacart,
    // which is a key advantage over single-retailer integrations.
    //
    // TODO:
    // const response = await fetch(`${INSTACART_BASE_URL}/v1/carts`, {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     line_items: items.map(item => ({
    //       name: item.name,
    //       quantity: item.quantity,
    //       unit: item.unit,
    //     })),
    //   }),
    // })
    // const { cart_url } = await response.json()
    // return { success: true, cartUrl: cart_url, lineItems: [], subtotal: 0, unavailableItems: [] }

    console.warn('[Instacart] createRetailerCart not yet implemented')
    return { success: false, lineItems: [], subtotal: 0, unavailableItems: items, error: 'Not implemented' }
  }

  async getInventoryAvailability(_skus: string[]): Promise<InventoryResult[]> {
    // Instacart does not expose real-time inventory publicly
    console.warn('[Instacart] getInventoryAvailability: Not supported by Instacart Connect')
    return _skus.map(sku => ({ sku, inStock: true })) // Optimistic default
  }

  async getProductBySku(_sku: string): Promise<RetailerProduct | null> {
    console.warn('[Instacart] getProductBySku not yet implemented')
    return null
  }
}

export const instacartProvider = new InstacartProvider()
