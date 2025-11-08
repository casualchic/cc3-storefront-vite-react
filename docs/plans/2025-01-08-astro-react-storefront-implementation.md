# Casual Chic Storefront Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready, world-class e-commerce storefront for Casual Chic using Astro + React 19 + Hono on Cloudflare Edge.

**Architecture:** Hybrid SSR/static pages with Astro for SEO-critical content (homepage, product pages, shop), React 19 islands for interactivity (cart, search, filters), Hono API on Cloudflare Pages Functions, D1 for edge SQL, R2 for media, Durable Objects for cart state.

**Tech Stack:** Astro (latest), React 19, Hono 4.8.2, Vite 6, Tailwind CSS, Cloudflare Workers/Pages, D1, R2, KV, Durable Objects, TypeScript 5.8.3 strict mode

---

## Task 1: Project Setup & Dependencies

**Files:**
- Modify: `package.json`
- Create: `astro.config.mjs`
- Modify: `tsconfig.json`
- Create: `.env.example`

**Step 1: Install Astro and core dependencies**

Run:
```bash
npm install astro@latest @astrojs/react@latest @astrojs/tailwind@latest @astrojs/cloudflare@latest
```

Expected: Dependencies installed successfully

**Step 2: Install React 19 and UI dependencies**

Run:
```bash
npm install react@19.0.0 react-dom@19.0.0
npm install -D @types/react@19.0.10 @types/react-dom@19.0.4
```

Expected: React 19 installed

**Step 3: Install Tailwind CSS and styling dependencies**

Run:
```bash
npm install tailwindcss@latest autoprefixer@latest postcss@latest
npm install @tailwindcss/typography@latest
```

Expected: Tailwind installed

**Step 4: Install Hono and API dependencies**

Run:
```bash
npm install hono@4.8.2 zod@latest
```

Expected: Hono installed

**Step 5: Create Astro configuration**

Create `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    })
  ],
  vite: {
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }
});
```

**Step 6: Create environment variables template**

Create `.env.example`:
```bash
# Medusa Cloud
MEDUSA_API_URL=https://your-instance.medusajs.com
MEDUSA_API_KEY=your_api_key

# Payload CMS
PAYLOAD_API_URL=https://cms.casualchicboutique.com
PAYLOAD_API_KEY=your_api_key

# Cloudflare (set via wrangler)
# D1_DATABASE_ID=
# R2_BUCKET_NAME=
```

**Step 7: Update package.json scripts**

Modify `package.json`:
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro",
    "deploy": "npm run build && wrangler pages deploy ./dist",
    "wrangler": "wrangler",
    "cf-typegen": "wrangler types"
  }
}
```

**Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs .env.example
git commit -m "feat: add Astro + React 19 + Hono dependencies

- Configure Astro with hybrid mode (SSR + static)
- Add Cloudflare adapter for Pages deployment
- Install React 19 for islands
- Add Tailwind CSS for styling
- Configure environment variables"
```

---

## Task 2: TypeScript Configuration

**Files:**
- Modify: `tsconfig.json`
- Create: `tsconfig.astro.json`
- Create: `src/env.d.ts`

**Step 1: Create Astro TypeScript config**

Create `tsconfig.astro.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "types": ["@cloudflare/workers-types"]
  }
}
```

**Step 2: Update root tsconfig.json**

Modify `tsconfig.json`:
```json
{
  "extends": "./tsconfig.astro.json",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Step 3: Create environment type definitions**

Create `src/env.d.ts`:
```typescript
/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    brand: string;
    themeCSS: string;
  }
}

interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  PRODUCT_CACHE: KVNamespace;
  CATEGORY_CACHE: KVNamespace;
  SEARCH_CACHE: KVNamespace;
  CART: DurableObjectNamespace;
  MEDUSA_API_URL: string;
  MEDUSA_API_KEY: string;
  PAYLOAD_API_URL: string;
  PAYLOAD_API_KEY: string;
}
```

**Step 4: Commit**

```bash
git add tsconfig.json tsconfig.astro.json src/env.d.ts
git commit -m "feat: configure TypeScript with strict mode

