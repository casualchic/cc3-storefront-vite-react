# Casual Chic Storefront - Technical Design Document

**Date:** 2025-01-08
**Project:** Casual Chic Boutique E-Commerce Storefront
**Architecture:** Astro + React 19 + Hono + Cloudflare Edge

---

## Executive Summary

This document outlines the technical architecture for a world-class, multi-brand e-commerce storefront built for Casual Chic. The solution leverages edge-first architecture on Cloudflare's global network, combining Astro's static/SSR capabilities with React 19's interactive features to deliver exceptional performance, SEO, and user experience.

**Key Decisions:**
- **Hybrid SSR + Static Architecture** using Astro for SEO-critical pages and React islands for interactivity
- **Shared D1/R2 Infrastructure** with Payload CMS for data autonomy and edge performance
- **Durable Objects** for real-time cart state management
- **Earth-tone brand palette** from official brand guidelines for sophisticated, modern aesthetic

---

## 1. System Architecture

### 1.1 High-Level Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                        External Systems                              │
├──────────────────┬───────────────────────┬──────────────────────────┤
│  Medusa Cloud    │    Payload CMS        │    This Storefront       │
│  (Commerce)      │    (Content)          │    (Frontend)            │
│  - Products      │    - Blog             │    - Astro Pages         │
│  - Inventory     │    - Landing Pages    │    - React 19 Islands    │
│  - Orders        │    - Media            │    - Edge Cache          │
│  - Customers     │    - Marketing        │    - D1 Read Replica     │
└────────┬─────────┴──────────┬────────────┴──────────┬───────────────┘
         │                    │                        │
         ▼                    ▼                        ▼
┌──────────────────────────────────────────────────────────────────────┐
│              Cloudflare Edge Infrastructure                          │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────────┐          │
│  │     D1     │  │     R2     │  │    KV Namespaces     │          │
│  │ (Shared)   │  │ (Shared)   │  │  - Product Cache     │          │
│  │            │  │            │  │  - Category Cache    │          │
│  │  - Products│  │  - Images  │  │  - Search Cache      │          │
│  │  - CMS Data│  │  - Media   │  └──────────────────────┘          │
│  └────────────┘  └────────────┘                                     │
│                                                                      │
│  ┌────────────────────┐         ┌──────────────────────┐           │
│  │  Durable Objects   │         │   Pages Functions    │           │
│  │  - Cart State      │         │   - Hono API         │           │
│  │  - Session Mgmt    │         │   - SSR Routes       │           │
│  └────────────────────┘         └──────────────────────┘           │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | Astro | Latest | Static/SSR pages, SEO optimization |
| **UI Library** | React | 19.0.0 | Interactive components, islands |
| **Backend Framework** | Hono | 4.8.2 | Edge API routes, middleware |
| **Build Tool** | Vite | 6.0.0 | Fast builds, HMR, bundling |
| **Styling** | Tailwind CSS | Latest | Utility-first CSS, brand theming |
| **Edge Runtime** | Cloudflare Workers | Latest | Global deployment, 0ms cold starts |
| **Database** | Cloudflare D1 | Latest | Edge SQL, read replica |
| **Object Storage** | Cloudflare R2 | Latest | Image/media storage |
| **Cache** | Cloudflare KV | Latest | Distributed key-value cache |
| **State Management** | Durable Objects | Latest | Cart/session persistence |
| **TypeScript** | TypeScript | 5.8.3 | Type safety, strict mode |

---

## 2. Architecture Decisions

### 2.1 Why Hybrid SSR + Astro?

**Decision:** Use Astro for SSR/static pages with React 19 islands for interactivity.

**Rationale:**
- **SEO Requirements:** E-commerce requires server-rendered HTML for Google Shopping, rich snippets, and product indexing
- **Performance:** Astro ships zero JS by default, only hydrating React components that need interactivity
- **Core Web Vitals:** SSR delivers FCP < 1s, LCP < 2.5s (world-class targets)
- **Team Familiarity:** Team already uses Astro for blog

**Trade-offs:**
- ✅ Best SEO (full HTML pre-rendered)
- ✅ Best performance (minimal JS payload)
- ✅ Best Core Web Vitals
- ⚠️ Slightly more complex than pure SPA (SSR hydration)
- ✅ Mitigated by Astro's excellent DX

### 2.2 Why Shared D1/R2 with Payload CMS?

**Decision:** Share D1 database and R2 bucket between Storefront and Payload CMS.

