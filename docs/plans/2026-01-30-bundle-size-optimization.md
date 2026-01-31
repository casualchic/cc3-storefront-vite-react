# Bundle Size Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce initial bundle size by 40-50% (from 84KB to 40-50KB gzipped) through dependency cleanup, icon optimization, and route-based code splitting.

**Architecture:** Create centralized icon barrel file, move dev dependencies out of production, implement lazy loading for non-critical routes, and add bundle size budgets to prevent regression.

**Tech Stack:** React 19, Vite 6, TanStack Router, lucide-react, TypeScript

---

## Task 1: Move Development Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Move testing libraries to devDependencies**

Edit `package.json` and move these packages from `dependencies` to `devDependencies`:
- `@testing-library/jest-dom`
- `@testing-library/react`
- `@testing-library/user-event`
- `@vitest/ui`
- `jsdom`
- `vitest`
- `rollup-plugin-visualizer`
- `@tanstack/router-devtools`

The `dependencies` section should only contain production runtime dependencies.

**Step 2: Verify package.json structure**

Check that `package.json` has proper separation:
- `dependencies`: Only runtime packages (react, react-dom, hono, lucide-react, etc.)
- `devDependencies`: All testing, build tools, and dev-only packages

**Step 3: Regenerate package-lock.json**

Run:
```bash
npm install
```

Expected: Lock file updates with dependency tree changes

**Step 4: Verify build still works**

Run:
```bash
npm run build
```

Expected: Clean build with no errors

**Step 5: Commit dependency cleanup**

```bash
git add package.json package-lock.json
git commit -m "refactor: Move dev dependencies out of production

- Move testing libraries to devDependencies
- Move build tools (visualizer, router-devtools) to devDependencies
- Prevents accidental bundling of test infrastructure

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Create Icon Barrel File

**Files:**
- Create: `src/react-app/lib/icons.ts`

**Step 1: Create lib directory**

Run:
```bash
mkdir -p src/react-app/lib
```

**Step 2: Create icon barrel file**

Create `src/react-app/lib/icons.ts`:

```typescript
/**
 * Centralized icon exports from lucide-react
 *
 * Import icons from this file instead of directly from lucide-react.
 * This provides better tree-shaking and makes icon usage auditable.
 *
 * @example
 * import { Heart, ShoppingCart } from '@/lib/icons';
 */
export {
  AlertCircle,
  Bell,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  CreditCard,
  Eye,
  Facebook,
  Globe,
  Heart,
  Link as LinkIcon,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Minus,
  Package,
  PackageX,
  Phone,
  Play,
  Plus,
  RotateCcw,
  Share2,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Star,
  Tag,
  ThumbsUp,
  Trash2,
  Truck,
  Twitter,
  User,
  X,
  XCircle,
  ZoomIn,
} from 'lucide-react';
```

**Step 3: Verify TypeScript compilation**

Run:
```bash
npx tsc --noEmit
```

Expected: No TypeScript errors

**Step 4: Commit icon barrel**

```bash
git add src/react-app/lib/icons.ts
git commit -m "feat: Add centralized icon barrel file

- Export all 40 icons used in the app
- Enables better tree-shaking
- Makes icon usage auditable

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Update Component Imports (Part 1 - Components)

**Files:**
- Modify: `src/react-app/components/ShareButtons.tsx`
- Modify: `src/react-app/components/SizeGuideModal.tsx`
- Modify: `src/react-app/components/ShippingEstimate.tsx`
- Modify: `src/react-app/components/NotifyWhenAvailable.tsx`
- Modify: `src/react-app/components/CartDrawer.tsx`
- Modify: `src/react-app/components/ProductReviews.tsx`
- Modify: `src/react-app/components/ProductGrid.tsx`
- Modify: `src/react-app/components/ProductImageGallery.tsx`
- Modify: `src/react-app/components/ProductDescription.tsx`
- Modify: `src/react-app/components/CartItem.tsx`
- Modify: `src/react-app/components/ProductCard.tsx`
- Modify: `src/react-app/components/QuickViewModal.tsx`
- Modify: `src/react-app/components/products/VariantSelector/ColorSelector.tsx`
- Modify: `src/react-app/components/products/VariantSelector/StockIndicator.tsx`

