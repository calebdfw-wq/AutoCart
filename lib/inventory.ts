// ============================================================
// AutoCart — Grocery Inventory
// A realistic, comprehensive product catalog (~170 items) with
// prices based on typical H-E-B / national grocery store
// averages as of 2025. This is the local inventory used by
// the mock provider and H-E-B link integration.
//
// Each item includes:
//   - Realistic price  - Common unit of sale
//   - Item category    - Common brand
//   - H-E-B search URL (links to real heb.com search)
//   - Nutrition info (approximate per serving)
// ============================================================

export interface InventoryItem {
  id: string
  name: string
  brand?: string
  category: string
  price: number        // estimated price in USD
  unit: string         // e.g. "per lb", "per dozen", "16 oz"
  hebSearchUrl: string // links to https://www.heb.com/search/?q=...
  inStock: boolean
  tags: string[]
  nutrition?: {
    calories?: number
    protein?: number   // grams
    carbs?: number     // grams
    fat?: number       // grams
  }
}

function hebUrl(query: string): string {
  return `https://www.heb.com/search/?q=${encodeURIComponent(query)}`
}

export const GROCERY_INVENTORY: InventoryItem[] = [

  // ──────────────────────────────────────────────────────────
  // PROTEIN — Poultry
  // ──────────────────────────────────────────────────────────
  {
    id: 'P001', name: 'Chicken Breast (Boneless Skinless)', brand: 'H-E-B',
    category: 'protein', price: 4.49, unit: 'per lb',
    hebSearchUrl: hebUrl('boneless skinless chicken breast'),
    inStock: true, tags: ['high-protein', 'lean', 'meal-prep'],
    nutrition: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  },
  {
    id: 'P002', name: 'Chicken Thighs (Boneless Skinless)', brand: 'H-E-B',
    category: 'protein', price: 3.29, unit: 'per lb',
    hebSearchUrl: hebUrl('boneless skinless chicken thighs'),
    inStock: true, tags: ['high-protein', 'budget'],
    nutrition: { calories: 209, protein: 26, carbs: 0, fat: 10.9 },
  },
  {
    id: 'P003', name: 'Chicken Leg Quarters', brand: 'H-E-B',
    category: 'protein', price: 1.29, unit: 'per lb',
    hebSearchUrl: hebUrl('chicken leg quarters'),
    inStock: true, tags: ['budget', 'high-protein'],
    nutrition: { calories: 218, protein: 22, carbs: 0, fat: 14 },
  },
  {
    id: 'P004', name: 'Ground Turkey (93% Lean)', brand: 'Butterball',
    category: 'protein', price: 5.49, unit: 'per lb',
    hebSearchUrl: hebUrl('lean ground turkey'),
    inStock: true, tags: ['high-protein', 'lean', 'meal-prep'],
    nutrition: { calories: 170, protein: 22, carbs: 0, fat: 9 },
  },
  {
    id: 'P005', name: 'Turkey Breast (Deli Thin-Sliced)', brand: 'Boar\'s Head',
    category: 'protein', price: 7.99, unit: 'per lb',
    hebSearchUrl: hebUrl('deli turkey breast sliced'),
    inStock: true, tags: ['high-protein', 'lean', 'low-fat', 'cutting'],
    nutrition: { calories: 90, protein: 18, carbs: 2, fat: 1 },
  },

  // ──────────────────────────────────────────────────────────
  // PROTEIN — Beef & Pork
  // ──────────────────────────────────────────────────────────
  {
    id: 'P006', name: 'Ground Beef (93/7 Lean)', brand: 'H-E-B',
    category: 'protein', price: 6.99, unit: 'per lb',
    hebSearchUrl: hebUrl('93 lean ground beef'),
    inStock: true, tags: ['high-protein', 'bulking'],
    nutrition: { calories: 218, protein: 24, carbs: 0, fat: 13 },
  },
  {
    id: 'P007', name: 'Ground Beef (80/20)', brand: 'H-E-B',
    category: 'protein', price: 5.49, unit: 'per lb',
    hebSearchUrl: hebUrl('80 20 ground beef'),
    inStock: true, tags: ['high-protein', 'budget', 'bulking'],
    nutrition: { calories: 287, protein: 21, carbs: 0, fat: 22 },
  },
  {
    id: 'P008', name: 'Sirloin Steak', brand: 'H-E-B',
    category: 'protein', price: 9.99, unit: 'per lb',
    hebSearchUrl: hebUrl('sirloin steak'),
    inStock: true, tags: ['high-protein', 'performance'],
    nutrition: { calories: 207, protein: 26, carbs: 0, fat: 11 },
  },
  {
    id: 'P009', name: 'Pork Tenderloin', brand: 'H-E-B',
    category: 'protein', price: 4.99, unit: 'per lb',
    hebSearchUrl: hebUrl('pork tenderloin'),
    inStock: true, tags: ['high-protein', 'lean'],
    nutrition: { calories: 143, protein: 26, carbs: 0, fat: 3 },
  },
  {
    id: 'P010', name: 'Bacon (Thick Cut)', brand: 'H-E-B',
    category: 'protein', price: 6.99, unit: '16 oz pkg',
    hebSearchUrl: hebUrl('thick cut bacon'),
    inStock: true, tags: ['keto', 'high-fat'],
    nutrition: { calories: 541, protein: 37, carbs: 0, fat: 42 },
  },

  // ──────────────────────────────────────────────────────────
  // PROTEIN — Seafood
  // ──────────────────────────────────────────────────────────
  {
    id: 'P011', name: 'Salmon Fillet (Atlantic)', brand: 'H-E-B',
    category: 'protein', price: 10.99, unit: 'per lb',
    hebSearchUrl: hebUrl('atlantic salmon fillet'),
    inStock: true, tags: ['high-protein', 'omega-3', 'performance'],
    nutrition: { calories: 208, protein: 20, carbs: 0, fat: 13 },
  },
  {
    id: 'P012', name: 'Tilapia Fillet', brand: 'H-E-B',
    category: 'protein', price: 5.99, unit: 'per lb',
    hebSearchUrl: hebUrl('tilapia fillet'),
    inStock: true, tags: ['high-protein', 'lean', 'low-fat', 'cutting'],
    nutrition: { calories: 129, protein: 26, carbs: 0, fat: 2.7 },
  },
  {
    id: 'P013', name: 'Shrimp (Large, Peeled & Deveined)', brand: 'H-E-B',
    category: 'protein', price: 8.99, unit: 'per lb',
    hebSearchUrl: hebUrl('peeled deveined shrimp large'),
    inStock: true, tags: ['high-protein', 'low-fat', 'quick-prep'],
    nutrition: { calories: 99, protein: 24, carbs: 0, fat: 1 },
  },
  {
    id: 'P014', name: 'Canned Tuna in Water', brand: 'StarKist',
    category: 'protein', price: 1.49, unit: '5 oz can',
    hebSearchUrl: hebUrl('canned tuna in water starkist'),
    inStock: true, tags: ['high-protein', 'budget', 'low-fat', 'cutting'],
    nutrition: { calories: 100, protein: 22, carbs: 0, fat: 0.5 },
  },
  {
    id: 'P015', name: 'Canned Salmon (Wild)', brand: 'Wild Planet',
    category: 'protein', price: 3.99, unit: '5 oz can',
    hebSearchUrl: hebUrl('wild planet canned salmon'),
    inStock: true, tags: ['high-protein', 'omega-3'],
    nutrition: { calories: 140, protein: 22, carbs: 0, fat: 6 },
  },

  // ──────────────────────────────────────────────────────────
  // PROTEIN — Eggs & Egg Products
  // ──────────────────────────────────────────────────────────
  {
    id: 'P016', name: 'Large Eggs', brand: 'H-E-B',
    category: 'protein', price: 3.99, unit: 'dozen',
    hebSearchUrl: hebUrl('large eggs dozen'),
    inStock: true, tags: ['high-protein', 'budget', 'keto'],
    nutrition: { calories: 70, protein: 6, carbs: 0.6, fat: 5 },
  },
  {
    id: 'P017', name: 'Egg Whites (Liquid)', brand: 'AllWhites',
    category: 'protein', price: 3.99, unit: '32 oz carton',
    hebSearchUrl: hebUrl('liquid egg whites carton'),
    inStock: true, tags: ['high-protein', 'low-fat', 'cutting', 'low-calorie'],
    nutrition: { calories: 25, protein: 5, carbs: 0, fat: 0 },
  },
  {
    id: 'P018', name: 'Hard-Boiled Eggs (Pre-cooked)', brand: 'H-E-B',
    category: 'protein', price: 4.49, unit: '6 count',
    hebSearchUrl: hebUrl('hard boiled eggs pre cooked'),
    inStock: true, tags: ['quick-prep', 'high-protein'],
    nutrition: { calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  },

  // ──────────────────────────────────────────────────────────
  // DAIRY
  // ──────────────────────────────────────────────────────────
  {
    id: 'D001', name: 'Whole Milk', brand: 'H-E-B',
    category: 'dairy', price: 4.79, unit: '1 gallon',
    hebSearchUrl: hebUrl('whole milk gallon'),
    inStock: true, tags: ['bulking', 'high-calorie'],
    nutrition: { calories: 149, protein: 8, carbs: 12, fat: 8 },
  },
  {
    id: 'D002', name: '2% Reduced Fat Milk', brand: 'H-E-B',
    category: 'dairy', price: 4.49, unit: '1 gallon',
    hebSearchUrl: hebUrl('2 percent reduced fat milk'),
    inStock: true, tags: ['general'],
    nutrition: { calories: 122, protein: 8, carbs: 12, fat: 5 },
  },
  {
    id: 'D003', name: 'Greek Yogurt (Plain, Non-fat)', brand: 'Chobani',
    category: 'dairy', price: 6.49, unit: '32 oz',
    hebSearchUrl: hebUrl('chobani plain nonfat greek yogurt'),
    inStock: true, tags: ['high-protein', 'low-fat', 'cutting'],
    nutrition: { calories: 80, protein: 14, carbs: 6, fat: 0 },
  },
  {
    id: 'D004', name: 'Greek Yogurt (Whole Milk Plain)', brand: 'Fage Total',
    category: 'dairy', price: 7.49, unit: '35 oz',
    hebSearchUrl: hebUrl('fage total whole milk greek yogurt'),
    inStock: true, tags: ['high-protein', 'keto', 'bulking'],
    nutrition: { calories: 130, protein: 11, carbs: 5, fat: 7 },
  },
  {
    id: 'D005', name: 'Cottage Cheese (Low-fat 2%)', brand: 'Good Culture',
    category: 'dairy', price: 5.49, unit: '16 oz',
    hebSearchUrl: hebUrl('good culture cottage cheese 2 percent'),
    inStock: true, tags: ['high-protein', 'low-fat'],
    nutrition: { calories: 90, protein: 14, carbs: 5, fat: 2.5 },
  },
  {
    id: 'D006', name: 'Shredded Mozzarella', brand: 'H-E-B',
    category: 'dairy', price: 3.99, unit: '8 oz bag',
    hebSearchUrl: hebUrl('shredded mozzarella cheese'),
    inStock: true, tags: ['keto', 'general'],
    nutrition: { calories: 85, protein: 6, carbs: 1, fat: 6 },
  },
  {
    id: 'D007', name: 'Cheddar Cheese (Block)', brand: 'H-E-B',
    category: 'dairy', price: 4.99, unit: '16 oz',
    hebSearchUrl: hebUrl('cheddar cheese block 16 oz'),
    inStock: true, tags: ['keto', 'bulking'],
    nutrition: { calories: 113, protein: 7, carbs: 0, fat: 9 },
  },
  {
    id: 'D008', name: 'Butter (Unsalted)', brand: 'H-E-B',
    category: 'dairy', price: 4.49, unit: '1 lb (4 sticks)',
    hebSearchUrl: hebUrl('unsalted butter 1 pound'),
    inStock: true, tags: ['keto', 'baking'],
    nutrition: { calories: 102, protein: 0, carbs: 0, fat: 12 },
  },
  {
    id: 'D009', name: 'Cream Cheese', brand: 'Philadelphia',
    category: 'dairy', price: 3.49, unit: '8 oz',
    hebSearchUrl: hebUrl('philadelphia cream cheese 8 oz'),
    inStock: true, tags: ['keto', 'general'],
    nutrition: { calories: 100, protein: 2, carbs: 1, fat: 10 },
  },
  {
    id: 'D010', name: 'Oat Milk (Barista)', brand: 'Oatly',
    category: 'dairy', price: 4.99, unit: '32 oz',
    hebSearchUrl: hebUrl('oatly oat milk barista'),
    inStock: true, tags: ['dairy-free', 'vegan'],
    nutrition: { calories: 130, protein: 4, carbs: 24, fat: 3.5 },
  },
  {
    id: 'D011', name: 'Almond Milk (Unsweetened)', brand: 'Silk',
    category: 'dairy', price: 3.99, unit: '64 oz',
    hebSearchUrl: hebUrl('silk unsweetened almond milk'),
    inStock: true, tags: ['dairy-free', 'vegan', 'low-calorie'],
    nutrition: { calories: 30, protein: 1, carbs: 1, fat: 2.5 },
  },
  {
    id: 'D012', name: 'Coconut Yogurt (Plain)', brand: 'So Delicious',
    category: 'dairy', price: 4.99, unit: '24 oz',
    hebSearchUrl: hebUrl('so delicious coconut yogurt plain'),
    inStock: true, tags: ['dairy-free', 'vegan'],
    nutrition: { calories: 130, protein: 1, carbs: 12, fat: 8 },
  },

  // ──────────────────────────────────────────────────────────
  // GRAINS & STARCHES
  // ──────────────────────────────────────────────────────────
  {
    id: 'G001', name: 'White Rice (Long Grain)', brand: 'H-E-B',
    category: 'grains', price: 3.49, unit: '5 lb bag',
    hebSearchUrl: hebUrl('long grain white rice 5 lb'),
    inStock: true, tags: ['budget', 'bulking', 'meal-prep'],
    nutrition: { calories: 206, protein: 4, carbs: 45, fat: 0.4 },
  },
  {
    id: 'G002', name: 'Brown Rice', brand: 'Lundberg Organic',
    category: 'grains', price: 5.99, unit: '2 lb bag',
    hebSearchUrl: hebUrl('lundberg organic brown rice'),
    inStock: true, tags: ['organic', 'fiber', 'whole-grain'],
    nutrition: { calories: 216, protein: 5, carbs: 45, fat: 1.8 },
  },
  {
    id: 'G003', name: 'Jasmine Rice', brand: 'Royal',
    category: 'grains', price: 4.99, unit: '5 lb bag',
    hebSearchUrl: hebUrl('jasmine rice 5 lb'),
    inStock: true, tags: ['bulking', 'meal-prep'],
    nutrition: { calories: 206, protein: 4, carbs: 45, fat: 0.4 },
  },
  {
    id: 'G004', name: 'Rolled Oats', brand: "Bob's Red Mill",
    category: 'grains', price: 5.49, unit: '32 oz bag',
    hebSearchUrl: hebUrl("bob's red mill rolled oats"),
    inStock: true, tags: ['fiber', 'budget', 'bulking', 'whole-grain'],
    nutrition: { calories: 150, protein: 5, carbs: 27, fat: 3 },
  },
  {
    id: 'G005', name: 'Quick Oats (Instant)', brand: 'Quaker',
    category: 'grains', price: 4.79, unit: '18 oz',
    hebSearchUrl: hebUrl('quaker instant oats'),
    inStock: true, tags: ['quick-prep', 'budget'],
    nutrition: { calories: 150, protein: 5, carbs: 27, fat: 3 },
  },
  {
    id: 'G006', name: 'Whole Wheat Bread', brand: "Dave's Killer Bread",
    category: 'grains', price: 5.99, unit: '27 oz loaf',
    hebSearchUrl: hebUrl("dave's killer bread whole wheat"),
    inStock: true, tags: ['fiber', 'whole-grain'],
    nutrition: { calories: 120, protein: 5, carbs: 22, fat: 2 },
  },
  {
    id: 'G007', name: 'Whole Wheat Flour Tortillas', brand: 'Mission',
    category: 'grains', price: 4.29, unit: '20 count',
    hebSearchUrl: hebUrl('mission whole wheat flour tortillas'),
    inStock: true, tags: ['meal-prep', 'budget'],
    nutrition: { calories: 140, protein: 4, carbs: 22, fat: 4 },
  },
  {
    id: 'G008', name: 'Corn Tortillas (6 inch)', brand: 'Mission',
    category: 'grains', price: 2.99, unit: '30 count',
    hebSearchUrl: hebUrl('mission corn tortillas 6 inch'),
    inStock: true, tags: ['gluten-free', 'budget', 'vegan'],
    nutrition: { calories: 60, protein: 1, carbs: 12, fat: 1 },
  },
  {
    id: 'G009', name: 'Pasta (Penne)', brand: 'Barilla',
    category: 'grains', price: 1.99, unit: '16 oz box',
    hebSearchUrl: hebUrl('barilla penne pasta'),
    inStock: true, tags: ['budget', 'bulking'],
    nutrition: { calories: 200, protein: 7, carbs: 41, fat: 1 },
  },
  {
    id: 'G010', name: 'Chickpea Pasta (Rotini)', brand: 'Banza',
    category: 'grains', price: 3.99, unit: '8 oz box',
    hebSearchUrl: hebUrl('banza chickpea pasta rotini'),
    inStock: true, tags: ['gluten-free', 'high-protein'],
    nutrition: { calories: 190, protein: 14, carbs: 35, fat: 3.5 },
  },
  {
    id: 'G011', name: 'Quinoa (White)', brand: 'Simply Nature',
    category: 'grains', price: 6.99, unit: '32 oz',
    hebSearchUrl: hebUrl('white quinoa 32 oz'),
    inStock: true, tags: ['gluten-free', 'high-protein', 'complete-protein'],
    nutrition: { calories: 222, protein: 8, carbs: 39, fat: 3.5 },
  },
  {
    id: 'G012', name: 'Gluten-Free Pasta', brand: 'Barilla',
    category: 'grains', price: 3.49, unit: '12 oz box',
    hebSearchUrl: hebUrl('barilla gluten free pasta'),
    inStock: true, tags: ['gluten-free'],
    nutrition: { calories: 200, protein: 4, carbs: 43, fat: 1 },
  },

  // ──────────────────────────────────────────────────────────
  // PRODUCE — Vegetables
  // ──────────────────────────────────────────────────────────
  {
    id: 'V001', name: 'Baby Spinach', brand: 'H-E-B',
    category: 'produce', price: 4.49, unit: '5 oz bag',
    hebSearchUrl: hebUrl('baby spinach 5 oz'),
    inStock: true, tags: ['low-calorie', 'cutting', 'vegan'],
    nutrition: { calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1 },
  },
  {
    id: 'V002', name: 'Broccoli Crowns', brand: 'H-E-B',
    category: 'produce', price: 2.49, unit: 'per lb',
    hebSearchUrl: hebUrl('broccoli crowns'),
    inStock: true, tags: ['low-calorie', 'fiber', 'vegan', 'cutting'],
    nutrition: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  },
  {
    id: 'V003', name: 'Sweet Potatoes', brand: 'H-E-B',
    category: 'produce', price: 1.29, unit: 'per lb',
    hebSearchUrl: hebUrl('sweet potatoes'),
    inStock: true, tags: ['budget', 'fiber', 'complex-carbs'],
    nutrition: { calories: 103, protein: 2.3, carbs: 24, fat: 0.1 },
  },
  {
    id: 'V004', name: 'Russet Potatoes', brand: 'H-E-B',
    category: 'produce', price: 0.89, unit: 'per lb',
    hebSearchUrl: hebUrl('russet potatoes'),
    inStock: true, tags: ['budget', 'bulking', 'complex-carbs'],
    nutrition: { calories: 168, protein: 5, carbs: 38, fat: 0.2 },
  },
  {
    id: 'V005', name: 'Cherry Tomatoes', brand: 'H-E-B',
    category: 'produce', price: 3.99, unit: '10 oz pint',
    hebSearchUrl: hebUrl('cherry tomatoes pint'),
    inStock: true, tags: ['low-calorie', 'vegan'],
    nutrition: { calories: 35, protein: 1.7, carbs: 7.6, fat: 0.4 },
  },
  {
    id: 'V006', name: 'Bell Peppers (Multicolor)', brand: 'H-E-B',
    category: 'produce', price: 1.49, unit: 'each',
    hebSearchUrl: hebUrl('bell peppers multicolor'),
    inStock: true, tags: ['low-calorie', 'vegan'],
    nutrition: { calories: 31, protein: 1, carbs: 7.4, fat: 0.3 },
  },
  {
    id: 'V007', name: 'Asparagus', brand: 'H-E-B',
    category: 'produce', price: 3.99, unit: 'per lb',
    hebSearchUrl: hebUrl('fresh asparagus'),
    inStock: true, tags: ['low-calorie', 'cutting', 'vegan'],
    nutrition: { calories: 27, protein: 2.9, carbs: 5, fat: 0.2 },
  },
  {
    id: 'V008', name: 'Avocados (Hass)', brand: 'H-E-B',
    category: 'produce', price: 1.29, unit: 'each',
    hebSearchUrl: hebUrl('hass avocados'),
    inStock: true, tags: ['keto', 'healthy-fat', 'vegan'],
    nutrition: { calories: 234, protein: 2.9, carbs: 12, fat: 21 },
  },
  {
    id: 'V009', name: 'Cucumber', brand: 'H-E-B',
    category: 'produce', price: 0.99, unit: 'each',
    hebSearchUrl: hebUrl('cucumber'),
    inStock: true, tags: ['low-calorie', 'cutting', 'vegan'],
    nutrition: { calories: 45, protein: 2, carbs: 11, fat: 0.3 },
  },
  {
    id: 'V010', name: 'Zucchini', brand: 'H-E-B',
    category: 'produce', price: 1.49, unit: 'per lb',
    hebSearchUrl: hebUrl('zucchini squash'),
    inStock: true, tags: ['low-calorie', 'vegan', 'keto'],
    nutrition: { calories: 33, protein: 2.4, carbs: 6.1, fat: 0.6 },
  },
  {
    id: 'V011', name: 'Garlic (Whole Bulb)', brand: 'H-E-B',
    category: 'produce', price: 0.79, unit: 'each',
    hebSearchUrl: hebUrl('garlic bulb whole'),
    inStock: true, tags: ['vegan', 'budget', 'seasoning'],
    nutrition: { calories: 5, protein: 0.2, carbs: 1, fat: 0 },
  },
  {
    id: 'V012', name: 'Yellow Onions', brand: 'H-E-B',
    category: 'produce', price: 1.49, unit: '3 lb bag',
    hebSearchUrl: hebUrl('yellow onions 3 lb bag'),
    inStock: true, tags: ['vegan', 'budget'],
    nutrition: { calories: 44, protein: 1.2, carbs: 10, fat: 0.1 },
  },
  {
    id: 'V013', name: 'Kale (Curly)', brand: 'H-E-B',
    category: 'produce', price: 2.99, unit: 'per bunch',
    hebSearchUrl: hebUrl('curly kale bunch'),
    inStock: true, tags: ['vegan', 'fiber', 'low-calorie'],
    nutrition: { calories: 49, protein: 4.3, carbs: 9, fat: 0.9 },
  },

  // ──────────────────────────────────────────────────────────
  // PRODUCE — Fruits
  // ──────────────────────────────────────────────────────────
  {
    id: 'F001', name: 'Bananas', brand: 'H-E-B',
    category: 'produce', price: 0.29, unit: 'per lb',
    hebSearchUrl: hebUrl('bananas'),
    inStock: true, tags: ['budget', 'bulking', 'vegan'],
    nutrition: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  },
  {
    id: 'F002', name: 'Blueberries', brand: 'H-E-B',
    category: 'produce', price: 3.99, unit: '6 oz pint',
    hebSearchUrl: hebUrl('fresh blueberries pint'),
    inStock: true, tags: ['antioxidants', 'vegan'],
    nutrition: { calories: 84, protein: 1.1, carbs: 21, fat: 0.5 },
  },
  {
    id: 'F003', name: 'Strawberries', brand: 'H-E-B',
    category: 'produce', price: 3.49, unit: '16 oz',
    hebSearchUrl: hebUrl('fresh strawberries 16 oz'),
    inStock: true, tags: ['vegan', 'low-calorie'],
    nutrition: { calories: 49, protein: 1, carbs: 12, fat: 0.5 },
  },
  {
    id: 'F004', name: 'Apples (Gala)', brand: 'H-E-B',
    category: 'produce', price: 1.49, unit: 'per lb',
    hebSearchUrl: hebUrl('gala apples'),
    inStock: true, tags: ['budget', 'vegan', 'fiber'],
    nutrition: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  },
  {
    id: 'F005', name: 'Frozen Mixed Berries', brand: 'H-E-B',
    category: 'frozen', price: 4.99, unit: '32 oz bag',
    hebSearchUrl: hebUrl('frozen mixed berries 32 oz'),
    inStock: true, tags: ['vegan', 'antioxidants', 'budget'],
    nutrition: { calories: 70, protein: 1, carbs: 17, fat: 0.5 },
  },

  // ──────────────────────────────────────────────────────────
  // PANTRY — Canned Goods
  // ──────────────────────────────────────────────────────────
  {
    id: 'C001', name: 'Black Beans (Canned)', brand: 'H-E-B',
    category: 'pantry', price: 0.99, unit: '15 oz can',
    hebSearchUrl: hebUrl('canned black beans 15 oz'),
    inStock: true, tags: ['vegan', 'budget', 'fiber', 'high-protein'],
    nutrition: { calories: 114, protein: 7.6, carbs: 20, fat: 0.5 },
  },
  {
    id: 'C002', name: 'Chickpeas (Garbanzo Beans, Canned)', brand: 'H-E-B',
    category: 'pantry', price: 0.99, unit: '15 oz can',
    hebSearchUrl: hebUrl('canned chickpeas garbanzo beans'),
    inStock: true, tags: ['vegan', 'budget', 'high-protein'],
    nutrition: { calories: 164, protein: 8.9, carbs: 27, fat: 2.6 },
  },
  {
    id: 'C003', name: 'Diced Tomatoes (Canned)', brand: 'H-E-B',
    category: 'pantry', price: 0.89, unit: '14.5 oz can',
    hebSearchUrl: hebUrl('canned diced tomatoes 14 oz'),
    inStock: true, tags: ['budget', 'vegan'],
    nutrition: { calories: 25, protein: 1, carbs: 6, fat: 0 },
  },
  {
    id: 'C004', name: 'Lentils (Green, Dry)', brand: 'H-E-B',
    category: 'pantry', price: 2.49, unit: '16 oz bag',
    hebSearchUrl: hebUrl('green lentils dry'),
    inStock: true, tags: ['vegan', 'budget', 'high-protein', 'fiber'],
    nutrition: { calories: 230, protein: 18, carbs: 40, fat: 0.8 },
  },
  {
    id: 'C005', name: 'Coconut Milk (Full Fat)', brand: 'Thai Kitchen',
    category: 'pantry', price: 2.49, unit: '13.5 oz can',
    hebSearchUrl: hebUrl('thai kitchen coconut milk full fat'),
    inStock: true, tags: ['dairy-free', 'vegan', 'keto'],
    nutrition: { calories: 276, protein: 2.8, carbs: 6, fat: 29 },
  },

  // ──────────────────────────────────────────────────────────
  // PANTRY — Oils, Fats & Condiments
  // ──────────────────────────────────────────────────────────
  {
    id: 'O001', name: 'Extra Virgin Olive Oil', brand: 'California Olive Ranch',
    category: 'pantry', price: 9.99, unit: '16.9 oz',
    hebSearchUrl: hebUrl('california olive ranch extra virgin olive oil'),
    inStock: true, tags: ['keto', 'healthy-fat'],
    nutrition: { calories: 119, protein: 0, carbs: 0, fat: 13.5 },
  },
  {
    id: 'O002', name: 'Avocado Oil', brand: 'Chosen Foods',
    category: 'pantry', price: 7.99, unit: '16.9 oz',
    hebSearchUrl: hebUrl('chosen foods avocado oil'),
    inStock: true, tags: ['keto', 'healthy-fat', 'high-heat'],
    nutrition: { calories: 124, protein: 0, carbs: 0, fat: 14 },
  },
  {
    id: 'O003', name: 'Peanut Butter (Natural)', brand: 'H-E-B',
    category: 'pantry', price: 3.99, unit: '16 oz jar',
    hebSearchUrl: hebUrl('natural peanut butter 16 oz'),
    inStock: true, tags: ['budget', 'bulking', 'high-protein'],
    nutrition: { calories: 188, protein: 8, carbs: 7, fat: 16 },
  },
  {
    id: 'O004', name: 'Almond Butter', brand: "Justin's",
    category: 'pantry', price: 8.99, unit: '16 oz jar',
    hebSearchUrl: hebUrl("justin's almond butter"),
    inStock: true, tags: ['healthy-fat', 'nut-free alternative to PB'],
    nutrition: { calories: 190, protein: 7, carbs: 7, fat: 17 },
  },
  {
    id: 'O005', name: 'Coconut Aminos', brand: 'Bragg',
    category: 'pantry', price: 5.99, unit: '10 oz',
    hebSearchUrl: hebUrl('bragg coconut aminos'),
    inStock: true, tags: ['gluten-free', 'soy-free', 'vegan'],
    nutrition: { calories: 5, protein: 0, carbs: 1, fat: 0 },
  },
  {
    id: 'O006', name: 'Soy Sauce (Low Sodium)', brand: 'Kikkoman',
    category: 'pantry', price: 2.99, unit: '10 oz',
    hebSearchUrl: hebUrl('kikkoman low sodium soy sauce'),
    inStock: true, tags: ['low-sodium'],
    nutrition: { calories: 10, protein: 1, carbs: 1, fat: 0 },
  },
  {
    id: 'O007', name: 'Hot Sauce', brand: 'Cholula',
    category: 'pantry', price: 2.99, unit: '5 oz',
    hebSearchUrl: hebUrl('cholula hot sauce'),
    inStock: true, tags: ['vegan', 'budget', 'low-calorie'],
    nutrition: { calories: 5, protein: 0, carbs: 0.5, fat: 0 },
  },
  {
    id: 'O008', name: 'Honey (Raw)', brand: 'H-E-B',
    category: 'pantry', price: 5.99, unit: '16 oz',
    hebSearchUrl: hebUrl('raw honey 16 oz'),
    inStock: true, tags: ['natural'],
    nutrition: { calories: 64, protein: 0, carbs: 17, fat: 0 },
  },
  {
    id: 'O009', name: 'Salsa (Mild)', brand: 'Pace',
    category: 'pantry', price: 2.99, unit: '16 oz jar',
    hebSearchUrl: hebUrl('pace mild salsa 16 oz'),
    inStock: true, tags: ['vegan', 'budget'],
    nutrition: { calories: 10, protein: 0, carbs: 2, fat: 0 },
  },

  // ──────────────────────────────────────────────────────────
  // PANTRY — Spices & Seasonings
  // ──────────────────────────────────────────────────────────
  {
    id: 'S001', name: 'Garlic Powder', brand: 'H-E-B',
    category: 'pantry', price: 2.49, unit: '3 oz',
    hebSearchUrl: hebUrl('garlic powder spice'),
    inStock: true, tags: ['budget', 'vegan'],
    nutrition: { calories: 10, protein: 0.5, carbs: 2, fat: 0 },
  },
  {
    id: 'S002', name: 'Smoked Paprika', brand: 'H-E-B',
    category: 'pantry', price: 2.49, unit: '2 oz',
    hebSearchUrl: hebUrl('smoked paprika spice'),
    inStock: true, tags: ['vegan'],
    nutrition: { calories: 6, protein: 0.3, carbs: 1.2, fat: 0.3 },
  },
  {
    id: 'S003', name: 'Cumin (Ground)', brand: 'H-E-B',
    category: 'pantry', price: 2.49, unit: '2 oz',
    hebSearchUrl: hebUrl('ground cumin spice'),
    inStock: true, tags: ['vegan'],
    nutrition: { calories: 8, protein: 0.4, carbs: 0.9, fat: 0.5 },
  },
  {
    id: 'S004', name: 'Cinnamon (Ground)', brand: 'H-E-B',
    category: 'pantry', price: 2.49, unit: '2 oz',
    hebSearchUrl: hebUrl('ground cinnamon spice'),
    inStock: true, tags: ['vegan', 'baking'],
    nutrition: { calories: 6, protein: 0.1, carbs: 2, fat: 0 },
  },
  {
    id: 'S005', name: 'Salt (Himalayan Pink)', brand: 'H-E-B',
    category: 'pantry', price: 3.99, unit: '26 oz',
    hebSearchUrl: hebUrl('himalayan pink salt'),
    inStock: true, tags: ['vegan'],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  },
  {
    id: 'S006', name: 'Black Pepper (Ground)', brand: 'H-E-B',
    category: 'pantry', price: 2.99, unit: '3 oz',
    hebSearchUrl: hebUrl('ground black pepper'),
    inStock: true, tags: ['vegan'],
    nutrition: { calories: 6, protein: 0.3, carbs: 1.7, fat: 0.1 },
  },

  // ──────────────────────────────────────────────────────────
  // FROZEN
  // ──────────────────────────────────────────────────────────
  {
    id: 'FZ001', name: 'Frozen Broccoli Florets', brand: 'H-E-B',
    category: 'frozen', price: 2.49, unit: '32 oz bag',
    hebSearchUrl: hebUrl('frozen broccoli florets 32 oz'),
    inStock: true, tags: ['budget', 'vegan', 'low-calorie'],
    nutrition: { calories: 35, protein: 2.4, carbs: 7, fat: 0.4 },
  },
  {
    id: 'FZ002', name: 'Frozen Edamame (Shelled)', brand: 'H-E-B',
    category: 'frozen', price: 3.99, unit: '16 oz bag',
    hebSearchUrl: hebUrl('frozen shelled edamame'),
    inStock: true, tags: ['high-protein', 'vegan', 'gluten-free'],
    nutrition: { calories: 120, protein: 11, carbs: 10, fat: 5 },
  },
  {
    id: 'FZ003', name: 'Frozen Stir-Fry Vegetables', brand: 'Bird\'s Eye',
    category: 'frozen', price: 2.99, unit: '14 oz bag',
    hebSearchUrl: hebUrl("bird's eye stir fry vegetables"),
    inStock: true, tags: ['budget', 'vegan', 'quick-prep'],
    nutrition: { calories: 30, protein: 1.5, carbs: 5, fat: 0 },
  },
  {
    id: 'FZ004', name: 'Frozen Cauliflower Rice', brand: 'Green Giant',
    category: 'frozen', price: 2.99, unit: '12 oz bag',
    hebSearchUrl: hebUrl('frozen cauliflower rice'),
    inStock: true, tags: ['low-carb', 'keto', 'vegan'],
    nutrition: { calories: 25, protein: 2, carbs: 5, fat: 0 },
  },
  {
    id: 'FZ005', name: 'Frozen Chicken Breast (Individually Wrapped)', brand: 'Tyson',
    category: 'frozen', price: 12.99, unit: '3 lb bag',
    hebSearchUrl: hebUrl('tyson individually frozen chicken breast'),
    inStock: true, tags: ['high-protein', 'meal-prep'],
    nutrition: { calories: 110, protein: 26, carbs: 0, fat: 1 },
  },

  // ──────────────────────────────────────────────────────────
  // SUPPLEMENTS
  // ──────────────────────────────────────────────────────────
  {
    id: 'SUP001', name: 'Whey Protein Powder (Chocolate)', brand: 'Optimum Nutrition',
    category: 'supplements', price: 34.99, unit: '2 lb tub (29 servings)',
    hebSearchUrl: hebUrl('optimum nutrition gold standard whey protein'),
    inStock: true, tags: ['high-protein', 'bulking', 'meal-prep'],
    nutrition: { calories: 120, protein: 24, carbs: 3, fat: 1 },
  },
  {
    id: 'SUP002', name: 'Whey Isolate (Vanilla)', brand: 'Dymatize ISO100',
    category: 'supplements', price: 39.99, unit: '1.6 lb tub (22 servings)',
    hebSearchUrl: hebUrl('dymatize iso100 whey isolate vanilla'),
    inStock: true, tags: ['high-protein', 'cutting', 'low-carb'],
    nutrition: { calories: 110, protein: 25, carbs: 1, fat: 0 },
  },
  {
    id: 'SUP003', name: 'Creatine Monohydrate', brand: 'Thorne',
    category: 'supplements', price: 29.99, unit: '90 servings',
    hebSearchUrl: hebUrl('creatine monohydrate powder'),
    inStock: true, tags: ['performance', 'bulking'],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  },
  {
    id: 'SUP004', name: 'Plant-Based Protein Powder', brand: 'Garden of Life',
    category: 'supplements', price: 32.99, unit: '19.75 oz',
    hebSearchUrl: hebUrl('garden of life plant protein powder'),
    inStock: true, tags: ['vegan', 'high-protein', 'gluten-free'],
    nutrition: { calories: 150, protein: 30, carbs: 4, fat: 3 },
  },

  // ──────────────────────────────────────────────────────────
  // SNACKS
  // ──────────────────────────────────────────────────────────
  {
    id: 'SN001', name: 'Rice Cakes (Plain)', brand: 'Quaker',
    category: 'snacks', price: 3.49, unit: '4.47 oz bag',
    hebSearchUrl: hebUrl('quaker plain rice cakes'),
    inStock: true, tags: ['low-calorie', 'cutting', 'gluten-free'],
    nutrition: { calories: 35, protein: 0.7, carbs: 7.3, fat: 0.3 },
  },
  {
    id: 'SN002', name: 'Quest Protein Bar (Cookie Dough)', brand: 'Quest',
    category: 'snacks', price: 2.99, unit: 'each (60g)',
    hebSearchUrl: hebUrl('quest protein bar cookie dough'),
    inStock: true, tags: ['high-protein', 'low-carb', 'keto'],
    nutrition: { calories: 190, protein: 21, carbs: 22, fat: 8 },
  },
  {
    id: 'SN003', name: 'Mixed Nuts (Unsalted)', brand: 'H-E-B',
    category: 'snacks', price: 7.99, unit: '16 oz',
    hebSearchUrl: hebUrl('unsalted mixed nuts 16 oz'),
    inStock: true, tags: ['keto', 'healthy-fat', 'vegan'],
    nutrition: { calories: 170, protein: 5, carbs: 7, fat: 15 },
  },
  {
    id: 'SN004', name: 'RXBAR (Chocolate Sea Salt)', brand: 'RXBAR',
    category: 'snacks', price: 2.49, unit: 'each (52g)',
    hebSearchUrl: hebUrl('rxbar chocolate sea salt'),
    inStock: true, tags: ['high-protein', 'gluten-free', 'whole30'],
    nutrition: { calories: 210, protein: 12, carbs: 24, fat: 9 },
  },
  {
    id: 'SN005', name: 'Kind Bar (Dark Chocolate Nuts)', brand: 'KIND',
    category: 'snacks', price: 1.99, unit: 'each (40g)',
    hebSearchUrl: hebUrl('kind dark chocolate nuts bar'),
    inStock: true, tags: ['gluten-free', 'vegan'],
    nutrition: { calories: 200, protein: 6, carbs: 16, fat: 15 },
  },

  // ──────────────────────────────────────────────────────────
  // BEVERAGES
  // ──────────────────────────────────────────────────────────
  {
    id: 'B001', name: 'Sparkling Water (12-pack)', brand: 'LaCroix',
    category: 'beverages', price: 5.99, unit: '12 x 12 oz',
    hebSearchUrl: hebUrl('lacroix sparkling water 12 pack'),
    inStock: true, tags: ['zero-calorie', 'hydration', 'vegan'],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  },
  {
    id: 'B002', name: 'Green Tea (Unsweetened, Bags)', brand: 'Bigelow',
    category: 'beverages', price: 4.49, unit: '40 bags',
    hebSearchUrl: hebUrl('bigelow green tea bags'),
    inStock: true, tags: ['vegan', 'low-calorie', 'antioxidants'],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  },
  {
    id: 'B003', name: 'Coffee (Medium Roast, Ground)', brand: 'Café Bustelo',
    category: 'beverages', price: 6.99, unit: '10 oz',
    hebSearchUrl: hebUrl('cafe bustelo ground coffee'),
    inStock: true, tags: ['budget'],
    nutrition: { calories: 2, protein: 0, carbs: 0, fat: 0 },
  },
  {
    id: 'B004', name: 'Protein Shake (Ready-to-Drink)', brand: 'Premier Protein',
    category: 'beverages', price: 12.99, unit: '4 x 11.5 oz',
    hebSearchUrl: hebUrl('premier protein ready to drink shake'),
    inStock: true, tags: ['high-protein', 'quick-prep', 'cutting'],
    nutrition: { calories: 160, protein: 30, carbs: 5, fat: 3 },
  },
]

// ─── Helper functions ─────────────────────────────────────────

export function searchInventory(query: string, limit = 10): InventoryItem[] {
  const q = query.toLowerCase()
  return GROCERY_INVENTORY.filter(item =>
    item.name.toLowerCase().includes(q) ||
    (item.brand?.toLowerCase().includes(q) ?? false) ||
    item.category.toLowerCase().includes(q) ||
    item.tags.some(t => t.includes(q))
  ).slice(0, limit)
}

export function getItemsByCategory(category: string): InventoryItem[] {
  return GROCERY_INVENTORY.filter(item => item.category === category)
}

export function matchInventoryItem(name: string): InventoryItem | null {
  const q = name.toLowerCase().trim()
  // Try exact match first
  const exact = GROCERY_INVENTORY.find(item => item.name.toLowerCase() === q)
  if (exact) return exact
  // Try starts-with
  const startsWith = GROCERY_INVENTORY.find(item => item.name.toLowerCase().startsWith(q.split(' ')[0]))
  if (startsWith) return startsWith
  // Try contains
  const contains = GROCERY_INVENTORY.find(item =>
    item.name.toLowerCase().includes(q.split(' ')[0]) ||
    q.includes(item.name.toLowerCase().split(' ')[0])
  )
  return contains ?? null
}

export const INVENTORY_CATEGORIES = [
  ...new Set(GROCERY_INVENTORY.map(i => i.category))
]

export function getTotalInventoryValue(): number {
  return GROCERY_INVENTORY.reduce((sum, item) => sum + item.price, 0)
}