**Rationale:**
- **Data Autonomy:** Limited direct access to Medusa Cloud's managed databases (Postgres, Redis, S3)
- **Edge Performance:** D1 replicates globally, sub-10ms reads from edge
- **Flexibility:** CMS can create custom queries, analytics without API limitations
- **Cost Efficiency:** Single D1 database, single R2 bucket vs. separate resources
- **Consistency:** Single source of truth for product + content data

**Data Flow:**
```
Medusa (source) → Scheduled Worker (sync) → D1 (edge replica) → Storefront/CMS (reads)
                                          ↓
                                       KV Cache (1hr TTL)
```

### 2.3 Why Durable Objects for Cart?

**Decision:** Use Durable Objects instead of KV or D1 for cart state.

**Rationale:**
- **Strong Consistency:** Cart needs immediate consistency across requests
- **Low Latency:** Durable Objects provide <10ms reads/writes
- **Transactional:** Atomic operations (add/remove/update cart items)
- **Session Persistence:** State survives across page loads, devices

**Trade-offs:**
- ✅ Real-time consistency
- ✅ Transactional guarantees
- ⚠️ Single-region writes (mitigated by edge reads)
- ✅ Perfect for cart use case

---

## 3. Page Architecture

### 3.1 Page Routing Strategy

| Page | Framework | Rendering | Rationale |
|------|-----------|-----------|-----------|
| **/** (Homepage) | Astro | SSG/ISR | Static hero, featured products, SEO critical |
| **/shop** | Astro | SSR | SEO for category pages, static grid + React filter islands |
| **/product/:id** | Astro | SSR | SEO critical (rich snippets, OG tags), static content + React cart island |
| **/cart** | React SPA | CSR | Highly interactive, private (no SEO), complex state |
| **/checkout** | React SPA | CSR | Multi-step form, private, state-heavy |
| **/search** | Astro | SSR | SEO for search results + React autocomplete island |

### 3.2 File Structure

```
/src/
  /pages/                       # Astro pages (file-based routing)
    index.astro                 # Homepage (SSG)
    shop/
      index.astro               # Shop grid (SSR)
      [...category].astro       # Category pages (SSR)
    product/
      [id].astro                # Product detail (SSR)
    search.astro                # Search results (SSR)
    cart.astro                  # Shell for React SPA
    checkout.astro              # Shell for React SPA

  /components/
    /astro/                     # Astro components
      ProductGrid.astro
      Hero.astro
      CategoryNav.astro
      Footer.astro
      Header.astro

    /react/                     # React components
      /islands/                 # Used as Astro islands
        AddToCart.tsx
        SearchAutocomplete.tsx
        FilterPanel.tsx
        CartPreview.tsx
        QuantitySelector.tsx

      /spa/                     # Full React SPA pages
        Cart/
          CartPage.tsx
          CartItem.tsx
          CartSummary.tsx
        Checkout/
          CheckoutFlow.tsx
          ShippingForm.tsx
          PaymentForm.tsx
          OrderReview.tsx

  /layouts/
    BaseLayout.astro            # Base layout with brand theming
    ProductLayout.astro         # Product page layout

  /lib/
    /api/
      medusa-client.ts          # Medusa SDK wrapper
      payload-client.ts         # Payload CMS client
      cart-api.ts               # Cart operations
      product-api.ts            # Product queries

    /db/
      d1-schema.ts              # D1 database schema
      queries.ts                # D1 query functions
      sync.ts                   # Medusa → D1 sync logic

    /utils/
      theme.ts                  # Multi-brand theme system
      cache.ts                  # KV caching utilities
      format.ts                 # Price, date formatting

  /styles/
    /themes/
      casual-chic.css           # Earth-tone palette
      luxe.css                  # Premium theme (future)
      collection.css            # White label (future)
      bargains.css              # Discount theme (future)
    global.css

/functions/                     # Cloudflare Pages Functions
  api/
    [[path]].ts                 # Hono API routes

/worker/                        # Cloudflare Workers
  cart-durable-object.ts        # Cart state management
  medusa-sync.ts                # Scheduled sync worker

/public/
  /fonts/
  /images/

astro.config.mjs
wrangler.toml
tailwind.config.mjs
tsconfig.json
package.json
```

---

## 4. Data Layer

### 4.1 D1 Database Schema

