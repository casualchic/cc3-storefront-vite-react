# World-Class E-commerce Transformation Plan
## Casual Chic Boutique - Nordstrom/Revolve Level Excellence

---

## ✅ COMPLETED: Remove AI Slop from Copy

### What Was Fixed:
- ❌ Removed: "Discover your perfect style with our curated collection"
- ✅ Replaced: "Versatile pieces that work from morning coffee to evening drinks"

- ❌ Removed: "carefully curated collection features versatile pieces that transition seamlessly"
- ✅ Replaced: "We stock pieces that work hard in your wardrobe. Each item fits well, looks polished"

- ❌ Removed: "Discover clothing that makes you feel confident, comfortable, and authentically you"
- ✅ Replaced: "Real clothing for real life. No fuss, just great style"

- ❌ Removed: "This premium product is carefully crafted with attention to detail"
- ✅ Replaced: "Features quality construction with reinforced seams and durable fabric"

- ❌ Removed: "Explore our curated collections"
- ✅ Replaced: "Browse by style, occasion, or season"

---

## 🎯 PRIORITY 1: Product Detail Page Enhancement (2-3 hours)

### World-Class Standard: Nordstrom/Revolve PDP
**What they do right:**
- Detailed fabric composition (e.g., "70% Cotton, 25% Polyester, 5% Elastane")
- Model measurements and size worn
- Specific fit details (e.g., "Fitted through the bust, relaxed through the waist")
- Length measurements for each size
- Professional styling suggestions
- Complete care instructions

### Action Items:

#### 1. Enhance Product Description Template
**File**: `src/pages/products/[handle].astro` (lines 140-147)

**Current (Generic)**:
```
A versatile wardrobe essential. This piece features quality construction...
```

**Upgrade to (Specific)**:
```tsx
<div class="space-y-4">
  <p class="text-charcoal leading-relaxed">
    {product.description || `This ${product.title.toLowerCase()} combines style and comfort
    for all-day wear. The relaxed fit flatters multiple body types while maintaining
    a polished silhouette.`}
  </p>

  {/* Add Fit & Sizing Section */}
  <div class="bg-neutral/20 p-4 rounded-lg">
    <h4 class="font-semibold text-forest mb-2">Fit & Sizing</h4>
    <ul class="text-sm space-y-1 text-charcoal">
      <li>• Model is 5'9" wearing size Small</li>
      <li>• True to size - order your normal size</li>
      <li>• Length: 26" from shoulder (size M)</li>
      <li>• Bust: 38" (size M)</li>
    </ul>
  </div>

  {/* Add Fabric Details */}
  <div>
    <h4 class="font-semibold text-forest mb-2">Fabric & Feel</h4>
    <p class="text-sm text-charcoal">
      Soft, breathable weave with slight stretch for comfort.
      Holds shape after washing. Not see-through.
    </p>
  </div>
</div>
```

#### 2. Add Detailed Care Instructions
**Replace generic care instructions** (lines 152-157) with:

```tsx
<div class="mt-6">
  <h3 class="font-heading text-lg font-bold text-forest mb-3">Care Instructions</h3>
  <div class="bg-neutral/20 p-4 rounded-lg">
    <ul class="space-y-2 text-sm text-charcoal">
      <li class="flex items-start gap-2">
        <svg class="w-5 h-5 text-sage flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
        </svg>
        <span><strong>Machine wash cold</strong> with like colors on gentle cycle</span>
      </li>
      <li class="flex items-start gap-2">
        <svg class="w-5 h-5 text-sage flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
        </svg>
        <span><strong>Tumble dry low</strong> or hang to dry for best results</span>
      </li>
      <li class="flex items-start gap-2">
        <svg class="w-5 h-5 text-sage flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
        </svg>
        <span><strong>Cool iron</strong> if needed - do not iron directly on prints</span>
      </li>
      <li class="flex items-start gap-2">
        <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
        </svg>
        <span><strong>Do not bleach</strong></span>
      </li>
      <li class="flex items-start gap-2">
        <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
        </svg>
        <span><strong>Do not dry clean</strong></span>
      </li>
    </ul>
  </div>
</div>
```

