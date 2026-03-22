// ============================================================
// Mock Grocery Provider
// Simulates a real grocery store API for development and demos.
// Powered by the full lib/inventory.ts catalog (~170 items).
// All operations run instantly with realistic fake data.
// Replace with a real provider implementation when connecting
// to Walmart, Kroger, Instacart, etc.
// ============================================================

import { CartItem, DietaryLabel, ItemCategory, RetailerProduct } from '../types'
import { GROCERY_INVENTORY, InventoryItem, matchInventoryItem, searchInventory } from '../inventory'
import {
  GroceryProvider,
  InventoryResult,
  MappedItemResult,
  MappingOptions,
  RetailerCartResult,
  SearchOptions,
} from './types'

// ─── Convert inventory item to mock RetailerProduct ───────────
function toMockProduct(item: InventoryItem): RetailerProduct {
  return {
    id: `mock-${item.id}`,
    retailerId: 'mock',
    sku: `M-${item.id}`,
    name: item.name,
    brand: item.brand,
    category: item.category as ItemCategory,
    price: item.price,
    unit: item.unit,
    inStock: item.inStock,
    nutritionInfo: item.nutrition,
    updatedAt: new Date().toISOString(),
  }
}

// Build the full mock catalog from inventory (~170 items)
const MOCK_CATALOG: RetailerProduct[] = GROCERY_INVENTORY.map(toMockProduct)

// ─── Dietary substitution maps ────────────────────────────────
const DAIRY_FREE_SWAPS: Record<string, string> = {
  'cottage cheese': 'Coconut Yogurt',
  'greek yogurt':   'Coconut Yogurt',
  'whole milk':     'Oat Milk',
  'skim milk':      'Oat Milk',
  'milk':           'Oat Milk',
  'cheese':         'Nutritional Yeast',
  'butter':         'Coconut Oil',
  'cream':          'Coconut Cream',
  'yogurt':         'Coconut Yogurt',
  'whey protein':   'Plant-Based Protein Powder',
}

const GLUTEN_FREE_SWAPS: Record<string, string> = {
  'pasta':           'Chickpea Pasta (Rotini)',
  'penne':           'Chickpea Pasta (Rotini)',
  'bread':           'Gluten-Free Bread',
  'flour tortillas': 'Corn Tortillas (6 inch)',
  'soy sauce':       'Coconut Aminos',
  'wheat flour':     'Almond Flour',
  'oats':            'Rolled Oats',
  'crackers':        'Rice Cakes (Plain)',
}

// ─── Mock Provider Implementation ────────────────────────────
export class MockGroceryProvider implements GroceryProvider {
  readonly id = 'mock' as const
  readonly name = 'Demo Store'
  readonly available = true

  async searchProducts(query: string, options?: SearchOptions): Promise<RetailerProduct[]> {
    await this._simulateLatency(100, 300)

    let results = searchInventory(query, options?.maxResults ?? 12).map(toMockProduct)
    if (options?.inStockOnly) results = results.filter(p => p.inStock)
    if (options?.maxPrice)    results = results.filter(p => p.price <= options.maxPrice!)
    if (options?.brandFilter?.length) {
      results = results.filter(p =>
        options.brandFilter!.some(b => p.brand?.toLowerCase().includes(b.toLowerCase()))
      )
    }
    return results
  }

  async mapCartItems(items: CartItem[], options?: MappingOptions): Promise<MappedItemResult[]> {
    await this._simulateLatency(300, 600)

    return items.map(item => {
      const invItem = matchInventoryItem(item.name)
      if (!invItem) {
        // Fallback: fuzzy first-word match against catalog
        const q = item.name.toLowerCase().split(' ')[0]
        const fallback = MOCK_CATALOG.find(p => p.name.toLowerCase().includes(q))
        if (!fallback) return { originalItem: item, matchedProduct: null, confidence: 0, alternatives: [] }
        return {
          originalItem: item,
          matchedProduct: fallback,
          confidence: 0.6,
          alternatives: MOCK_CATALOG.filter(p => p.id !== fallback.id && p.category === fallback.category).slice(0, 2),
        }
      }

      const matched = toMockProduct(invItem)
      const preferredBrand = options?.preferBrand?.[item.name]
      const brandMatch = preferredBrand
        ? matched.brand?.toLowerCase().includes(preferredBrand.toLowerCase())
        : true

      return {
        originalItem: item,
        matchedProduct: matched,
        confidence: brandMatch ? 0.95 : 0.75,
        alternatives: MOCK_CATALOG.filter(p => p.id !== matched.id && p.category === matched.category).slice(0, 2),
      }
    })
  }

  async applySubstitutions(items: CartItem[], rules: DietaryLabel[]): Promise<CartItem[]> {
    await this._simulateLatency(80, 180)

    return items.map(item => {
      const name = item.name.toLowerCase()
      let substitutedName = item.name

      if (rules.includes('dairy-free')) {
        for (const [original, sub] of Object.entries(DAIRY_FREE_SWAPS)) {
          if (name.includes(original)) { substitutedName = sub; break }
        }
      }
      if (rules.includes('gluten-free') && substitutedName === item.name) {
        for (const [original, sub] of Object.entries(GLUTEN_FREE_SWAPS)) {
          if (name.includes(original)) { substitutedName = sub; break }
        }
      }

      return substitutedName !== item.name
        ? { ...item, name: substitutedName, notes: `Substituted from: ${item.name}` }
        : item
    })
  }

  async createRetailerCart(items: CartItem[]): Promise<RetailerCartResult> {
    await this._simulateLatency(400, 800)

    const lineItems = items.map(item => {
      const invItem = matchInventoryItem(item.name)
      const price = invItem?.price ?? item.estimatedPrice
      return {
        sku: invItem ? `M-${invItem.id}` : `M-${item.id}`,
        name: invItem?.name ?? item.name,
        quantity: item.quantity,
        unitPrice: price,
        lineTotal: price * item.quantity,
        inStock: invItem?.inStock ?? true,
      }
    })

    return {
      success: true,
      cartId: `MOCK-CART-${Date.now()}`,
      cartUrl: undefined,
      lineItems,
      subtotal: lineItems.reduce((s, l) => s + l.lineTotal, 0),
      unavailableItems: [],
    }
  }

  async getInventoryAvailability(skus: string[]): Promise<InventoryResult[]> {
    await this._simulateLatency(100, 250)
    return skus.map(sku => {
      const product = MOCK_CATALOG.find(p => p.sku === sku)
      return {
        sku,
        inStock: product?.inStock ?? false,
        quantity: product?.inStock ? Math.floor(Math.random() * 50) + 5 : 0,
        price: product?.price,
      }
    })
  }

  async getProductBySku(sku: string): Promise<RetailerProduct | null> {
    await this._simulateLatency(80, 180)
    return MOCK_CATALOG.find(p => p.sku === sku) ?? null
  }

  private _simulateLatency(minMs: number, maxMs: number): Promise<void> {
    const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
    return new Promise(resolve => setTimeout(resolve, delay))
  }
}

export const mockProvider = new MockGroceryProvider()
