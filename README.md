# AutoCart 🛒

**Build and share automatic grocery carts.** AutoCart lets creators, meal prep influencers, and everyday shoppers build, browse, and generate complete shopping lists — with dietary substitutions, brand preferences, and a clean API layer ready for Walmart, Kroger, Instacart, and more.

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### 1. Install dependencies

```bash
cd AutoCart
npm install
```

### 2. Set up environment (optional — app works without Supabase)

```bash
cp .env.local.example .env.local
# Add your Supabase credentials to .env.local if you want a real database
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app will load with demo data immediately.

---

## Demo Login

Click **"Try Demo Mode"** on the login page to sign in as `@macromaster` and see the full creator experience. You can also click **"Sign Up"** to create a demo account.

---

## Project Structure

```
autocart/
├── app/                         # Next.js 14 App Router
│   ├── page.tsx                 # Landing / marketing page
│   ├── layout.tsx               # Root layout (fonts, providers, toaster)
│   ├── globals.css              # Design system CSS variables & utilities
│   ├── (auth)/                  # Auth group (no sidebar)
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   └── (app)/                   # App group (requires auth, shows sidebar)
│       ├── layout.tsx           # Auth guard + sidebar layout
│       ├── dashboard/page.tsx   # Main dashboard
│       ├── browse/page.tsx      # Public cart discovery
│       ├── create/page.tsx      # Multi-step cart creation flow
│       ├── cart/[id]/page.tsx   # Cart detail + generate modal
│       └── profile/[username]/page.tsx  # User / creator profile
│
├── components/
│   ├── ui/                      # Primitive UI components
│   │   ├── Button.tsx           # Button with variants, loading state
│   │   ├── Badge.tsx            # Colored badge/pill
│   │   ├── Input.tsx            # Input, Textarea, Select
│   │   └── Toggle.tsx           # On/off toggle switch
│   ├── layout/                  # App scaffolding
│   │   ├── MarketingNav.tsx     # Sticky landing page navigation
│   │   ├── Sidebar.tsx          # App sidebar (authenticated)
│   │   └── Footer.tsx           # Marketing footer
│   └── autocart/                # Domain-specific components
│       ├── CartCard.tsx         # Feed / grid cart card
│       ├── DietaryBadges.tsx    # Dietary label pills
│       └── GenerateModal.tsx    # Cart generation modal
│
├── contexts/
│   └── AuthContext.tsx          # Auth state + mock signIn/signUp/signOut
│
├── lib/
│   ├── types.ts                 # All TypeScript interfaces (User, AutoCart, etc.)
│   ├── utils.ts                 # Formatting, category configs, helpers
│   ├── seed-data.ts             # 6 realistic demo AutoCarts + users
│   ├── supabase.ts              # Supabase client + query helpers
│   └── groceryProviders/       # Grocery API abstraction layer
│       ├── types.ts             # GroceryProvider interface + provider registry
│       ├── index.ts             # Registry + generateGroceryCart() orchestrator
│       ├── mockProvider.ts      # Fully working demo provider
│       ├── walmart.ts           # Placeholder (with implementation guide)
│       ├── kroger.ts            # Placeholder with OAuth2 notes
│       └── instacart.ts         # Placeholder with Instacart Connect notes
│
└── supabase/
    └── schema.sql               # Full Postgres schema + RLS policies
```

---

## Connecting a Real Database (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in your Supabase SQL editor
3. Add your credentials to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
4. Update `contexts/AuthContext.tsx` — uncomment the Supabase `signIn`/`signUp` calls and remove the mock localStorage logic.

---

## Connecting a Grocery API

The grocery provider layer in `lib/groceryProviders/` is designed as a plug-in system. To add a real provider:

1. Add credentials to `.env.local`
2. Open the provider file (e.g. `lib/groceryProviders/walmart.ts`)
3. Implement the methods marked with `// TODO`
4. Change `available: false` → `available: true` in the provider class
5. The `generateGroceryCart()` function in `lib/groceryProviders/index.ts` will automatically route to your new provider

All providers implement the same `GroceryProvider` interface, so the rest of the app needs no changes.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Fonts | Syne (display) + DM Sans (body) |
| Auth/DB | Supabase (mock localStorage for demo) |
| Animations | CSS keyframes via Tailwind |
| Icons | lucide-react |
| Toasts | react-hot-toast |

---

## Features

- **Landing page** — Hero, how it works, features, featured carts, CTA
- **Auth** — Sign up / sign in (mock + Supabase-ready), user type selection
- **Dashboard** — Stats, my carts, trending, quick-create CTA
- **Browse** — Search, category filters, dietary filters, sort options
- **Create flow** — 4-step form: info → items → dietary → review/publish
- **Cart detail** — Full item list, generate modal, like/save/share/duplicate
- **Profile** — Public creator profile, follower count, all published carts
- **Generate modal** — Retailer selector, dietary substitutions, cart result preview
- **Grocery provider layer** — Clean abstraction for Walmart, Kroger, Instacart, H-E-B, etc.
- **Supabase schema** — Full normalized schema with RLS policies, triggers, full-text search

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#07080C` (surface-950) |
| Card | `#0C0D12` (surface-800) |
| Brand green | `#4ade80` (brand-400) |
| Accent orange | `#fb923c` (accent-400) |
| Display font | Syne (bold, geometric) |
| Body font | DM Sans (clean, readable) |

---

## Future Roadmap

- [ ] Connect Walmart API (affiliate product search)
- [ ] Connect Kroger API (OAuth2 + Cart API)
- [ ] Connect Instacart Connect (shoppable links)
- [ ] Real-time inventory availability
- [ ] Nutrition summary per cart
- [ ] Creator analytics dashboard
- [ ] Follower system
- [ ] Push notifications for new creator carts
- [ ] Cart remixing / forking with attribution
- [ ] Mobile app (React Native)
- [ ] Monetization: creator tipping, affiliate revenue share

---

Built with ❤️ using AutoCart.
