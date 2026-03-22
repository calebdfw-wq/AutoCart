// ============================================================
// AutoCart — Core Type Definitions
// These interfaces define the full data model. Keep them clean
// and add new fields at the bottom of each interface to avoid
// breaking changes during future migrations.
// ============================================================

// ─── User & Auth ─────────────────────────────────────────────

export type UserType = 'user' | 'creator' | 'admin'

export interface SocialLinks {
  instagram?: string
  tiktok?: string
  youtube?: string
  twitter?: string
  website?: string
}

export interface User {
  id: string
  email: string
  username: string
  displayName: string
  bio?: string
  avatarUrl?: string
  isPublic: boolean
  userType: UserType
  socialLinks?: SocialLinks
  followerCount?: number    // future: when follower system is built
  followingCount?: number
  foodSubstitutions?: FoodSubstitution[]   // personal auto-sub rules
  createdAt: string
  updatedAt: string
}

// ─── AutoCart (the main entity) ──────────────────────────────

export type CartVisibility = 'public' | 'private' | 'unlisted'
export type PrepGoal =
  | 'bulking'
  | 'cutting'
  | 'maintenance'
  | 'family-meal-prep'
  | 'budget'
  | 'performance'
  | 'general'

export type DietaryLabel =
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'vegan'
  | 'vegetarian'
  | 'keto'
  | 'paleo'
  | 'high-protein'
  | 'low-carb'
  | 'low-calorie'
  | 'low-sodium'
  | 'whole30'
  | 'organic'

export type CartCategory =
  | 'meal-prep'
  | 'bulking'
  | 'cutting'
  | 'family'
  | 'budget'
  | 'athlete'
  | 'vegan'
  | 'keto'
  | 'quick-prep'
  | 'college'
  | 'gourmet'
  | 'snacks'

// ─── Cart Items ───────────────────────────────────────────────

export type ItemCategory =
  | 'produce'
  | 'protein'
  | 'dairy'
  | 'grains'
  | 'pantry'
  | 'frozen'
  | 'beverages'
  | 'snacks'
  | 'condiments'
  | 'supplements'
  | 'bakery'
  | 'deli'

export interface CartItem {
  id: string
  cartId: string
  name: string
  quantity: number
  unit: string                   // e.g. "lbs", "oz", "count", "cups", "tbsp"
  category: ItemCategory
  estimatedPrice: number
  preferredBrand?: string        // optional preferred brand
  acceptableSubstitutions?: string[]  // brand or product alternatives
  notes?: string
  nutritionInfo?: NutritionInfo  // optional per-item nutrition
  // Retailer mapping — filled when connecting to grocery APIs
  retailerSkus?: RetailerSku[]
}

export interface NutritionInfo {
  calories?: number
  protein?: number   // grams
  carbs?: number     // grams
  fat?: number       // grams
  fiber?: number     // grams
}

// ─── Dietary Substitution Rules ──────────────────────────────

export interface SubstitutionRule {
  id: string
  label: DietaryLabel
  active: boolean
  // When active, the rule replaces certain items
  replacements?: SubstitutionReplacement[]
}

export interface SubstitutionReplacement {
  originalItem: string       // item name to replace
  substituteItem: string     // what to replace it with
  notes?: string
}

// ─── AutoCart document ───────────────────────────────────────

export interface AutoCart {
  id: string
  creatorId: string
  creator?: User             // joined user data
  title: string
  description: string
  coverImage?: string
  category: CartCategory
  visibility: CartVisibility
  tags: string[]
  dietaryLabels: DietaryLabel[]
  prepGoal: PrepGoal
  servings: number           // number of servings/meals
  prepDays?: number          // days of prep (e.g. 5 for weekly)
  estimatedTotalCost: number
  estimatedCostPerMeal?: number
  items: CartItem[]
  substitutionRules?: SubstitutionRule[]
  notes?: string             // creator's prep instructions
  macrosPerServing?: NutritionInfo  // aggregate macros per serving
  meals?: Meal[]             // individual meals this cart produces
  likesCount: number
  savesCount: number
  viewsCount: number
  createdAt: string
  updatedAt: string
}

// ─── Meal Plan ───────────────────────────────────────────────
// Individual meals a cart produces, with macros + directions.

