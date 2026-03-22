// ============================================================
// H-E-B Grocery Provider — Link-Based Integration
//
// H-E-B does not offer a public API, so this provider uses
// a local inventory catalog + direct heb.com/search URLs.
// Users click per-item links to shop on the H-E-B website
// or app. No API keys required.
//
// How it works:
//   1. Cart items are matched against lib/inventory.ts (~170 items)
//   2. Each matched item gets a pre-built heb.com search URL
//   3. Unmatched items fall back to a generic heb.com/search
//   4. Results include item-level links for manual shopping
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

// ─── Dietary substitution maps ────────────────────────────────
const DAIRY_FREE_SWAPS: Record<string, string> = {
  'cottage cheese': 'Coconut Yogurt',
  'greek yogurt':   'Coconut Yogurt',
  'whole milk':     'Oat Milk',
  'skim milk':      'Oat Milk',
  '2% milk':        'Oat Milk',
  'milk':           'Oat Milk',
  'cheese':         'Nutritional Yeast',
  'butter':         'Coconut Oil',
  'cream':          'Coconut Cream',
  'sour cream':     'Coconut Yogurt',
  'yogurt':         'Coconut Yogurt',
  'whey protein':   'Plant-Based Protein Powder',
}

const GLUTEN_FREE_SWAPS: Record<string, string> = {
  'pasta':           'Chickpea Pasta (Rotini)',
  'penne':           'Chickpea Pasta (Rotini)',
  'rotini':          'Chickpea Pasta (Rotini)',
  'spaghetti':       'Gluten-Free Pasta',
  'noodles':         'Gluten-Free Pasta',
  'bread':           'Gluten-Free Bread',
  'tortillas':       'Corn Tortillas (6 inch)',
  'flour tortillas': 'Corn Tortillas (6 inch)',
  'soy sauce':       'Coconut Aminos',
  'wheat flour':     'Almond Flour',
  'all-purpose flour': 'Almond Flour',
  'crackers':        'Rice Cakes (Plain)',
  'oats':            'Rolled Oats',        // Quaker is not certified GF; swap in real use
}

const VEGAN_SWAPS: Record<string, string> = {
  'chicken breast':  'Extra Firm Tofu',
  'chicken thighs':  'Extra Firm Tofu',
  'ground beef':     'Tempeh',
  'ground turkey':   'Tempeh',
  'beef':            'Tempeh',
  'pork':            'Tempeh',
  'salmon':          'Extra Firm Tofu',
  'tuna':            'Chickpeas (Canned)',
  'eggs':            'Extra Firm Tofu',
  'egg whites':      'Extra Firm Tofu',
  'whey protein':    'Plant-Based Protein Powder',
}

// ─── Helper: InventoryItem → RetailerProduct ─────────────────
function toRetailerProduct(item: InventoryItem): RetailerProduct {
  return {
    id: `heb-${item.id}`,
    retailerId: 'heb',
    sku: item.id,
    name: item.name,
    brand: item.brand,
    category: item.category as ItemCategory,
    price: item.price,
    unit: item.unit,
    productUrl: item.hebSearchUrl,
    inStock: item.inStock,
    nutritionInfo: item.nutrition,
    updatedAt: new Date().toISOString(),
  }
}

// ─── H-E-B Provider Implementation ───────────────────────────
export class HEBProvider implements GroceryProvider {
  readonly id = 'heb' as const
  readonly name = 'H-E-B'
  readonly available = true

  // Search the local inventory by keyword
  async searchProducts(query: string, options?: SearchOptions): Promise<RetailerProduct[]> {
    let results = searchInventory(query, options?.maxResults ?? 12)
    if (options?.inStockOnly) results = results.filter(p => p.inStock)
    if (options?.maxPrice)    results = results.filter(p => p.price <= options.maxPrice!)
    if (options?.brandFilter?.length) {
      results = results.filter(p =>
        options.brandFilter!.some(b => p.brand?.toLowerCase().includes(b.toLowerCase()))
      )
    }
    return results.map(toRetailerProduct)
  }

  // Match cart items against local inventory
  async mapCartItems(items: CartItem[], _options?: MappingOptions): Promise<MappedItemResult[]> {
    return items.map(item => {
      const matched = matchInventoryItem(item.name)
      if (!matched) {
        return { originalItem: item, matchedProduct: null, confidence: 0, alternatives: [] }
      }
      const alternatives = GROCERY_INVENTORY
        .filter(i => i.id !== matched.id && i.category === matched.category)
        .slice(0, 2)
        .map(toRetailerProduct)

      return {
        originalItem: item,
        matchedProduct: toRetailerProduct(matched),
        confidence: 0.85,
        alternatives,
      }
    })
  }

  // Apply dietary substitution rules
  async applySubstitutions(items: CartItem[], rules: DietaryLabel[]): Promise<CartItem[]> {
    return items.map(item => {
      const name = item.name.toLowerCase()
      let substitutedName = item.name

      if (rules.includes('vegan')) {
        for (const [original, sub] of Object.entries(VEGAN_SWAPS)) {
          if (name.includes(original)) { substitutedName = sub; break }
        }
      }
      if (rules.includes('dairy-free') && substitutedName === item.name) {
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

  // Build a cart result with per-item H-E-B search links
  async createRetailerCart(items: CartItem[]): Promise<RetailerCartResult> {
    const lineItems = items.map(item => {
      const matched = matchInventoryItem(item.name)
      const fallback = `https://www.heb.com/search/?q=${encodeURIComponent(item.name)}`
      return {
        sku: matched?.id ?? item.id,
        name: matched?.name ?? item.name,
        quantity: item.quantity,
        unitPrice: matched?.price ?? item.estimatedPrice,
        lineTotal: (matched?.price ?? item.estimatedPrice) * item.quantity,
        inStock: matched?.inStock ?? true,
        searchUrl: matched?.hebSearchUrl ?? fallback,
      }
    })

    return {
      success: true,
      cartId: `HEB-${Date.now()}`,
      cartUrl: undefined,   // H-E-B has no cart deep-link API
      lineItems,
      subtotal: lineItems.reduce((s, l) => s + l.lineTotal, 0),
      unavailableItems: [],
    }
  }

  // Check availability against local inventory flags
  async getInventoryAvailability(skus: string[]): Promise<InventoryResult[]> {
    return skus.map(sku => {
      const item = GROCERY_INVENTORY.find(i => i.id === sku)
      return { sku, inStock: item?.inStock ?? false, price: item?.price }
    })
  }

  // Fetch full product by SKU
  async getProductBySku(sku: string): Promise<RetailerProduct | null> {
    const item = GROCERY_INVENTORY.find(i => i.id === sku)
    return item ? toRetailerProduct(item) : null
  }
}

export const hebProvider = new HEBProvider()
