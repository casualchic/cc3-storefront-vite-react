# ProductCard Component

## Overview

The `ProductCard` component displays individual product information in both grid and list layouts. It supports wishlist integration, quick add to cart, color swatches, stock status indicators, and hover interactions.

## Features

- **Responsive Image Display**: Lazy-loaded images with configurable aspect ratios (1:1, 3:4, 4:5)
- **Hover Image Swap**: Shows secondary product image on hover (desktop only)
- **Quick Add to Cart**: One-click add to cart with default variant
- **Wishlist Integration**: Heart icon to add/remove from wishlist
- **Color Swatches**: Visual preview of available colors (up to 5 shown + count)
- **Stock Status Badges**: "In Stock", "Low Stock", "Out of Stock" indicators
- **Sale Badges**: Custom badges for SALE, NEW, or other promotions
- **View Modes**: Grid and list layout support
- **Quick View**: Modal overlay for quick product details

## Props

```typescript
interface ProductCardProps {
  product: Product;                              // Product data object
  viewMode?: 'grid' | 'list';                   // Layout mode (default: 'grid')
  showQuickAdd?: boolean;                       // Show quick add button (default: true)
  showWishlist?: boolean;                       // Show wishlist button (default: true)
  aspectRatio?: '1/1' | '3/4' | '4/5';         // Image aspect ratio (default: '4/5')
  onAddToCart?: (variantId: string) => void;   // Custom add to cart handler
  onWishlistToggle?: (productId: string) => void; // Custom wishlist handler
  badge?: {                                     // Optional custom badge
    text: string;
    color: string; // Tailwind class (e.g., 'bg-red-500')
  };
}
```

## Product Type Requirements

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;                      // For sale price display
  image: string;                               // Primary image URL
  images?: string[];                           // Additional images for hover
  colorSwatches?: { name: string; hex: string }[]; // Color preview
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
  stockCount?: number;
  // ... other fields
}
```

## Usage Examples

### Basic Grid View

```typescript
import { ProductCard } from '@/components/ProductCard';

function ProductList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### List View with Custom Callbacks

```typescript
<ProductCard
  product={product}
  viewMode="list"
  onAddToCart={(variantId) => {
    console.log('Adding variant:', variantId);
    addToCart(variantId);
  }}
  onWishlistToggle={(productId) => {
    console.log('Toggling wishlist:', productId);
    toggleWishlist(productId);
  }}
/>
```

### Custom Aspect Ratio and Badge

```typescript
<ProductCard
  product={product}
  aspectRatio="1/1"
  badge={{ text: 'SALE', color: 'bg-red-500' }}
  showQuickAdd={true}
  showWishlist={false}
/>
```

## Stock Status Behavior

| Stock Status   | Badge Displayed                          | Quick Add Enabled |
| -------------- | ---------------------------------------- | ---------------- |
| `in-stock`     | "In Stock" (if stockCount > 100)         | ✅ Yes           |
| `low-stock`    | "Low Stock" (amber)                      | ✅ Yes           |
| `out-of-stock` | "Out of Stock" (gray)                    | ❌ No            |

## Hover Interactions

### Grid Mode
- **Image**: Secondary image fades in (if available)
- **Wishlist**: Heart icon slides in from top
- **Quick Add**: Button slides up from bottom
- **Quick View**: Eye icon appears bottom-right
- **Card**: Subtle scale transform (1.02x)

### List Mode
- **Quick Add**: Always visible inline
- **Wishlist**: No hover animation (always visible)
- **No Scale**: Card doesn't transform on hover

## Accessibility

- All interactive elements have proper ARIA labels
- Buttons have descriptive text for screen readers
- Images have descriptive alt text
- Focus states for keyboard navigation
- **Color contrast ratios (WCAG AA requires ≥4.5:1 for normal text)**:
  - ✅ Dark mode: gray-400 text achieves 5.78:1–6.99:1 (passes)
  - ✅ Light mode: gray-500 on white achieves 4.83:1 (passes)
  - ⚠️ Light mode: gray-500 on gray-100 achieves 4.39:1 (fails - below 4.5:1 minimum)
  - **Recommendation**: Use gray-600 token instead of gray-500 for text on gray-100 backgrounds to ensure WCAG AA compliance

## Performance

- Images use `loading="lazy"` for deferred loading
- Hover animations use CSS transforms (GPU accelerated)
- Minimal re-renders with React hooks
- LocalStorage for wishlist persistence

## Testing

Run component tests:

```bash
npm test ProductCard
```

See `src/react-app/components/__tests__/ProductCard.test.tsx` for test coverage.

## Related Components

- `ProductGrid` - Grid layout container for ProductCard
- `QuickViewModal` - Product quick view modal
- `CartContext` - Shopping cart state management
- `WishlistContext` - Wishlist state management