export interface Meal {
  id: string
  name: string            // e.g. "Breakfast", "Pre-Workout Bowl", "Dinner"
  emoji?: string          // display emoji for the meal
  description: string     // short summary of the meal
  cartItems: string[]     // names of cart items used in this meal
  macros: NutritionInfo   // per serving of this specific meal
  prepTimeMinutes?: number
  instructions: string[]  // step-by-step cooking instructions
}

// ─── Favorites & Likes ───────────────────────────────────────

export interface Favorite {
  id: string
  userId: string
  cartId: string
  createdAt: string
}

export interface Like {
  id: string
  userId: string
  cartId: string
  createdAt: string
}

// ─── Categories & Tags ───────────────────────────────────────

export interface Category {
  id: string
  slug: CartCategory
  label: string
  description: string
  emoji: string
  color: string
}

// ─── Grocery Provider / Retailer Integration ─────────────────
// These types define the abstraction layer for connecting to
// real grocery APIs (Walmart, Kroger, Instacart, H-E-B, etc.)

export type RetailerId =
  | 'walmart'
  | 'kroger'
  | 'instacart'
  | 'heb'
  | 'target'
  | 'amazon-fresh'
  | 'whole-foods'
  | 'mock'

export interface RetailerSku {
  retailerId: RetailerId
  sku: string                // retailer product ID / UPC
  productName: string        // as shown by the retailer
  productUrl?: string
  imageUrl?: string
  currentPrice?: number
  inStock?: boolean
  lastChecked?: string
}

// ─── Grocery Generation Payload ──────────────────────────────
// Sent to the grocery provider layer when generating a cart

export interface GenerateCartPayload {
  cartId: string
  retailerId: RetailerId
  items: CartItem[]
  activeSubstitutions: DietaryLabel[]
  brandPreferences: Record<string, string>  // itemName → preferredBrand
  userId?: string
}

export interface GeneratedCartResult {
  retailerId: RetailerId
  retailerCartUrl?: string    // deep link to retailer cart (when available)
  mappedItems: MappedCartItem[]
  unmappedItems: CartItem[]   // items that couldn't be matched
  estimatedTotal: number
  substitutionsApplied: string[]
  generatedAt: string
}

export interface MappedCartItem {
  originalItem: CartItem
  retailerProduct: RetailerSku
  quantity: number
  lineTotal: number
}

// ─── Retailer Product (for future inventory search) ──────────

export interface RetailerProduct {
  id: string
  retailerId: RetailerId
  sku: string
  name: string
  brand?: string
  category: ItemCategory
  price: number
  unit?: string
  imageUrl?: string
  productUrl?: string        // direct link to this product on the retailer's website
  inStock: boolean
  nutritionInfo?: NutritionInfo
  upc?: string
  updatedAt: string
}

// ─── Form State (for multi-step create flow) ─────────────────

export interface CreateCartFormData {
  // Step 1: Basic info
  title: string
  description: string
  coverImage?: string
  category: CartCategory
  visibility: CartVisibility
  prepGoal: PrepGoal
  servings: number
  // Step 2: Grocery items
  items: Omit<CartItem, 'id' | 'cartId'>[]
  // Step 3: Dietary rules
  dietaryLabels: DietaryLabel[]
  substitutionRules: Partial<SubstitutionRule>[]
  // Step 4: Meta
  tags: string[]
  notes?: string
}

// ─── Food Substitution Preferences ───────────────────────────
// Per-user rules applied when generating a grocery cart.
// e.g. replace any item containing "bread" with "Canyon Bakehouse GF Bread"

export interface FoodSubstitution {
  id: string
  foodType: string         // keyword to match against item names (e.g. "bread", "pasta", "milk")
  substituteWith: string   // exact product to swap in (e.g. "Canyon Bakehouse Gluten Free Bread")
  notes?: string           // optional user note (e.g. "H-E-B carries this in the GF aisle")
  createdAt: string
}

// ─── Filter/Search ───────────────────────────────────────────

export interface CartFilters {
  search?: string
  category?: CartCategory | ''
  dietary?: DietaryLabel[]
  prepGoal?: PrepGoal | ''
  minPrice?: number
  maxPrice?: number
  sortBy?: 'newest' | 'popular' | 'price-asc' | 'price-desc' | 'saves'
  creatorId?: string
}
