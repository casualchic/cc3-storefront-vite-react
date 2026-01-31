# Bundle Size Optimization Design

## Goal

Reduce initial bundle size by 40-50% (from 84KB to 40-50KB gzipped) to improve page load performance and establish controls to prevent future bloat.

## Current State

- Bundle: 272.69 KB (84.28 KB gzipped)
- 40 unique lucide-react icons imported via named imports
- 32 top-level dependencies including testing libraries in production dependencies
- No code-splitting implemented
- No bundle size budgets or monitoring

## Performance Targets

- Initial bundle: 40-50 KB gzipped (40-50% reduction)
- Time to Interactive: 300-500ms faster on 4G
- Lighthouse Performance: +10-15 points
- First Contentful Paint: 200-400ms improvement
- Largest Contentful Paint: 300-500ms improvement

## Optimization Strategy

### 1. Icon Library Optimization (15-25% reduction)

**Problem:** Named imports from lucide-react pull in library infrastructure.

**Solution:** Create centralized icon barrel file.

Create `src/react-app/lib/icons.ts`:
```typescript
export {
  AlertCircle,
  Bell,
  Check,
  // ... only the 40 icons actually used
} from 'lucide-react';
```

All components import from this barrel instead of lucide-react directly.

**Benefits:**
- Explicit icon inventory
- Easier auditing
- Clear git history of icon additions/removals
- Automatic tree-shaking

**Expected Impact:** 15-25% bundle reduction (20-30KB savings)

### 2. Dependency Cleanup

**Problem:** Testing libraries incorrectly listed in production dependencies.

**Solution:** Move these to devDependencies:
- `@testing-library/jest-dom`
- `@testing-library/react`
- `@testing-library/user-event`
- `@vitest/ui`
- `jsdom`
- `vitest`
- `rollup-plugin-visualizer`
- `@tanstack/router-devtools`

**Expected Impact:** Prevents accidental bundling of test infrastructure

### 3. Route-Based Code Splitting (40-50% initial load reduction)

**Problem:** All route code loads upfront, even for rarely-visited pages.

**Solution:** Lazy load route components using React.lazy():

Split these routes into separate chunks:
- Account pages (orders, wishlist, addresses)
- Product details page (reviews, gallery, image zoom)
- Returns/FAQ pages
- Shipping/contact pages

Initial bundle contains only:
- Core framework code
- Homepage/product grid
- Shared components (header, footer, cart)

Route chunks load on-demand (20-40KB each).

**Benefits:**
- Faster homepage load (primary entry point)
- Better caching (route code changes don't invalidate other routes)
- Scales as features are added

**Tradeoff:** 50-100ms delay on first visit to lazy route (cached afterward)

**Mitigation:** Prefetch likely routes on hover/interaction

### 4. Bundle Size Governance

**Problem:** No controls to prevent bundle size regression.

**Solution:** Add budget enforcement to vite.config.ts:

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'router': ['@tanstack/react-router'],
      }
    }
  },
  chunkSizeWarningLimit: 100 // KB
}
```

Set budgets:
- Initial chunk: 60 KB max
- Route chunks: 50 KB max
- Vendor chunks: 80 KB max

Fail builds that exceed budgets.

**Process:**
- Review bundle stats in PR reviews
- Track size changes over time
- Investigate unexpected increases

## Implementation Order

1. **Dependency cleanup** (low risk, immediate impact)
2. **Icon barrel file** (moderate effort, significant impact)
3. **Route code-splitting** (higher effort, largest impact)
4. **Bundle budgets** (prevents regression)

## Success Metrics

- Initial bundle ≤ 50 KB gzipped
- Lighthouse Performance score ≥ 90
- Time to Interactive < 2s on 4G
- No bundle size regressions in subsequent PRs

## Risks & Mitigations

**Risk:** Lazy loading adds complexity
**Mitigation:** Only split at route level (not component level)

**Risk:** Developers forget to update icon barrel
**Mitigation:** Linting rule to prevent direct lucide-react imports

**Risk:** Bundle budgets too strict
**Mitigation:** Set budgets at 20% above current optimized size for headroom

## Long-term Maintenance

- Monthly bundle analysis reviews
- Document icon selection criteria
- Update budgets as framework versions change
- Consider CDN for vendor chunks if bundle grows