**Step 1: Update ShareButtons.tsx**

Replace:
```typescript
import { Share2, Facebook, Twitter, Mail, Link as LinkIcon, Check } from 'lucide-react';
```

With:
```typescript
import { Share2, Facebook, Twitter, Mail, LinkIcon, Check } from '@/lib/icons';
```

**Step 2: Update SizeGuideModal.tsx**

Replace:
```typescript
import { X } from 'lucide-react';
```

With:
```typescript
import { X } from '@/lib/icons';
```

**Step 3: Update ShippingEstimate.tsx**

Replace:
```typescript
import { Truck, MapPin } from 'lucide-react';
```

With:
```typescript
import { Truck, MapPin } from '@/lib/icons';
```

**Step 4: Update NotifyWhenAvailable.tsx**

Replace:
```typescript
import { Bell, Check, X } from 'lucide-react';
```

With:
```typescript
import { Bell, Check, X } from '@/lib/icons';
```

**Step 5: Update CartDrawer.tsx**

Replace:
```typescript
import { X, ShoppingBag, Tag } from 'lucide-react';
```

With:
```typescript
import { X, ShoppingBag, Tag } from '@/lib/icons';
```

**Step 6: Update ProductReviews.tsx**

Replace:
```typescript
import { Star, ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react';
```

With:
```typescript
import { Star, ThumbsUp, ChevronDown, ChevronUp } from '@/lib/icons';
```

**Step 7: Update ProductGrid.tsx**

Replace:
```typescript
import { AlertCircle, PackageX, Loader2 } from 'lucide-react';
```

With:
```typescript
import { AlertCircle, PackageX, Loader2 } from '@/lib/icons';
```

**Step 8: Update ProductImageGallery.tsx**

Replace:
```typescript
import { ChevronLeft, ChevronRight, ZoomIn, X, Play } from 'lucide-react';
```

With:
```typescript
import { ChevronLeft, ChevronRight, ZoomIn, X, Play } from '@/lib/icons';
```

**Step 9: Update ProductDescription.tsx**

Replace:
```typescript
import { ChevronDown, ChevronUp } from 'lucide-react';
```

With:
```typescript
import { ChevronDown, ChevronUp } from '@/lib/icons';
```

**Step 10: Update CartItem.tsx**

Replace:
```typescript
import { Minus, Plus, Trash2 } from 'lucide-react';
```

With:
```typescript
import { Minus, Plus, Trash2 } from '@/lib/icons';
```

**Step 11: Update ProductCard.tsx**

Replace:
```typescript
import { Heart, Eye, ShoppingCart } from 'lucide-react';
```

With:
```typescript
import { Heart, Eye, ShoppingCart } from '@/lib/icons';
```

**Step 12: Update QuickViewModal.tsx**

Replace:
```typescript
import { X, Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
```

With:
```typescript
import { X, Heart, Minus, Plus, ShoppingCart } from '@/lib/icons';
```

**Step 13: Update ColorSelector.tsx**

Replace:
```typescript
import { Check } from 'lucide-react';
```

With:
```typescript
import { Check } from '@/lib/icons';
```

**Step 14: Update StockIndicator.tsx**

Replace:
```typescript
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
```

With:
```typescript
import { CheckCircle, AlertCircle, XCircle } from '@/lib/icons';
```

**Step 15: Verify TypeScript compilation**

Run:
```bash
npx tsc --noEmit
```

Expected: No TypeScript errors

**Step 16: Commit component import updates**