```sql
-- E-commerce tables (synced from Medusa - read-only for Storefront)
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  handle TEXT UNIQUE NOT NULL,
  thumbnail TEXT,
  price INTEGER NOT NULL,              -- in cents
  compare_at_price INTEGER,
  inventory_quantity INTEGER,
  brand_id TEXT DEFAULT 'casual-chic',
  metadata JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  synced_at TIMESTAMP                  -- Track sync freshness
);

CREATE TABLE product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id),
  title TEXT,
  sku TEXT,
  price INTEGER,
  inventory_quantity INTEGER,
  options JSON,                        -- {size: 'M', color: 'blue'}
  synced_at TIMESTAMP
);

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id TEXT REFERENCES categories(id),
  synced_at TIMESTAMP
);

CREATE TABLE product_categories (
  product_id TEXT REFERENCES products(id),
  category_id TEXT REFERENCES categories(id),
  PRIMARY KEY (product_id, category_id)
);

-- CMS tables (Payload owns - Storefront reads)
CREATE TABLE cms_pages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content JSON,
  meta_title TEXT,
  meta_description TEXT,
  brand_id TEXT DEFAULT 'casual-chic',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE cms_blocks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSON,
  brand_id TEXT DEFAULT 'casual-chic',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP
);

CREATE TABLE cms_media (
  id TEXT PRIMARY KEY,
  r2_key TEXT UNIQUE NOT NULL,
  filename TEXT,
  mime_type TEXT,
  size INTEGER,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  uploaded_at TIMESTAMP
);

-- Storefront-specific (not synced)
CREATE TABLE search_cache (
  query TEXT PRIMARY KEY,
  results JSON,
  created_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_handle ON products(handle);
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_categories_handle ON categories(handle);
CREATE INDEX idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX idx_cms_pages_brand ON cms_pages(brand_id, published);
```

### 4.2 Caching Strategy

**3-Tier Caching:**

1. **KV Cache (Edge)** - 1hr TTL
   - Product catalog
   - Category listings
   - CMS content blocks
   - Search results (15min TTL)

2. **D1 (Edge SQL)** - 5min sync interval
   - Synced product data from Medusa
   - CMS content from Payload
   - Sub-10ms query latency

3. **Browser Cache** - Client-side
   - Static assets (1 year)
   - Product images (1 month)
   - API responses (as directed by Cache-Control headers)

**Cache Invalidation:**
- **Product updates:** Medusa sync worker clears KV cache every 5min
- **CMS updates:** Payload webhook clears specific KV keys
- **Manual:** Admin API to purge cache

### 4.3 Data Sync Pipeline

**Medusa → D1 Sync (Scheduled Worker):**

```typescript
// Runs every 5 minutes via cron trigger
export default {
  async scheduled(event: ScheduledEvent, env: Env) {
    // 1. Fetch products from Medusa API
    const products = await fetchMedusaProducts(env);

    // 2. Upsert to D1
    for (const product of products) {
      await upsertProduct(env.DB, product);
    }

    // 3. Clear KV cache
    await env.PRODUCT_CACHE.delete('products:*');

    console.log(`Synced ${products.length} products`);
  }
};
```

**Payload → D1 Sync (Webhook):**

```typescript
// Payload CMS afterChange hook
export const PageCollection: CollectionConfig = {
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Sync to D1
        await req.env.DB.prepare(`
          INSERT INTO cms_pages (...)
          VALUES (...)
          ON CONFLICT(id) DO UPDATE SET ...
        `).run();

        // Clear KV cache
        await req.env.CONTENT_CACHE.delete(`page:${doc.slug}`);
      }
    ]
  }
};
```

---

## 5. Brand Theming System

### 5.1 Brand Configuration

Based on official brand guidelines, using earth-tone palette:

```typescript
export const BRANDS = {
  'casual-chic': {
    name: 'Casual Chic Boutique',
    colors: {
      primary: '#A3BD84',      // Sage green (35% usage)
      secondary: '#CC8881',    // Dusty rose (15%)
      accent: '#E5C77C',       // Golden sand (15%)
      sage: '#A6A998',         // Olive sage (15%)
      slate: '#99ADBD',        // Slate blue (5%)
      forest: '#676B5D',       // Deep forest (5%)
      neutral: '#FBF0E5',      // Cream backgrounds
    },
    fonts: {
      heading: 'Big Caslon, Georgia, serif',
      body: 'Avenir Book, sans-serif',
    }
  }
};
```

### 5.2 Runtime Theme Switching

**Server-side theme detection:**

```typescript
// Astro middleware
export const onRequest = defineMiddleware((context, next) => {
  const host = context.request.headers.get('host') || '';
  const brandId = getBrandFromDomain(host);

  context.locals.brand = brandId;
  context.locals.themeCSS = getThemeCSS(brandId);

  return next();
});
```

**CSS Variable injection:**

```astro
<head>
  <style is:inline set:html={Astro.locals.themeCSS}></style>
</head>
```

