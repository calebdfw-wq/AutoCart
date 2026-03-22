// ============================================================
// Grocery Provider Registry
// Central entry point for all grocery provider integrations.
// Import from here everywhere else in the app to keep
// provider selection in one place.
// ============================================================

import { CartItem, DietaryLabel, GeneratedCartResult, RetailerId, RetailerSku } from '../types'
import { GroceryProvider, MappingOptions } from './types'
import { mockProvider } from './mockProvider'
import { walmartProvider } from './walmart'
import { krogerProvider } from './kroger'
import { instacartProvider } from './instacart'
import { hebProvider } from './heb'

// ─── Provider registry ────────────────────────────────────────
const PROVIDERS: Record<string, GroceryProvider> = {
  mock: mockProvider,
  walmart: walmartProvider,
  kroger: krogerProvider,
  instacart: instacartProvider,
  heb: hebProvider,
}

// ─── Get a provider by ID ─────────────────────────────────────
export function getProvider(id: RetailerId): GroceryProvider {
  const provider = PROVIDERS[id]
  if (!provider) throw new Error(`Unknown grocery provider: ${id}`)
  return provider
}

// ─── List all available providers ────────────────────────────
export function getAvailableProviders(): GroceryProvider[] {
  return Object.values(PROVIDERS).filter(p => p.available)
}

// ─── List all providers (including coming soon) ───────────────
export function getAllProviders(): GroceryProvider[] {
  return Object.values(PROVIDERS)
}

// ─── High-level cart generation (main flow) ──────────────────
// This is the orchestration function that ties everything together.
// Used by the "Generate Grocery Cart" feature.
export async function generateGroceryCart({
  retailerId,
  items,
  activeSubstitutions,
  brandPreferences,
}: {
  retailerId: RetailerId
  items: CartItem[]
  activeSubstitutions: DietaryLabel[]
  brandPreferences: Record<string, string>
}): Promise<GeneratedCartResult> {
  const provider = getProvider(retailerId)

  if (!provider.available) {
    throw new Error(`Provider ${provider.name} is not configured. Please add API credentials to .env.local`)
  }

  // Step 1: Apply dietary substitutions (e.g. swap dairy for dairy-free options)
  const substitutedItems = await provider.applySubstitutions(items, activeSubstitutions)

  // Track which items were substituted
  const substitutionsApplied = substitutedItems
    .filter((item, i) => item.name !== items[i].name)
    .map(item => `${items[substitutedItems.indexOf(item)]?.name ?? '?'} → ${item.name}`)

  // Step 2: Map cart items to retailer product catalog
  const mappingOptions: MappingOptions = {
    preferBrand: brandPreferences,
    allowSubstitutions: true,
    dietaryRestrictions: activeSubstitutions,
  }
  const mappedItems = await provider.mapCartItems(substitutedItems, mappingOptions)

  // Step 3: Create the retailer cart
  const availableItems = substitutedItems.filter((_, i) => mappedItems[i]?.matchedProduct !== null)
  const unmappedItems = substitutedItems.filter((_, i) => mappedItems[i]?.matchedProduct === null)

  const cartResult = await provider.createRetailerCart(availableItems)

  // Step 4: Assemble the result
  const totalCost = cartResult.lineItems.reduce((sum, item) => sum + item.lineTotal, 0)

  return {
    retailerId,
    retailerCartUrl: cartResult.cartUrl,
    mappedItems: mappedItems
      .filter(m => m.matchedProduct !== null)
      .map(m => ({
        originalItem: m.originalItem,
        retailerProduct: {
          retailerId: m.matchedProduct!.retailerId,
          sku: m.matchedProduct!.sku,
          productName: m.matchedProduct!.name,
          productUrl: m.matchedProduct!.productUrl,
          imageUrl: m.matchedProduct!.imageUrl,
          currentPrice: m.matchedProduct!.price,
          inStock: m.matchedProduct!.inStock,
        } as RetailerSku,
        quantity: m.originalItem.quantity,
        lineTotal: (m.matchedProduct!.price ?? 0) * m.originalItem.quantity,
      })),
    unmappedItems,
    estimatedTotal: totalCost || items.reduce((s, i) => s + i.estimatedPrice * i.quantity, 0),
    substitutionsApplied,
    generatedAt: new Date().toISOString(),
  }
}

// Re-export types for convenience
export type { GroceryProvider, InventoryResult, MappedItemResult, RetailerCartResult } from './types'
export { PROVIDER_REGISTRY } from './types'