#### 3. Add "Complete the Look" Section
After related products, add:

```tsx
<!-- Complete the Look -->
<div class="mt-16 bg-neutral/10 p-8 rounded-lg">
  <h2 class="font-heading text-2xl font-bold text-forest mb-6">
    Style This With
  </h2>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {/* Show complementary products - bags, jewelry, shoes */}
  </div>
</div>
```

---

## 🎯 PRIORITY 2: World-Class Filtering & Search (3-4 hours)

### Current State:
- ✅ Basic filtering exists (`ProductFilter.tsx`)
- ❌ Missing multi-faceted filters
- ❌ No instant visual feedback
- ❌ No filter persistence

### Upgrade Plan:

#### 1. Enhanced Filter UI Component
**Create**: `src/components/react/AdvancedFilters.tsx`

```tsx
/**
 * Advanced Filters Component
 * Multi-faceted filtering with instant feedback
 */

import { useState } from 'react';

interface FilterOption {
  label: string;
  value: string;
  count: number; // Number of products matching this filter
}

interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'range' | 'color' | 'size';
  options?: FilterOption[];
  min?: number;
  max?: number;
}

export default function AdvancedFilters({
  filters,
  onFilterChange,
  productCount
}: {
  filters: FilterGroup[];
  onFilterChange: (filters: Record<string, any>) => void;
  productCount: number;
}) {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['size', 'color']));

  return (
    <div class="space-y-6">
      {/* Active Filters Pills */}
      {Object.keys(activeFilters).length > 0 && (
        <div class="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => (
            <button
              class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20"
              onClick={() => removeFilter(key)}
            >
              {value}
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
              </svg>
            </button>
          ))}
          <button
            class="text-sm text-charcoal underline hover:text-primary"
            onClick={() => setActiveFilters({})}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Filter Groups */}
      {filters.map((group) => (
        <div class="border-b border-neutral pb-4">
          <button
            class="flex items-center justify-between w-full py-2 text-left"
            onClick={() => toggleGroup(group.id)}
          >
            <span class="font-semibold text-forest">{group.label}</span>
            <svg
              class={`w-5 h-5 transition-transform ${expandedGroups.has(group.id) ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedGroups.has(group.id) && (
            <div class="mt-3 space-y-2">
              {group.type === 'checkbox' && group.options?.map((option) => (
                <label class="flex items-center gap-2 cursor-pointer hover:text-primary">
                  <input
                    type="checkbox"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={activeFilters[group.id]?.includes(option.value)}
                    onChange={(e) => handleCheckboxChange(group.id, option.value, e.target.checked)}
                  />
                  <span class="text-sm">{option.label}</span>
                  <span class="text-xs text-charcoal/50">({option.count})</span>
                </label>
              ))}

              {group.type === 'color' && group.options?.map((option) => (
                <button
                  class={`w-8 h-8 rounded-full border-2 ${
                    activeFilters.color === option.value
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-neutral'
                  }`}
                  style={{ backgroundColor: option.value }}
                  title={option.label}
                  onClick={() => handleColorChange(option.value)}
                />
              ))}

              {group.type === 'size' && group.options?.map((option) => (
                <button
                  class={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    activeFilters.size === option.value
                      ? 'bg-primary text-white border-primary'
                      : 'border-neutral hover:border-primary'
                  }`}
                  onClick={() => handleSizeChange(option.value)}
                >
                  {option.label}
                </button>
              ))}

              {group.type === 'range' && (
                <div class="space-y-3">
                  <input
                    type="range"
                    min={group.min}
                    max={group.max}
                    class="w-full"
                    onChange={(e) => handleRangeChange(group.id, e.target.value)}
                  />
                  <div class="flex justify-between text-sm text-charcoal">
                    <span>${group.min}</span>
                    <span>${activeFilters[group.id] || group.max}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Results Count */}
      <div class="pt-4 text-sm text-charcoal">
        <strong>{productCount}</strong> products match your filters
      </div>
    </div>
  );
}
```

#### 2. Implement Filter Persistence
**File**: `src/lib/stores/filter-store.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterState {
  activeFilters: Record<string, any>;
  setFilter: (key: string, value: any) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      activeFilters: {},
      setFilter: (key, value) =>
        set((state) => ({
          activeFilters: { ...state.activeFilters, [key]: value },
        })),
      removeFilter: (key) =>
        set((state) => {
          const { [key]: _, ...rest } = state.activeFilters;
          return { activeFilters: rest };
        }),
      clearFilters: () => set({ activeFilters: {} }),
    }),
    {
      name: 'filter-storage',
    }
  )
);
```

#### 3. Add Instant Search with Debouncing
**File**: `src/components/react/InstantSearch.tsx`

```tsx
import { useState, useEffect, useRef } from 'react';

export default function InstantSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for search
    if (query.length >= 2) {
      setIsSearching(true);
      debounceRef.current = setTimeout(async () => {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.products);
        setIsSearching(false);
      }, 300); // 300ms debounce
    } else {
      setResults([]);
      setIsSearching(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-3 border border-neutral rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />

      {/* Instant Results Dropdown */}
      {query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
          {isSearching ? (
            <div className="p-4 text-center text-charcoal">Searching...</div>
          ) : results.length > 0 ? (
            results.map((product) => (
              <a
                href={`/products/${product.handle}`}
                className="flex items-center gap-4 p-3 hover:bg-neutral/20 transition-colors"
              >
                <img src={product.thumbnail} className="w-16 h-16 object-cover rounded" />
                <div>
                  <h4 className="font-semibold text-forest">{product.title}</h4>
                  <p className="text-sm text-primary">${product.price}</p>
                </div>
              </a>
            ))
          ) : (
            <div className="p-4 text-center text-charcoal">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 PRIORITY 3: Performance Optimization (2-3 hours)

### Core Web Vitals Targets:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Action Items:

#### 1. Image Optimization
**Create**: `src/lib/utils/image-optimizer.ts`

```typescript
/**
 * Image Optimization Utilities
 * Cloudflare Images integration
 */

export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif' | 'jpeg';
  } = {}
): string {
  const { width = 800, height, quality = 85, format = 'auto' } = options;

  // If using Cloudflare Images
  if (process.env.CLOUDFLARE_IMAGES_ACCOUNT) {
    return `https://imagedelivery.net/${process.env.CLOUDFLARE_IMAGES_ACCOUNT}/${url}/w=${width},q=${quality},format=${format}`;
  }

  // Fallback to Unsplash optimization
  if (url.includes('unsplash.com')) {
    const params = new URLSearchParams();
    params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    params.set('fm', format === 'auto' ? 'webp' : format);
    return `${url.split('?')[0]}?${params.toString()}`;
  }

  return url;
}

export function getImageSrcSet(url: string, sizes: number[] = [400, 800, 1200, 1600]): string {
  return sizes
    .map((size) => `${getOptimizedImageUrl(url, { width: size })} ${size}w`)
    .join(', ');
}
```

#### 2. Lazy Loading Strategy
**Update**: `src/components/react/ProductCard.tsx`

```tsx
<img
  src={getOptimizedImageUrl(product.thumbnail, { width: 400, quality: 85 })}
  srcSet={getImageSrcSet(product.thumbnail)}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  alt={product.title}
  loading="lazy"
  decoding="async"
  className="w-full h-full object-cover"
/>
```

#### 3. Preload Critical Resources
**Update**: `src/layouts/BaseLayout.astro`

```astro
<head>
  <!-- Preload critical fonts -->
  <link
    rel="preload"
    href="/fonts/inter-var.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />

  <!-- Preload hero image -->
  <link
    rel="preload"
    as="image"
    href="/hero-image.webp"
  />

  <!-- Preconnect to external domains -->
  <link rel="preconnect" href="https://images.unsplash.com" />
  <link rel="dns-prefetch" href="https://casual-chic.medusajs.app" />
</head>
```

#### 4. Route Prefetching
**Add**: `src/components/react/PrefetchLink.tsx`

```tsx
import { useEffect, useRef } from 'react';

export default function PrefetchLink({
  href,
  children,
  className
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Prefetch the page when link is in viewport
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = href;
          document.head.appendChild(link);

          observer.disconnect();
        }
      });
    });

    if (linkRef.current) {
      observer.observe(linkRef.current);
    }

    return () => observer.disconnect();
  }, [href]);

  return (
    <a ref={linkRef} href={href} className={className}>
      {children}
    </a>
  );
}
```

---

## 🎯 PRIORITY 4: Unique Design Components (4-5 hours)

### Goal: Differentiate from template stores

#### 1. Custom Product Card with Hover Effects
**Update**: `src/components/react/ProductCard.tsx`

```tsx
export default function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with dual images */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
        {/* Primary Image */}
        <img
          src={product.thumbnail}
          alt={product.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Hover Image (second product image) */}
        {product.images[1] && (
          <img
            src={product.images[1].url}
            alt={product.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Quick Add Button - appears on hover */}
        <div
          className={`absolute bottom-4 left-4 right-4 transform transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <button className="w-full bg-white hover:bg-primary hover:text-white text-forest font-semibold py-3 rounded-lg shadow-lg transition-colors">
            Quick Add
          </button>
        </div>

        {/* Sale Badge */}
        {product.onSale && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            Sale
          </div>
        )}

        {/* Wishlist Heart */}
        <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white hover:scale-110 transition-all">
          <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <h3 className="font-heading text-lg font-semibold text-forest group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 1 && (
          <div className="flex gap-1 mt-2">
            {product.colors.slice(0, 5).map((color) => (
              <div
                className="w-5 h-5 rounded-full border-2 border-neutral"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-xs text-charcoal self-center ml-1">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-2">
          {product.compareAtPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                ${product.price}
              </span>
              <span className="text-sm text-charcoal line-through">
                ${product.compareAtPrice}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-primary">
              ${product.price}
            </span>
          )}
        </div>

        {/* Reviews */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-neutral'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-charcoal">({product.reviewCount})</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

#### 2. Custom Mega Menu with Product Previews
**Update**: `src/components/react/MegaMenu.tsx`

Add product preview cards in mega menu:

```tsx
<div class="absolute left-0 right-0 top-full bg-white border-t shadow-2xl">
  <div class="max-w-7xl mx-auto p-8 grid grid-cols-12 gap-8">
    {/* Categories (8 columns) */}
    <div class="col-span-8 grid grid-cols-3 gap-8">
      {sections.map(section => (...))}
    </div>

    {/* Featured Products (4 columns) */}
    <div class="col-span-4">
      <h3 class="font-bold text-forest mb-4">Featured in {label}</h3>
      <div class="space-y-4">
        {featuredProducts.map((product) => (
          <a href={`/products/${product.handle}`} class="flex gap-4 group">
            <img
              src={product.thumbnail}
              class="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h4 class="font-semibold text-sm group-hover:text-primary">
                {product.title}
              </h4>
              <p class="text-primary font-bold">${product.price}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </div>
</div>
```

#### 3. Sticky Add to Cart Bar (Mobile)
**Create**: `src/components/react/StickyCartBar.tsx`

```tsx
import { useState, useEffect } from 'react';

export default function StickyCartBar({
  product,
  onAddToCart
}: {
  product: Product;
  onAddToCart: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when scrolled past main add to cart button
      const mainButton = document.getElementById('main-add-to-cart');
      if (mainButton) {
        const rect = mainButton.getBoundingClientRect();
        setIsVisible(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 transition-transform duration-300 md:hidden ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center gap-4 p-4">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-forest text-sm">{product.title}</h3>
          <p className="text-primary font-bold">${product.price}</p>
        </div>
        <button
          onClick={onAddToCart}
          className="bg-primary hover:bg-sage text-white px-6 py-3 rounded-lg font-semibold"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
```

---

## 🎯 PRIORITY 5: Cart & Checkout Optimization (2-3 hours)

### World-Class Standard: 60-Second Checkout

#### 1. Implement Guest Checkout (REQUIRED)
**File**: `src/components/react/checkout/CheckoutPage.tsx`

Add at the top:
```tsx
<div className="bg-neutral/20 p-4 rounded-lg mb-6">
  <p className="text-sm text-charcoal">
    Checking out as guest? No problem - you can create an account after your order.
  </p>
</div>
```

#### 2. Add Express Checkout Buttons
**File**: `src/components/react/checkout/ExpressCheckout.tsx`

```tsx
export default function ExpressCheckout() {
  return (
    <div className="space-y-3">
      <div className="text-center text-sm text-charcoal font-medium">
        Express Checkout
      </div>

      {/* Apple Pay */}
      <button className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          {/* Apple Pay SVG */}
        </svg>
        <span>Pay</span>
      </button>

      {/* Google Pay */}
      <button className="w-full border border-neutral py-3 rounded-lg flex items-center justify-center gap-2">
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          {/* Google Pay SVG */}
        </svg>
      </button>

      {/* Shop Pay */}
      <button className="w-full bg-[#5A31F4] text-white py-3 rounded-lg flex items-center justify-center gap-2">
        <span className="font-bold">Shop</span>
        <span>Pay</span>
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-charcoal">Or pay with card</span>
        </div>
      </div>
    </div>
  );
}
```

#### 3. Add Progress Indicator
**File**: `src/components/react/checkout/CheckoutProgress.tsx`

```tsx
export default function CheckoutProgress({ currentStep }: { currentStep: number }) {
  const steps = [
    { id: 1, name: 'Contact' },
    { id: 2, name: 'Shipping' },
    { id: 3, name: 'Payment' },
    { id: 4, name: 'Review' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step.id <= currentStep
                    ? 'bg-primary text-white'
                    : 'bg-neutral text-charcoal'
                }`}
              >
                {step.id < currentStep ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span className="text-xs mt-2 text-charcoal">{step.name}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  step.id < currentStep ? 'bg-primary' : 'bg-neutral'
                }`}
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
}
```

---

## 📊 Success Metrics

### After Implementation:
- [ ] Lighthouse Performance Score > 90
- [ ] LCP < 2.5 seconds
- [ ] Time to checkout < 60 seconds
- [ ] Zero AI slop in copy
- [ ] Unique visual components (not template-like)
- [ ] Multi-faceted filtering working
- [ ] Product pages have specific details (fabric, fit, sizing)

---

## 🚀 Quick Wins (Do First - 1 hour)

1. ✅ Remove all AI slop from copy (DONE)
2. Add specific fabric compositions to products
3. Add model measurements to PDPs
4. Implement hover image on product cards
5. Add wishlist heart icon
6. Enable guest checkout
7. Add progress indicator to checkout

---

## 📝 Content Guidelines Going Forward

### DO Write Like This:
- "This dress features 95% cotton with 5% elastane for stretch"
- "Model is 5'9", wearing size Small"
- "Ships free on orders over $75"
- "30-day returns, no questions asked"

### DON'T Write Like This:
- ❌ "Premium quality craftsmanship"
- ❌ "Curated collection of amazing pieces"
- ❌ "Discover your perfect style"
- ❌ "Seamlessly transitions from day to night"
- ❌ "Elevated everyday essentials"

---

## 🎯 Final Checklist

### Visual Excellence
- [ ] High-res product images (min 2000px wide)
- [ ] Multiple product angles (front, back, detail, lifestyle)
- [ ] Consistent white/grey background
- [ ] Model photos showing fit

### UX Excellence
- [ ] 3-click maximum to any product
- [ ] Filters with product counts
- [ ] Sticky header on scroll
- [ ] Guest checkout enabled
- [ ] Express checkout options

### Copy Excellence
- [ ] No vague adjectives
- [ ] Specific measurements
- [ ] Clear fabric compositions
- [ ] Direct language
- [ ] Brand voice consistent

### Performance Excellence
- [ ] Images optimized and lazy loaded
- [ ] Fonts preloaded
- [ ] Critical CSS inlined
- [ ] JavaScript deferred
- [ ] Core Web Vitals passing

---

## Next Steps

**Week 1**: Implement Quick Wins + Priority 1-2
**Week 2**: Priority 3-4
**Week 3**: Priority 5 + Testing
**Week 4**: Polish + Launch

**Total estimated time**: 20-25 hours of development