```bash
git add src/react-app/components/
git commit -m "refactor: Update component icons to use barrel file

- Replace lucide-react imports with @/lib/icons
- Improves tree-shaking efficiency

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Update Route Imports

**Files:**
- Modify: `src/react-app/routes/account.tsx`
- Modify: `src/react-app/routes/account.orders.tsx`
- Modify: `src/react-app/routes/returns.tsx`
- Modify: `src/react-app/routes/faq.tsx`
- Modify: `src/react-app/routes/account.wishlist.tsx`
- Modify: `src/react-app/routes/products.$id.tsx`
- Modify: `src/react-app/routes/account.addresses.tsx`
- Modify: `src/react-app/routes/shipping.tsx`
- Modify: `src/react-app/pages/ContactPage.tsx`

**Step 1: Update account.tsx**

Replace:
```typescript
import { LogOut, User, MapPin, Package, Heart } from 'lucide-react';
```

With:
```typescript
import { LogOut, User, MapPin, Package, Heart } from '@/lib/icons';
```

**Step 2: Update account.orders.tsx**

Replace:
```typescript
import { Package } from 'lucide-react';
```

With:
```typescript
import { Package } from '@/lib/icons';
```

**Step 3: Update returns.tsx**

Replace:
```typescript
import { RotateCcw, Package, Check, X, Mail } from 'lucide-react';
```

With:
```typescript
import { RotateCcw, Package, Check, X, Mail } from '@/lib/icons';
```

**Step 4: Update faq.tsx**

Replace:
```typescript
import { ChevronDown, ChevronUp } from 'lucide-react';
```

With:
```typescript
import { ChevronDown, ChevronUp } from '@/lib/icons';
```

**Step 5: Update account.wishlist.tsx**

Replace:
```typescript
import { Heart } from 'lucide-react';
```

With:
```typescript
import { Heart } from '@/lib/icons';
```

**Step 6: Update products.$id.tsx**

Replace:
```typescript
import { Heart, Truck, RotateCcw, Shield, Minus, Plus } from 'lucide-react';
```

With:
```typescript
import { Heart, Truck, RotateCcw, Shield, Minus, Plus } from '@/lib/icons';
```

**Step 7: Update account.addresses.tsx**

Replace:
```typescript
import { MapPin, Plus } from 'lucide-react';
```

With:
```typescript
import { MapPin, Plus } from '@/lib/icons';
```

**Step 8: Update shipping.tsx**

Replace:
```typescript
import { Package, Truck, Globe, Clock, MapPin, CreditCard } from 'lucide-react';
```

With:
```typescript
import { Package, Truck, Globe, Clock, MapPin, CreditCard } from '@/lib/icons';
```

**Step 9: Update ContactPage.tsx**

Replace:
```typescript
import { Mail, Phone, MapPin } from 'lucide-react';
```

With:
```typescript
import { Mail, Phone, MapPin } from '@/lib/icons';
```

**Step 10: Verify no direct lucide-react imports remain**

Run:
```bash
grep -r "from 'lucide-react'" src/react-app/ --include="*.tsx" --include="*.ts"
```

Expected: No matches (all imports now use @/lib/icons)

**Step 11: Verify TypeScript compilation**

Run:
```bash
npx tsc --noEmit
```

Expected: No TypeScript errors

**Step 12: Commit route import updates**

```bash
git add src/react-app/routes/ src/react-app/pages/
git commit -m "refactor: Update route icons to use barrel file

- Replace all remaining lucide-react imports with @/lib/icons
- All icon imports now centralized

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Configure TypeScript Path Alias

**Files:**
- Modify: `tsconfig.json`
- Modify: `vite.config.ts`

**Step 1: Check current tsconfig.json**

Read `tsconfig.json` to see if `paths` are already configured.

**Step 2: Add path alias to tsconfig.json**