**Tailwind classes:**

```tsx
<button className="bg-primary text-white hover:bg-sage">
  Add to Cart
</button>
```

---

## 6. API Architecture

### 6.1 Hono API Routes

**Base URL:** `/api/*`

**Key Routes:**

| Method | Endpoint | Purpose | Cache |
|--------|----------|---------|-------|
| GET | `/api/products` | List products (paginated, filtered) | KV 1hr |
| GET | `/api/products/:id` | Single product details | KV 1hr |
| GET | `/api/products/search` | Search with autocomplete | KV 15min |
| GET | `/api/categories` | Category tree | KV 1hr |
| POST | `/api/cart/add` | Add item to cart | None |
| POST | `/api/cart/remove` | Remove from cart | None |
| GET | `/api/cart` | Get cart contents | None |
| POST | `/api/checkout/create` | Create order in Medusa | None |

**Authentication:**
- Session ID in `X-Session-ID` header
- JWT for authenticated users (future)

**Rate Limiting:**
- 100 requests/min per IP (via KV counter)
- 1000 requests/min per session

### 6.2 Durable Object Interface

**Cart Operations:**

```typescript
interface CartAPI {
  POST /add      { productId, variantId, quantity }
  POST /remove   { itemId }
  POST /update   { itemId, quantity }
  GET  /get      → { items[], total }
  POST /clear    → { items: [], total: 0 }
}
```

**State Structure:**

```typescript
interface Cart {
  items: CartItem[];
  total: number;
  updatedAt: string;
}
```

---

## 7. Performance Optimization

### 7.1 Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| **TTFB** | < 200ms | Edge SSR, global D1 replication |
| **FCP** | < 1.0s | Server-rendered HTML, critical CSS inline |
| **LCP** | < 2.5s | Optimized images, preload fonts |
| **TBT** | < 200ms | Minimal JS, code splitting |
| **CLS** | < 0.1 | Size images, reserve space |
| **Lighthouse** | > 90 | All optimizations combined |

### 7.2 Image Optimization

```typescript
// Cloudflare Image Resizing
function getOptimizedImageUrl(r2Key: string, width: number) {
  return `/cdn-cgi/image/width=${width},format=auto,quality=85/${r2Key}`;
}

// In Astro template
<img
  src={getOptimizedImageUrl(product.thumbnail, 800)}
  srcset={`
    ${getOptimizedImageUrl(product.thumbnail, 400)} 400w,
    ${getOptimizedImageUrl(product.thumbnail, 800)} 800w,
    ${getOptimizedImageUrl(product.thumbnail, 1200)} 1200w
  `}
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  alt={product.title}
  loading="lazy"
/>
```

### 7.3 Code Splitting

- **Route-based:** Astro automatically splits per page
- **React islands:** Lazy load with `client:visible` or `client:idle`
- **Dynamic imports:** Heavy components loaded on interaction

### 7.4 Bundle Size Targets

| Component | Size Limit | Current |
|-----------|-----------|---------|
| **Client bundle** | < 100KB gzipped | TBD |
| **Worker bundle** | < 1MB | TBD |
| **Page Functions** | < 1MB | TBD |

---

## 8. SEO Strategy

### 8.1 Technical SEO

**Meta Tags (Server-Rendered):**

```astro
---
const product = await getProduct(id);
const schema = {
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": product.title,
  "image": product.thumbnail,
  "description": product.description,
  "offers": {
    "@type": "Offer",
    "price": product.price / 100,
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
};
---

<head>
  <title>{product.title} | Casual Chic Boutique</title>
  <meta name="description" content={product.description} />

  <!-- Open Graph -->
  <meta property="og:title" content={product.title} />
  <meta property="og:description" content={product.description} />
  <meta property="og:image" content={product.thumbnail} />
  <meta property="og:type" content="product" />

  <!-- Structured Data -->
  <script type="application/ld+json" set:html={JSON.stringify(schema)} />
</head>
```

### 8.2 Sitemap Generation

```typescript
// Dynamic sitemap from D1
export async function GET({ locals }) {
  const { results: products } = await locals.runtime.env.DB
    .prepare('SELECT handle, updated_at FROM products')
    .all();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${products.map(p => `
        <url>
          <loc>https://casualchicboutique.com/product/${p.handle}</loc>
          <lastmod>${p.updated_at}</lastmod>
          <changefreq>daily</changefreq>
        </url>
      `).join('')}
    </urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
```

---

## 9. Deployment Strategy

### 9.1 CI/CD Pipeline

```yaml
# GitHub Actions
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
```