- Extend Astro strict tsconfig
- Add path aliases (@/*)
- Define Cloudflare runtime types
- Add environment bindings for D1, R2, KV, Durable Objects"
```

---

## Task 3: Tailwind CSS Configuration

**Files:**
- Create: `tailwind.config.mjs`
- Create: `src/styles/global.css`

**Step 1: Create Tailwind configuration**

Create `tailwind.config.mjs`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        sage: 'var(--color-sage)',
        slate: 'var(--color-slate)',
        taupe: 'var(--color-taupe)',
        forest: 'var(--color-forest)',
        neutral: 'var(--color-neutral)',
        charcoal: 'var(--color-charcoal)',
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
        button: 'var(--font-button)',
      },
      spacing: {
        'thumb-zone': '44px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

**Step 2: Create global CSS with Tailwind directives**

Create `src/styles/global.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

**Step 3: Commit**

```bash
git add tailwind.config.mjs src/styles/global.css
git commit -m "feat: configure Tailwind CSS with brand theming

- Add CSS variable-based color system
- Configure custom font families
- Add mobile-friendly thumb-zone spacing
- Include typography plugin"
```

---

## Task 4: Brand Theme System

**Files:**
- Create: `src/lib/utils/theme.ts`
- Create: `src/styles/themes/casual-chic.css`

**Step 1: Create brand configuration utility**

Create `src/lib/utils/theme.ts`:
```typescript
export const BRANDS = {
  'casual-chic': {
    name: 'Casual Chic Boutique',
    domain: 'casualchicboutique.com',
    description: 'Modern, approachable, earth tones',
    colors: {
      primary: '#A3BD84',
      secondary: '#CC8881',
      accent: '#E5C77C',
      sage: '#A6A998',
      slate: '#99ADBD',
      taupe: '#A3BD84',
      forest: '#676B5D',
      neutral: '#FBF0E5',
      charcoal: '#C4BFB9',
      text: '#1A1A1A',
      background: '#FAFAF8',
    },
    fonts: {
      heading: 'Big Caslon, Georgia, serif',
      body: 'Avenir Book, -apple-system, BlinkMacSystemFont, sans-serif',
      button: 'Avenir Book, -apple-system, BlinkMacSystemFont, sans-serif',
    },
    typography: {
      headingWeight: '500',
      bodyWeight: '400',
    }
  },
} as const;

export type BrandId = keyof typeof BRANDS;

export function getBrandFromDomain(domain: string): BrandId {
  const brand = Object.entries(BRANDS).find(
    ([_, config]) => domain.includes(config.domain)
  );
  return (brand?.[0] as BrandId) || 'casual-chic';
}

export function getThemeCSS(brandId: BrandId): string {
  const brand = BRANDS[brandId];
  return `
    :root {
      --color-primary: ${brand.colors.primary};
      --color-secondary: ${brand.colors.secondary};
      --color-accent: ${brand.colors.accent};
      --color-sage: ${brand.colors.sage};
      --color-slate: ${brand.colors.slate};
      --color-taupe: ${brand.colors.taupe};
      --color-forest: ${brand.colors.forest};
      --color-neutral: ${brand.colors.neutral};
      --color-charcoal: ${brand.colors.charcoal};
      --color-text: ${brand.colors.text};
      --color-background: ${brand.colors.background};

      --font-heading: ${brand.fonts.heading};
      --font-body: ${brand.fonts.body};
      --font-button: ${brand.fonts.button};

      --font-weight-heading: ${brand.typography.headingWeight};
      --font-weight-body: ${brand.typography.bodyWeight};
    }
  `;
}
```

**Step 2: Create brand-specific CSS**

Create `src/styles/themes/casual-chic.css`:
```css
/* Casual Chic Boutique - Earth Tone Palette */
/* Based on official brand guidelines */

@import url('https://fonts.googleapis.com/css2?family=Big+Caslon:wght@500&display=swap');

:root[data-brand="casual-chic"] {
  /* Colors from brand guidelines */
  --color-primary: #A3BD84;       /* Sage green - 35% */
  --color-secondary: #CC8881;     /* Dusty rose - 15% */
  --color-accent: #E5C77C;        /* Golden sand - 15% */
  --color-sage: #A6A998;          /* Olive sage - 15% */
  --color-slate: #99ADBD;         /* Slate blue - 5% */
  --color-forest: #676B5D;        /* Deep forest - 5% */
  --color-neutral: #FBF0E5;       /* Cream backgrounds */
  --color-charcoal: #C4BFB9;      /* Mid gray */
  --color-text: #1A1A1A;
  --color-background: #FAFAF8;
}
```

**Step 3: Commit**

```bash
git add src/lib/utils/theme.ts src/styles/themes/casual-chic.css
git commit -m "feat: implement brand theming system with earth tones

- Add brand configuration with official color palette
- Implement CSS variable-based theme switching
- Add Big Caslon font for headings
- Support domain-based brand detection"
```

---

## Task 5: Astro Middleware for Brand Detection

**Files:**
- Create: `src/middleware/index.ts`

**Step 1: Create brand detection middleware**

Create `src/middleware/index.ts`:
```typescript
import { defineMiddleware } from 'astro:middleware';
import { getBrandFromDomain, getThemeCSS } from '@/lib/utils/theme';

export const onRequest = defineMiddleware(async (context, next) => {
  // Detect brand from domain
  const host = context.request.headers.get('host') || '';
  const brandId = getBrandFromDomain(host);

  // Inject brand context into locals
  context.locals.brand = brandId;
  context.locals.themeCSS = getThemeCSS(brandId);

  return next();
});
```

**Step 2: Commit**

```bash
git add src/middleware/index.ts
git commit -m "feat: add Astro middleware for brand detection

- Detect brand from request domain
- Inject brand ID and theme CSS into locals
- Available to all Astro pages via Astro.locals"
```

---

## Task 6: Base Layout with Theme Injection

**Files:**
- Create: `src/layouts/BaseLayout.astro`

**Step 1: Create base layout component**

Create `src/layouts/BaseLayout.astro`:
```astro
---
import '@/styles/global.css';

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const { title, description, ogImage } = Astro.props;
const brand = Astro.locals.brand || 'casual-chic';
const themeCSS = Astro.locals.themeCSS || '';
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!DOCTYPE html>
<html lang="en" data-brand={brand}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href={canonicalURL} />

    <title>{title}</title>
    {description && <meta name="description" content={description} />}

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    {description && <meta property="og:description" content={description} />}
    {ogImage && <meta property="og:image" content={ogImage} />}
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:type" content="website" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    {description && <meta name="twitter:description" content={description} />}
    {ogImage && <meta name="twitter:image" content={ogImage} />}

    <!-- Inject brand-specific CSS variables -->
    <style is:inline set:html={themeCSS}></style>

    <!-- Preconnect to external domains -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <meta name="generator" content={Astro.generator} />
  </head>
  <body class="font-body bg-background text-text antialiased">
    <slot />
  </body>
</html>
```

**Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: create base layout with SEO and theme injection

- Add comprehensive meta tags for SEO
- Inject brand-specific CSS variables
- Include Open Graph and Twitter Card tags
- Add font preconnect for performance"
```

---

## Task 7: D1 Database Schema

**Files:**
- Create: `schema.sql`
- Create: `src/lib/db/schema.ts`

**Step 1: Create SQL schema file**

Create `schema.sql`:
```sql
-- E-commerce tables (synced from Medusa - read-only for Storefront)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  handle TEXT UNIQUE NOT NULL,
  thumbnail TEXT,
  price INTEGER NOT NULL,
  compare_at_price INTEGER,
  inventory_quantity INTEGER,
  brand_id TEXT DEFAULT 'casual-chic',
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  title TEXT,
  sku TEXT,
  price INTEGER,
  inventory_quantity INTEGER,
  options JSON,
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id TEXT REFERENCES categories(id),
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_categories (
  product_id TEXT NOT NULL REFERENCES products(id),
  category_id TEXT NOT NULL REFERENCES categories(id),
  PRIMARY KEY (product_id, category_id)
);

-- CMS tables (Payload owns - Storefront reads)
CREATE TABLE IF NOT EXISTS cms_pages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content JSON,
  meta_title TEXT,
  meta_description TEXT,
  brand_id TEXT DEFAULT 'casual-chic',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cms_blocks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSON,
  brand_id TEXT DEFAULT 'casual-chic',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cms_media (
  id TEXT PRIMARY KEY,
  r2_key TEXT UNIQUE NOT NULL,
  filename TEXT,
  mime_type TEXT,
  size INTEGER,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_handle ON products(handle);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_handle ON categories(handle);
CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_brand ON cms_pages(brand_id, published);
```

**Step 2: Create TypeScript schema types**

Create `src/lib/db/schema.ts`:
```typescript
export interface Product {
  id: string;
  title: string;
  description: string | null;
  handle: string;
  thumbnail: string | null;
  price: number;
  compare_at_price: number | null;
  inventory_quantity: number | null;
  brand_id: string;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  synced_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  title: string | null;
  sku: string | null;
  price: number | null;
  inventory_quantity: number | null;
  options: Record<string, string> | null;
  synced_at: string;
}

export interface Category {
  id: string;
  name: string;
  handle: string;
  description: string | null;
  parent_id: string | null;
  synced_at: string;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  content: any;
  meta_title: string | null;
  meta_description: string | null;
  brand_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}
```

**Step 3: Initialize D1 database (local development)**

Run:
```bash
npx wrangler d1 create casual-chic-storefront
```

Expected: Database created with ID

**Step 4: Apply schema to local D1**

Run:
```bash
npx wrangler d1 execute casual-chic-storefront --local --file=./schema.sql
```

Expected: Schema applied successfully

**Step 5: Commit**

```bash
git add schema.sql src/lib/db/schema.ts
git commit -m "feat: create D1 database schema for products and CMS

- Add product, variant, category tables for Medusa sync
- Add CMS pages, blocks, media tables for Payload
- Define TypeScript interfaces for type safety
- Add indexes for query performance"
```

---

## Task 8: Wrangler Configuration

**Files:**
- Create: `wrangler.toml`

**Step 1: Create Wrangler configuration**

Create `wrangler.toml`:
```toml
#:schema node_modules/wrangler/config-schema.json
name = "casual-chic-storefront"
compatibility_date = "2025-01-08"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "./dist"

[observability]
enabled = true

# NOTE: Update these IDs after creating resources via Wrangler CLI

# D1 Database (shared with Payload CMS)
# Create: wrangler d1 create casual-chic-production
[[d1_databases]]
binding = "DB"
database_name = "casual-chic-storefront"
database_id = "a9501217-852e-4e7f-9380-a95459881f7b"

# R2 Buckets (shared with Payload CMS)
# Create: wrangler r2 bucket create casual-chic-media
[[r2_buckets]]
binding = "MEDIA"
bucket_name = "casual-chic-media"

# KV Namespaces (app-specific)
# Create: wrangler kv:namespace create "PRODUCT_CACHE"
[[kv_namespaces]]
binding = "PRODUCT_CACHE"
id = "YOUR_KV_NAMESPACE_ID_1"  # Update after creation

[[kv_namespaces]]
binding = "CATEGORY_CACHE"
id = "YOUR_KV_NAMESPACE_ID_2"  # Update after creation

[[kv_namespaces]]
binding = "SEARCH_CACHE"
id = "YOUR_KV_NAMESPACE_ID_3"  # Update after creation

# Environment variables (non-sensitive)
[vars]
MEDUSA_API_URL = "https://your-instance.medusajs.com"
PAYLOAD_API_URL = "https://cms.casualchicboutique.com"

# Secrets (set via CLI):
# wrangler secret put MEDUSA_API_KEY
# wrangler secret put PAYLOAD_API_KEY
```

**Step 2: Add wrangler.toml setup instructions to README**

Create a setup checklist at the top of README:

**Step 3: Commit**

```bash
git add wrangler.toml
git commit -m "feat: add Wrangler configuration for Cloudflare

- Configure D1 database binding
- Add R2 bucket for media storage
- Configure KV namespaces for caching
- Add environment variable placeholders
- Enable observability"
```

---

## Task 9: Homepage (Static/SSG)

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/components/astro/Hero.astro`

**Step 1: Create Hero component**

Create `src/components/astro/Hero.astro`:
```astro
---
interface Props {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
}

const { title, subtitle, ctaText, ctaLink, backgroundImage } = Astro.props;
---

<section class="relative h-screen flex items-center justify-center overflow-hidden">
  {backgroundImage && (
    <div class="absolute inset-0 z-0">
      <img
        src={backgroundImage}
        alt="Hero background"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>
    </div>
  )}

  <div class="relative z-10 text-center text-white px-4 max-w-4xl">
    <h1 class="font-heading text-5xl md:text-7xl font-bold mb-6 text-balance">
      {title}
    </h1>
    <p class="font-body text-xl md:text-2xl mb-8 text-balance opacity-90">
      {subtitle}
    </p>
    <a
      href={ctaLink}
      class="inline-block bg-primary hover:bg-sage text-white font-button px-8 py-4 rounded-lg text-lg transition-colors duration-200 min-h-[44px]"
    >
      {ctaText}
    </a>
  </div>
</section>
```

**Step 2: Create homepage**

Create `src/pages/index.astro`:
```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from '@/components/astro/Hero.astro';

const brand = Astro.locals.brand || 'casual-chic';
---

<BaseLayout
  title="Casual Chic Boutique | Modern Fashion"
  description="Discover modern, approachable fashion with our curated collection of casual chic styles."
>
  <Hero
    title="Effortlessly Chic"
    subtitle="Discover your perfect style with our curated collection of modern, timeless pieces"
    ctaText="Shop New Arrivals"
    ctaLink="/shop"
  />

  <section class="py-16 px-4 max-w-7xl mx-auto">
    <h2 class="font-heading text-4xl font-bold text-center mb-12 text-forest">
      Featured Collections
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Placeholder for featured categories -->
      <div class="bg-neutral rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
        <h3 class="font-heading text-2xl mb-4 text-forest">New Arrivals</h3>
        <p class="font-body text-charcoal mb-6">Fresh styles for the season</p>
        <a href="/shop/new-arrivals" class="text-primary hover:text-sage font-medium">
          Explore →
        </a>
      </div>

      <div class="bg-neutral rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
        <h3 class="font-heading text-2xl mb-4 text-forest">Best Sellers</h3>
        <p class="font-body text-charcoal mb-6">Customer favorites</p>
        <a href="/shop/best-sellers" class="text-primary hover:text-sage font-medium">
          Explore →
        </a>
      </div>

      <div class="bg-neutral rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
        <h3 class="font-heading text-2xl mb-4 text-forest">Sale</h3>
        <p class="font-body text-charcoal mb-6">Limited time offers</p>
        <a href="/shop/sale" class="text-primary hover:text-sage font-medium">
          Explore →
        </a>
      </div>
    </div>
  </section>
</BaseLayout>
```

**Step 3: Test homepage locally**

Run:
```bash
npm run dev
```

Expected: Homepage loads at http://localhost:4321 with earth-tone colors

**Step 4: Commit**

```bash
git add src/pages/index.astro src/components/astro/Hero.astro
git commit -m "feat: create homepage with hero and featured collections

- Add responsive hero component with CTA
- Display featured collection cards
- Apply earth-tone brand colors
- Optimize for mobile-first design"
```

---

## Task 10: Hono API Setup

**Files:**
- Create: `functions/api/[[path]].ts`
- Create: `src/lib/api/hono-app.ts`

**Step 1: Create Hono app instance**

Create `src/lib/api/hono-app.ts`:
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

type Bindings = {
  DB: D1Database;
  MEDIA: R2Bucket;
  PRODUCT_CACHE: KVNamespace;
  CATEGORY_CACHE: KVNamespace;
  SEARCH_CACHE: KVNamespace;
  MEDUSA_API_URL: string;
  MEDUSA_API_KEY: string;
  PAYLOAD_API_URL: string;
  PAYLOAD_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: (origin) => {
    // Allow localhost and production domains
    const allowed = [
      'http://localhost:4321',
      'http://localhost:5173',
      'https://casualchicboutique.com',
    ];
    return allowed.includes(origin) ? origin : allowed[0];
  },
  credentials: true,
}));

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
```

**Step 2: Create Pages Function handler**

Create `functions/api/[[path]].ts`:
```typescript
import app from '../../src/lib/api/hono-app';

export const onRequest = app.fetch;
```

**Step 3: Test API health endpoint**

Run:
```bash
npm run dev
```

Then test:
```bash
curl http://localhost:4321/api/health
```

Expected: `{"status":"ok","timestamp":"..."}`

**Step 4: Commit**

```bash
git add functions/api/[[path]].ts src/lib/api/hono-app.ts
git commit -m "feat: set up Hono API with Pages Functions

- Create Hono app with CORS and logging middleware
- Add health check endpoint
- Configure TypeScript bindings for Cloudflare resources
- Route all /api/* requests through Hono"
```

---

## Task 11: Product API Routes (with D1 & KV caching)

**Files:**
- Modify: `src/lib/api/hono-app.ts`
- Create: `src/lib/api/routes/products.ts`

**Step 1: Create product routes module**

Create `src/lib/api/routes/products.ts`:
```typescript
import { Hono } from 'hono';
import type { Product } from '@/lib/db/schema';

type Bindings = {
  DB: D1Database;
  PRODUCT_CACHE: KVNamespace;
};

const products = new Hono<{ Bindings: Bindings }>();

// GET /api/products - List products with pagination
products.get('/', async (c) => {
  const { page = '1', limit = '20', category, brand = 'casual-chic' } = c.req.query();

  const cacheKey = `products:${brand}:${category || 'all'}:${page}:${limit}`;

  // Try KV cache first (1hr TTL)
  const cached = await c.env.PRODUCT_CACHE.get(cacheKey, 'json');
  if (cached) {
    return c.json(cached, 200, {
      'Cache-Control': 'public, max-age=3600',
      'X-Cache': 'HIT',
    });
  }

  // Query D1
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const query = category
    ? c.env.DB.prepare(`
        SELECT p.*
        FROM products p
        JOIN product_categories pc ON p.id = pc.product_id
        JOIN categories c ON pc.category_id = c.id
        WHERE p.brand_id = ? AND c.handle = ?
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `).bind(brand, category, parseInt(limit), offset)
    : c.env.DB.prepare(`
        SELECT * FROM products
        WHERE brand_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `).bind(brand, parseInt(limit), offset);

  const { results } = await query.all<Product>();

  // Get total count
  const countQuery = category
    ? c.env.DB.prepare(`
        SELECT COUNT(*) as total
        FROM products p
        JOIN product_categories pc ON p.id = pc.product_id
        JOIN categories c ON pc.category_id = c.id
        WHERE p.brand_id = ? AND c.handle = ?
      `).bind(brand, category)
    : c.env.DB.prepare(`
        SELECT COUNT(*) as total
        FROM products
        WHERE brand_id = ?
      `).bind(brand);

  const { total } = await countQuery.first<{ total: number }>();

  const response = {
    products: results,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: total || 0,
      totalPages: Math.ceil((total || 0) / parseInt(limit)),
    },
  };

  // Cache in KV (1hr)
  await c.env.PRODUCT_CACHE.put(cacheKey, JSON.stringify(response), {
    expirationTtl: 3600,
  });

  return c.json(response, 200, {
    'Cache-Control': 'public, max-age=3600',
    'X-Cache': 'MISS',
  });
});

// GET /api/products/:id - Get single product
products.get('/:id', async (c) => {
  const { id } = c.req.param();

  const cacheKey = `product:${id}`;
  const cached = await c.env.PRODUCT_CACHE.get(cacheKey, 'json');
  if (cached) {
    return c.json(cached, 200, { 'X-Cache': 'HIT' });
  }

  const product = await c.env.DB
    .prepare('SELECT * FROM products WHERE id = ?')
    .bind(id)
    .first<Product>();

  if (!product) {
    return c.json({ error: 'Product not found' }, 404);
  }

  // Cache in KV (1hr)
  await c.env.PRODUCT_CACHE.put(cacheKey, JSON.stringify(product), {
    expirationTtl: 3600,
  });

  return c.json(product, 200, {
    'Cache-Control': 'public, max-age=3600',
    'X-Cache': 'MISS',
  });
});

export default products;
```

**Step 2: Mount product routes in Hono app**

Modify `src/lib/api/hono-app.ts`:
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import products from './routes/products';

// ... existing code ...

// Mount routes
app.route('/api/products', products);

export default app;
```

**Step 3: Test product API**

Run:
```bash
npm run dev
```

Test (will return empty initially):
```bash
curl http://localhost:4321/api/products
```

Expected: `{"products":[],"pagination":{...}}`

**Step 4: Commit**

```bash
git add src/lib/api/routes/products.ts src/lib/api/hono-app.ts
git commit -m "feat: add product API routes with D1 and KV caching

- Implement GET /api/products with pagination
- Implement GET /api/products/:id for single product
- Add 2-tier caching (KV + D1)
- Support category filtering
- Add proper Cache-Control headers"
```

---

## Remaining Tasks Summary

Due to the comprehensive nature of this implementation, here are the remaining high-priority tasks to complete the MVP:

### High Priority (Core Commerce Flow)

**Task 12:** Product Detail Page (Astro SSR)
**Task 13:** Shop/Category Page (Astro SSR with React filter islands)
**Task 14:** Search API Route with autocomplete
**Task 15:** React SearchAutocomplete Island component
**Task 16:** Cart Durable Object implementation
**Task 17:** Cart API routes (add/remove/update)
**Task 18:** React Cart SPA page
**Task 19:** React Checkout SPA flow
**Task 20:** Medusa sync worker (scheduled)

### Medium Priority (UX Enhancements)

**Task 21:** Navigation component (header/footer)
**Task 22:** Product Grid component
**Task 23:** Filter Panel React island
**Task 24:** Image optimization utilities
**Task 25:** Error pages (404, 500)

### Documentation & Testing

**Task 26:** API documentation
**Task 27:** Deployment instructions
**Task 28:** Environment setup guide
**Task 29:** Create Linear issues for remaining features

---

## Next Steps

This plan provides the foundation for the Casual Chic storefront. Complete Tasks 1-11 first to establish:

✅ Project structure and dependencies
✅ TypeScript configuration
✅ Brand theming system
✅ D1 database schema
✅ Homepage with Hero
✅ Hono API with product routes

After completing these foundational tasks, proceed with Tasks 12-29 to build out the full e-commerce experience.

**Recommended execution order:**
1. Tasks 1-11 (Foundation) ← Start here
2. Tasks 12-15 (Product browsing & search)
3. Tasks 16-19 (Cart & checkout)
4. Task 20 (Data sync)
5. Tasks 21-25 (Polish & UX)
6. Tasks 26-29 (Documentation & tracking)