Add or update the `compilerOptions.paths` section:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/react-app/*"]
    }
  }
}
```

**Step 3: Add alias resolver to vite.config.ts**

Add to the config:

```typescript
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/react-app'),
    },
  },
  plugins: [
    // ... existing plugins
  ],
});
```

**Step 4: Verify TypeScript recognizes alias**

Run:
```bash
npx tsc --noEmit
```

Expected: No errors, all @/lib/icons imports resolve correctly

**Step 5: Build and verify**

Run:
```bash
npm run build
```

Expected: Successful build with no errors

**Step 6: Commit path alias configuration**

```bash
git add tsconfig.json vite.config.ts
git commit -m "feat: Configure TypeScript path alias for imports

- Add @/* path alias pointing to src/react-app
- Configured in both tsconfig and vite.config
- Enables cleaner import statements

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Implement Route-Based Code Splitting

**Files:**
- Modify: `src/react-app/routes/account.tsx`
- Modify: `src/react-app/routes/account.orders.tsx`
- Modify: `src/react-app/routes/account.wishlist.tsx`
- Modify: `src/react-app/routes/account.addresses.tsx`
- Modify: `src/react-app/routes/products.$id.tsx`
- Modify: `src/react-app/routes/returns.tsx`
- Modify: `src/react-app/routes/faq.tsx`
- Modify: `src/react-app/routes/shipping.tsx`
- Modify: `src/react-app/routes/contact.tsx`

**Step 1: Add lazy loading wrapper to account.tsx**

Wrap the component export with lazy loading:

```typescript
import { lazy } from 'react';

// Move all component code into a separate function
const AccountPageComponent = () => {
  // ... existing component code
};

// Export as lazy-loaded
export const Route = createFileRoute('/account')({
  component: lazy(() => Promise.resolve({ default: AccountPageComponent })),
});
```

**Step 2: Add lazy loading to account.orders.tsx**

Apply the same pattern:

```typescript
import { lazy } from 'react';

const AccountOrdersComponent = () => {
  // ... existing component code
};

export const Route = createFileRoute('/account/orders')({
  component: lazy(() => Promise.resolve({ default: AccountOrdersComponent })),
});
```

**Step 3: Add lazy loading to account.wishlist.tsx**

```typescript
import { lazy } from 'react';

const AccountWishlistComponent = () => {
  // ... existing component code
};

export const Route = createFileRoute('/account/wishlist')({
  component: lazy(() => Promise.resolve({ default: AccountWishlistComponent })),
});
```

**Step 4: Add lazy loading to account.addresses.tsx**

```typescript
import { lazy } from 'react';

const AccountAddressesComponent = () => {
  // ... existing component code
};

export const Route = createFileRoute('/account/addresses')({
  component: lazy(() => Promise.resolve({ default: AccountAddressesComponent })),
});
```

**Step 5: Add lazy loading to products.$id.tsx**

```typescript
import { lazy } from 'react';

const ProductDetailComponent = () => {
  // ... existing component code
};

export const Route = createFileRoute('/products/$id')({
  component: lazy(() => Promise.resolve({ default: ProductDetailComponent })),
});
```

**Step 6: Add lazy loading to returns.tsx**

```typescript
import { lazy } from 'react';

const ReturnsPageComponent = () => {
  // ... existing component code
};

export const Route = createFileRoute('/returns')({
  component: lazy(() => Promise.resolve({ default: ReturnsPageComponent })),
});
```

**Step 7: Add lazy loading to faq.tsx**

```typescript
import { lazy } from 'react';

const FAQPageComponent = () => {
  // ... existing component code
};

export const Route = createFileRoute('/faq')({
  component: lazy(() => Promise.resolve({ default: FAQPageComponent })),
});
```

**Step 8: Add lazy loading to shipping.tsx**

```typescript
import { lazy } from 'react';

const ShippingPageComponent = () => {
  // ... existing component code
};

export const Route = createFileRoute('/shipping')({
  component: lazy(() => Promise.resolve({ default: ShippingPageComponent })),
});
```

**Step 9: Add lazy loading to contact.tsx**

```typescript
import { lazy } from 'react';

const ContactPageComponent = () => {
  // ... existing component code
};

export const Route = createFileRoute('/contact')({
  component: lazy(() => Promise.resolve({ default: ContactPageComponent })),
});
```

**Step 10: Verify TypeScript compilation**

Run:
```bash
npx tsc --noEmit
```

Expected: No TypeScript errors

**Step 11: Test dev server**

Run:
```bash
npm run dev
```

Navigate to different routes and verify lazy loading works (check Network tab for chunk downloads)

**Step 12: Commit lazy loading implementation**

```bash
git add src/react-app/routes/
git commit -m "feat: Implement route-based code splitting

- Add lazy loading for account pages
- Add lazy loading for product detail page
- Add lazy loading for utility pages (FAQ, returns, shipping, contact)
- Reduces initial bundle size by splitting routes into separate chunks

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Add Bundle Size Budgets

**Files:**
- Modify: `vite.config.ts`

**Step 1: Update vite.config.ts with bundle budgets**

Add build configuration with manual chunks and size limits:

```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/react-app'),
    },
  },
  plugins: [
    // ... existing plugins
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['@tanstack/react-router'],
          'icons': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 100, // KB - warn if any chunk exceeds this
  },
});
```

**Step 2: Build and verify chunk sizes**

Run:
```bash
npm run build
```

Expected output should show:
- Multiple chunk files (main, react-vendor, router, icons, route chunks)
- Warnings if any chunk exceeds 100 KB
- dist/stats.html generated for analysis

**Step 3: Check bundle stats**

Run:
```bash
ls -lh dist/client/assets/
```

Expected: Multiple JS files showing the split chunks

**Step 4: Verify gzip sizes meet targets**

The build output should show gzipped sizes. Verify:
- Main chunk < 60 KB gzipped
- Total initial load < 50 KB gzipped (main + critical chunks)

**Step 5: Commit bundle budget configuration**

```bash
git add vite.config.ts
git commit -m "feat: Add bundle size budgets and manual chunking

- Split vendor code (React, Router, Icons) into separate chunks
- Set 100 KB chunk size warning limit
- Improves caching and prevents bundle bloat

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Verify Bundle Size Improvements

**Files:**
- None (testing and verification)

**Step 1: Build production bundle**

Run:
```bash
npm run build
```

**Step 2: Check build output for bundle sizes**

Review the output showing gzipped sizes. Compare to baseline:
- Baseline: 84.28 KB gzipped total
- Target: 40-50 KB gzipped initial load

**Step 3: Open bundle visualizer**

Open `dist/stats.html` in browser to see visual breakdown of:
- What's in each chunk
- Size of each dependency
- Verify lucide-react is properly tree-shaken

**Step 4: Test in development mode**

Run:
```bash
npm run dev
```

Visit different routes and verify:
- Homepage loads quickly
- Route transitions work smoothly
- Lazy loaded routes download their chunks (check Network tab)

**Step 5: Document results**

Create a quick summary of the improvements achieved:

```bash
echo "## Bundle Size Optimization Results

### Before
- Total bundle: 272.69 KB (84.28 KB gzipped)
- Single bundle file
- All routes loaded upfront

### After
- Initial load: [CHECK BUILD OUTPUT] KB gzipped
- Route chunks: [LIST CHUNK SIZES]
- Vendor chunks separated for better caching

### Improvements
- Initial load reduction: [CALCULATE %]
- Number of chunks: [COUNT]
- Lazy loaded routes: 9

### Next Steps
- Monitor bundle size in PRs
- Add lint rule to prevent direct lucide-react imports
- Consider prefetching for likely navigation paths
" > docs/bundle-optimization-results.md
```

**Step 6: Commit results documentation**

```bash
git add docs/bundle-optimization-results.md
git commit -m "docs: Document bundle size optimization results

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Final Verification and Package Update

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Step 1: Verify all changes to package.json and package-lock.json**

Run:
```bash
git diff main package.json package-lock.json
```

Review changes:
- focus-trap-react upgraded to ^12.0.0
- Dev dependencies moved to devDependencies section
- Lock file synchronized

**Step 2: Run final build**

Run:
```bash
npm run build
```

Expected: Clean build with optimized bundle sizes

**Step 3: Run tests to ensure nothing broke**

Run:
```bash
npm test
```

Expected: All tests pass

**Step 4: Commit package updates**

```bash
git add package.json package-lock.json
git commit -m "chore: Finalize package.json updates for optimization

- Upgrade focus-trap-react to v12
- Reorganize dependencies for production bundle
- Synchronized lock file

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Step 5: Create summary of all changes**

Run:
```bash
git log --oneline main..HEAD
```

Review the commit history to ensure all optimization work is captured.

---

## Success Criteria

After completing all tasks:

- [ ] Initial bundle ≤ 50 KB gzipped
- [ ] No direct lucide-react imports (all use @/lib/icons)
- [ ] 9+ routes lazy loaded
- [ ] Dev dependencies separated from production
- [ ] Bundle size budgets configured
- [ ] Build completes without errors
- [ ] Tests pass
- [ ] Bundle visualizer shows proper code splitting

## Testing Checklist

- [ ] Homepage loads without errors
- [ ] Navigate to account page (lazy loaded)
- [ ] Navigate to product detail (lazy loaded)
- [ ] Navigate to FAQ page (lazy loaded)
- [ ] Check Network tab shows separate chunk downloads
- [ ] Verify icons render correctly on all pages
- [ ] Run production build and check bundle sizes
- [ ] Review dist/stats.html for bundle composition
