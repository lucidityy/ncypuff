# Mini App Template

Next.js 15 (App Router) template for mobile-first mini apps with admin panel, cart, checkout, and product catalog.

**Stack:** Next.js 15 · React 18 · TypeScript (strict) · Tailwind CSS 3.4 · Radix UI · Framer Motion · Zod · Upstash Redis · Vercel Blob

---

## Quick Start

```bash
# 1. Copy this template
cp -r mini-app-template my-new-app
cd my-new-app

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local — at minimum set ADMIN_PASSWORD and ADMIN_SESSION_SECRET

# 4. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## What's Included

### Pages (App Router)

| Route | Description |
|-------|-------------|
| `/` | Home — hero banner, trust badges, featured products |
| `/catalog` | Full catalog with search, filters, sorting |
| `/product/[slug]` | Product detail page with add-to-cart |
| `/cart` | Shopping cart with quantity controls |
| `/checkout` | Checkout form → sends order via WhatsApp/Signal/Snapchat |
| `/offers` | Active promo codes display |
| `/store` | About / contact info page |
| `/admin` | Admin dashboard (protected) |
| `/admin/login` | Admin login |
| `/admin/product/new` | Create product |
| `/admin/product/[id]` | Edit / delete product |

### Features

- **Product Catalog** — CRUD via admin, search + filter + sort, category management
- **Shopping Cart** — Context-based, localStorage persistence, stock-aware
- **Checkout** — Address form, order note, promo codes, sends order text via messaging apps
- **Promo Codes** — percent / fixed / sample types, admin-managed, validated server-side
- **Admin Panel** — Cookie-based auth (HMAC signed, timing-safe), product CRUD, category management, promo code management, password change
- **Image Upload** — Vercel Blob integration for product images
- **Data Layer** — Upstash Redis in production, JSON files in dev (auto-fallback)
- **Dark Theme** — Neon accent, grain texture, glass morphism, custom animations

### Architecture

```
app/                    → Pages & API routes (App Router)
  api/                  → Route handlers (products, admin, promo)
  admin/                → Admin pages (protected + public groups)
components/
  ui/                   → Primitives (Button, Input, Card, Badge, Select, Textarea)
  admin/                → Admin components (forms, managers)
  cart/                 → Cart UI (item, quantity selector, price)
  checkout/             → Checkout components (promo, contact, summary)
  layout/               → App header, main shell
  navigation/           → Bottom nav bar
  product/              → Catalog components (card, grid, filters, search)
  shared/               → Reusable (SectionTitle, EmptyState, StoreInfoCard)
hooks/
  useCart.ts            → Cart context + localStorage
  useProducts.ts        → Product fetching
  useFilters.ts         → Search, category, tag, sort
  useCheckoutFormPersist.ts → Checkout draft persistence
lib/
  constants.ts          → ⭐ Brand config, contact links, labels
  format.ts             → Price & quantity formatting (currency/locale)
  admin-env.ts          → Admin env validation
  admin-session.ts      → HMAC cookie session
  require-admin-api.ts  → API route guard
  products-repository.ts → Redis/file persistence for products & categories
  promo-repository.ts   → Redis/file persistence for promo codes
  admin-password-repository.ts → Password override storage
  promo-apply.ts        → Promo code application logic
  fetch-json.ts         → Typed fetch wrapper
  slug.ts               → URL slug generation
  checkout-draft.ts     → Checkout localStorage draft
  validations/          → Zod schemas (product, promo, password)
types/                  → TypeScript types (Product, Cart, Checkout, Promo)
data/                   → Seed data (products, categories, promo codes)
```

---

## Customization Guide

### 1. Branding

Edit `lib/constants.ts`:

```typescript
export const BRAND = {
  shortName: "YB",        // Shown in header, order text
  fullName: "Your Brand",  // Page title, header subtitle
  tagline: "Your tagline",
  since: "Since 2024",
  logo: "/brand/logo.png",
  banner: "/brand/banner.png",
  sticker: "/brand/sticker.png"
};

export const CONTACT_LINKS = {
  whatsapp: "https://wa.me/33XXXXXXXXX",
  signal: "https://signal.me/#p/+33XXXXXXXXX",
  snapchat: "https://www.snapchat.com/add/YOUR_USERNAME"
};

export const DELIVERY_LABEL = "Livraison à domicile";
```

Add your brand images to `public/brand/` (logo.png, banner.png, sticker.png).

### 2. Products & Categories

- **Seed data:** Edit `data/products.ts` and `data/categories.ts`
- **Product model:** Edit `types/product.ts` (add/remove fields, change tag options)
- **Tags:** Update `ProductTag` type + `ALL_TAGS` in `components/admin/product-form.tsx`
- **Validation:** Update `lib/validations/product.ts` if you change the schema

### 3. Theme & Colors

Edit `tailwind.config.ts` to change the color palette:

```typescript
colors: {
  background: "#0d1117",    // Page background
  surface: "#161b22",       // Card backgrounds
  accent: "#39ff14",        // Primary accent (neon green)
  // ... change accent to match your brand
}
```

Edit `app/globals.css` to update the neon glow colors (search for `rgba(57,255,20`).

Edit font imports in `globals.css` and font families in `tailwind.config.ts`.

### 4. Currency & Locale

Edit `lib/format.ts`:

```typescript
const CURRENCY = "EUR";  // Change to "USD", "GBP", etc.
const LOCALE = "fr-FR";  // Change to "en-US", "en-GB", etc.
```

### 5. Contact Methods

The checkout sends orders via messaging apps. To change available methods:
- Edit `types/checkout.ts` — `ContactMethod` type
- Edit `components/checkout/contact-method-selector.tsx` — METHODS array
- Edit `app/checkout/page.tsx` — CTA_LABELS and CTA_ORDER
- Edit `lib/constants.ts` — CONTACT_LINKS

### 6. Unit System

Products use a generic quantity model. If you sell by weight/volume:
- Call `formatQuantity(value, "g")` or `formatQuantity(value, "ml")`
- Set `unit` prop on `QuantitySelector` component

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_PASSWORD` | Yes (for admin) | Admin login password |
| `ADMIN_SESSION_SECRET` | Yes (for admin) | HMAC signing key (min 16 chars) |
| `ADMIN_USERNAME` | No | Defaults to "Admin" |
| `UPSTASH_REDIS_REST_URL` | Production | Upstash Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Production | Upstash Redis token |
| `BLOB_READ_WRITE_TOKEN` | For uploads | Vercel Blob token |

**Dev mode:** Without Redis, data is stored in `data/*.json` files (gitignored). The app seeds from `data/products.ts` on first access.

**Production:** Set Redis credentials. Data is stored in Upstash Redis. Image uploads go to Vercel Blob.

---

## Deploy

```bash
# Vercel (recommended)
npm run deploy

# Or manual
npm run build
npm start
```

Set all required env variables in your Vercel project settings.

---

## Project Conventions

- **Components:** Dumb UI + smart hooks (no business logic in components)
- **Data fetching:** Route Handlers (`app/api/`) + client `fetchJson` hook
- **Validation:** Zod schemas in `lib/validations/`, shared between client and server
- **Persistence:** Repository pattern (`lib/*-repository.ts`) — Redis in prod, JSON files in dev
- **Auth:** Cookie-based HMAC sessions, timing-safe comparison
- **Styling:** Tailwind utility classes, CVA for variant components, Radix for accessible primitives