### 9.2 Environment Strategy

| Environment | URL | Purpose |
|-------------|-----|---------|
| **Development** | localhost:5173 | Local dev with Vite |
| **Staging** | staging.casualchicboutique.com | Pre-production testing |
| **Production** | casualchicboutique.com | Live site |

### 9.3 Rollback Strategy

- **Git-based:** Revert commit, redeploy
- **Cloudflare:** Instant rollback via Workers dashboard
- **Gradual rollouts:** 5% → 25% → 100% traffic shifting

---

## 10. React 19 Features

### 10.1 use() Hook for Data Fetching

```typescript
import { use } from 'react';

function ProductDetails({ productPromise }) {
  const product = use(productPromise);
  return <div>{product.title}</div>;
}
```

### 10.2 useFormStatus for Forms

```typescript
import { useFormStatus } from 'react-dom';

function CheckoutButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? 'Processing...' : 'Place Order'}
    </button>
  );
}
```

### 10.3 useOptimistic for Cart Updates

```typescript
import { useOptimistic } from 'react';

function CartItem({ item }) {
  const [optimisticQty, updateOptimistic] = useOptimistic(
    item.quantity,
    (state, newQty) => newQty
  );

  return (
    <input
      value={optimisticQty}
      onChange={(e) => {
        updateOptimistic(e.target.value);
        updateCartAPI(item.id, e.target.value);
      }}
    />
  );
}
```

---

## 11. Testing Strategy

### 11.1 Test Coverage

| Type | Tool | Coverage Target |
|------|------|----------------|
| **Unit Tests** | Vitest | > 80% |
| **Component Tests** | React Testing Library | Key components |
| **E2E Tests** | Playwright | Critical flows |
| **Performance** | Lighthouse CI | > 90 score |

### 11.2 Critical User Flows

1. **Browse → Add to Cart → Checkout**
2. **Search → Product → Add to Cart**
3. **Category Filter → Product → Purchase**

---

## 12. Security Considerations

### 12.1 API Security

- **CORS:** Whitelist known domains
- **Rate Limiting:** KV-based request throttling
- **Input Validation:** Zod schemas for all API inputs
- **SQL Injection:** Prepared statements only (D1)

### 12.2 Payment Security

- **PCI Compliance:** Handled by Medusa/payment processor
- **No card storage:** Tokens only
- **HTTPS Only:** Enforced by Cloudflare

---

## 13. Monitoring & Observability

### 13.1 Metrics

- **Cloudflare Analytics:** Traffic, errors, latency
- **Workers Analytics:** Request volume, execution time
- **D1 Metrics:** Query performance
- **Custom Logs:** Structured logging to Workers Logpush

### 13.2 Alerting

- **Error Rate:** > 1% trigger
- **Latency:** P95 > 500ms
- **Availability:** < 99.9% uptime

---

## 14. Future Enhancements

### 14.1 Phase 2 (Post-Launch)

- [ ] Remaining 3 brands (Luxe, Collection, Bargains)
- [ ] Wishlist functionality
- [ ] Product reviews/ratings
- [ ] AI product recommendations
- [ ] Personalization engine
- [ ] Social login (Google, Apple)
- [ ] SMS marketing integration

### 14.2 Performance Optimizations

- [ ] Service Worker for offline support
- [ ] Prefetch next page resources on hover
- [ ] Image placeholder with BlurHash
- [ ] WebP + AVIF format support

---

## 15. Migration Path

### 15.1 From Current State

**Current:** Minimal Vite + React template
**Target:** Full e-commerce storefront

**Steps:**
1. Install Astro, configure hybrid mode
2. Set up D1 database, run schema migrations
3. Configure R2 bucket, KV namespaces
4. Implement Medusa sync worker
5. Build core pages (homepage, shop, product)
6. Implement cart with Durable Objects
7. Integrate checkout with Medusa
8. Deploy to Cloudflare Pages

### 15.2 Coordination with Payload CMS

- Share D1 database ID (coordinate with CMS team)
- Share R2 bucket name
- Establish sync protocols (webhooks)
- Define content schema for shared tables

---

## Conclusion

This architecture delivers world-class e-commerce performance through:

1. **Edge-first SSR** for SEO and Core Web Vitals
2. **Shared infrastructure** for data autonomy and cost efficiency
3. **React 19 islands** for modern interactivity
4. **Cloudflare's global network** for sub-100ms latency worldwide
5. **Earth-tone brand palette** for sophisticated, on-trend aesthetic

The design is production-ready, scalable to 4 brands, and optimized for conversion and customer experience.
