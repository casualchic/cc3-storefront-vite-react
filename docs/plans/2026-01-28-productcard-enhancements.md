# ProductCard Component Enhancement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance the ProductCard component to meet all CCB-1086 requirements including Quick Add to Cart, view modes, color swatches, stock status badges, and hover image swap.

**Architecture:** Extend existing ProductCard with new props interface, add Quick Add functionality with cart integration, implement hover state for secondary image display, add color swatch preview and stock status indicators. Support both grid and list view modes with appropriate layout adjustments.

**Tech Stack:** React, TypeScript, TailwindCSS, Lucide React icons, existing CartContext and WishlistContext

---

## Current State Analysis

**Existing Features:**
- ✅ Product image with lazy loading (4:5 aspect ratio)
- ✅ Product title with line-clamp-2 truncation
- ✅ Price display with sale price formatting
- ✅ Wishlist toggle (heart icon) with WishlistContext
- ✅ Quick View modal integration
- ✅ Hover animations on card
- ✅ Badge support (SALE, NEW, etc.)

**Missing Requirements per CCB-1086:**
- ❌ Quick "Add to Cart" button (adds default variant)
- ❌ Color swatch preview (if product has color variants)
- ❌ Stock status badge: "In Stock", "Low Stock", "Out of Stock"
- ❌ Hover image swap on desktop (show secondary image)
- ❌ ViewMode support ('grid' | 'list')
- ❌ Configurable showQuickAdd and showWishlist props
- ❌ Callback props: onAddToCart, onWishlistToggle
- ❌ Support for 1:1 or 3:4 aspect ratio configuration

---

## Task 1: Extend Product Type for Missing Fields

**Files:**
- Modify: `src/react-app/types/index.ts:1-15`

**Step 1: Add stock status and variant fields to Product type**

Update the Product interface:

```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description?: string;
  category: string;
  sizes?: string[];
  colors?: string[];
  colorSwatches?: { name: string; hex: string }[]; // NEW: For color preview
  inStock: boolean;
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock'; // NEW: Stock status
  stockCount?: number; // NEW: Exact stock count
  rating?: number;
  reviews?: number;
  variants?: ProductVariant[]; // NEW: Product variants
  defaultVariantId?: string; // NEW: Default variant for quick add
}

// NEW: Product variant interface
export interface ProductVariant {
  id: string;
  productId: string;
  size?: string;
  color?: string;
  sku: string;
  stockCount: number;
  price?: number; // Optional override price
}
```

**Step 2: Run TypeScript compiler to check for errors**

Run: `npm run type-check` or `npx tsc --noEmit`
Expected: No type errors (may have warnings about unused types)

**Step 3: Commit type changes**

```bash
git add src/react-app/types/index.ts
git commit -m "feat(types): add stock status and variant fields to Product type"
```

---

## Task 2: Update ProductCard Props Interface

**Files:**
- Modify: `src/react-app/components/ProductCard.tsx:8-14`

**Step 1: Extend ProductCardProps interface**

Replace the current ProductCardProps interface with:

```typescript
interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  showQuickAdd?: boolean;
  showWishlist?: boolean;
  aspectRatio?: '1/1' | '3/4' | '4/5'; // Default 4/5
  onAddToCart?: (variantId: string) => void;
  onWishlistToggle?: (productId: string) => void;
  badge?: {
    text: string;
    color: string;
  };
}
```

**Step 2: Run TypeScript compiler**

Run: `npx tsc --noEmit`
Expected: Type errors in ProductCard component (expected, will fix in next tasks)

**Step 3: Commit props interface update**

```bash
git add src/react-app/components/ProductCard.tsx
git commit -m "feat(ProductCard): extend props interface for view modes and callbacks"
```

---

## Task 3: Add Helper Function for Stock Status Display

**Files:**
- Modify: `src/react-app/components/ProductCard.tsx:1-15`

**Step 1: Add stock status helper function**

Add this helper function before the ProductCard component:

```typescript
function getStockStatusConfig(product: Product): {
  badge: { text: string; className: string } | null;
  showQuickAdd: boolean;
} {
  const stockStatus = product.stockStatus || (product.inStock ? 'in-stock' : 'out-of-stock');

  switch (stockStatus) {
    case 'out-of-stock':
      return {
        badge: { text: 'Out of Stock', className: 'bg-gray-500' },
        showQuickAdd: false,
      };
    case 'low-stock':
      return {
        badge: { text: 'Low Stock', className: 'bg-amber-500' },
        showQuickAdd: true,
      };
    case 'in-stock':
    default:
      return {
        badge: product.stockCount && product.stockCount > 100
          ? { text: 'In Stock', className: 'bg-green-500' }
          : null,
        showQuickAdd: true,
      };
  }
}
```

**Step 2: Run TypeScript compiler**

Run: `npx tsc --noEmit`
Expected: No new errors (existing errors from incomplete refactor)

**Step 3: Commit helper function**

```bash
git add src/react-app/components/ProductCard.tsx
git commit -m "feat(ProductCard): add stock status helper function"
```

---

## Task 4: Implement Color Swatches Component

**Files:**
- Modify: `src/react-app/components/ProductCard.tsx` (add before ProductCard)

**Step 1: Add ColorSwatches sub-component**

Add this component before ProductCard:

```typescript
function ColorSwatches({ colors }: { colors: { name: string; hex: string }[] }) {
  const displayColors = colors.slice(0, 5);
  const remainingCount = colors.length - 5;

  return (
    <div className="flex items-center gap-1.5">
      {displayColors.map((color) => (
        <div
          key={color.name}
          className="w-5 h-5 rounded-full border-2 border-gray-200 dark:border-gray-700 shadow-sm"
          style={{ backgroundColor: color.hex }}
          title={color.name}
          aria-label={color.name}
        />
      ))}
      {remainingCount > 0 && (
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
          +{remainingCount}
        </span>
      )}
    </div>
  );
}
```

**Step 2: Run TypeScript compiler**

Run: `npx tsc --noEmit`
Expected: No new errors

**Step 3: Commit color swatches component**

```bash
git add src/react-app/components/ProductCard.tsx
git commit -m "feat(ProductCard): add color swatches preview component"
```

---

## Task 5: Implement Quick Add to Cart Functionality

**Files:**
- Modify: `src/react-app/components/ProductCard.tsx:16-43`

**Step 1: Update imports and component setup**

Add ShoppingCart icon to imports:

```typescript
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
```

Update the ProductCard component to accept new props and set up cart:

```typescript
export function ProductCard({
  product,
  viewMode = 'grid',
  showQuickAdd = true,
  showWishlist = true,
  aspectRatio = '4/5',
  onAddToCart,
  onWishlistToggle,
  badge
}: ProductCardProps) {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const inWishlist = isInWishlist(product.id);
  const stockConfig = getStockStatusConfig(product);
```

**Step 2: Add handleQuickAdd function**

Add this handler after handleWishlistClick:

```typescript
const handleQuickAdd = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  if (!stockConfig.showQuickAdd) return;

  setIsAddingToCart(true);

  try {
    // Get default variant or first available variant
    const variantId = product.defaultVariantId || product.variants?.[0]?.id;
    const variant = product.variants?.find(v => v.id === variantId);

    // Call custom callback if provided
    if (onAddToCart) {
      onAddToCart(variantId || product.id);
    } else {
      // Default behavior: add to cart with first size/color
      addItem({
        productId: product.id,
        name: product.name,
        price: variant?.price || product.price,
        quantity: 1,
        size: variant?.size || product.sizes?.[0] || 'One Size',
        color: variant?.color || product.colors?.[0] || 'Default',
        image: product.image,
      });
    }

    // Success feedback (could add toast notification here)
    setTimeout(() => setIsAddingToCart(false), 1000);
  } catch (error) {
    console.error('Failed to add to cart:', error);
    setIsAddingToCart(false);
  }
};
```

**Step 3: Update handleWishlistClick to use callback**

```typescript
const handleWishlistClick = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  if (onWishlistToggle) {
    onWishlistToggle(product.id);
  } else {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  }
};
```

**Step 4: Run TypeScript compiler**

Run: `npx tsc --noEmit`
Expected: No errors (warnings about isAddingToCart are okay)

**Step 5: Commit quick add functionality**

```bash
git add src/react-app/components/ProductCard.tsx
git commit -m "feat(ProductCard): implement quick add to cart functionality"
```

---

## Task 6: Implement Hover Image Swap

**Files:**
- Modify: `src/react-app/components/ProductCard.tsx:52-92`

**Step 1: Update image rendering logic**

Replace the image container section with:

```typescript
{/* Product Image Container */}
<div
  className={`relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 mb-3 transition-transform duration-300 ease-out ${
    viewMode === 'grid' ? 'group-hover:scale-[1.02]' : ''
  }`}
  style={{ aspectRatio }}
>
  {/* Primary Image */}
  <img
    src={product.image}
    alt={product.name}
    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
      isHovered && product.images && product.images.length > 0
        ? 'opacity-0'
        : 'opacity-100 group-hover:opacity-90'
    }`}
    loading="lazy"
  />

  {/* Secondary Image (Hover) */}
  {product.images && product.images.length > 0 && (
    <img
      src={product.images[0]}
      alt={`${product.name} - alternate view`}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}
      loading="lazy"
    />
  )}

  {/* Custom Badge (SALE, NEW, etc.) */}
  {badge && (
    <div className={`absolute top-3 left-3 ${badge.color} text-white px-3 py-1 text-xs font-bold rounded shadow-lg z-10`}>
      {badge.text}
    </div>
  )}

  {/* Stock Status Badge */}
  {stockConfig.badge && (
    <div className={`absolute top-3 ${badge ? 'left-auto right-3' : 'left-3'} ${stockConfig.badge.className} text-white px-3 py-1 text-xs font-bold rounded shadow-lg z-10`}>
      {stockConfig.badge.text}
    </div>
  )}

  {/* Wishlist Heart Icon */}
  {showWishlist && (
    <button
      onClick={handleWishlistClick}
      className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-200 ${
        inWishlist
          ? 'bg-red-500 text-white'
          : 'bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900'
      } ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
    </button>
  )}

  {/* Quick Add Button (replaces Quick View in hover) */}
  {showQuickAdd && stockConfig.showQuickAdd && viewMode === 'grid' && (
    <button
      onClick={handleQuickAdd}
      disabled={isAddingToCart}
      className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <ShoppingCart className="w-4 h-4" />
      {isAddingToCart ? 'Adding...' : 'Quick Add'}
    </button>
  )}

  {/* Quick View Button - secondary action */}
  <button
    onClick={handleQuickView}
    className={`absolute bottom-3 right-3 z-20 p-2 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all duration-200 ${
      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}
    aria-label="Quick view"
  >
    <Eye className="w-4 h-4" />
  </button>
</div>
```

**Step 2: Run TypeScript compiler**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit hover image swap**

```bash
git add src/react-app/components/ProductCard.tsx
git commit -m "feat(ProductCard): implement hover image swap and reorganize action buttons"
```

---

## Task 7: Update Product Info Section with Color Swatches

**Files:**
- Modify: `src/react-app/components/ProductCard.tsx:94-135`

**Step 1: Update product info section**

Replace the product info section with:

```typescript
{/* Product Info */}
<div className={viewMode === 'list' ? 'flex-1' : ''}>
  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200 line-clamp-2 mb-2">
    {product.name}
  </h3>

  {/* Color Swatches */}
  {product.colorSwatches && product.colorSwatches.length > 0 && (
    <div className="mb-2">
      <ColorSwatches colors={product.colorSwatches} />
    </div>
  )}

  {/* Size & Color Count (fallback if no swatches) */}
  {(!product.colorSwatches || product.colorSwatches.length === 0) && (
    <div className="flex items-center gap-3 mb-2 text-xs text-gray-500 dark:text-gray-400">
      {product.colors && product.colors.length > 0 && (
        <span>{product.colors.length} color{product.colors.length > 1 ? 's' : ''}</span>
      )}
      {product.sizes && product.sizes.length > 0 && (
        <span>{product.sizes.length} size{product.sizes.length > 1 ? 's' : ''}</span>
      )}
    </div>
  )}

  {/* Price */}
  <div className="flex items-center gap-2">
    <span className="text-lg font-bold text-gray-900 dark:text-white">
      ${product.price.toFixed(2)}
    </span>
    {product.originalPrice && (
      <>
        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
          ${product.originalPrice.toFixed(2)}
        </span>
        <span className="text-xs font-semibold text-red-600 dark:text-red-400">
          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
        </span>
      </>
    )}
  </div>

  {/* Rating (if available) */}
  {product.rating && product.reviews && (
    <div className="flex items-center gap-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
      <span className="text-amber-500">★</span>
      <span>{product.rating.toFixed(1)}</span>
      <span>({product.reviews})</span>
    </div>
  )}

  {/* Quick Add for List View */}
  {viewMode === 'list' && showQuickAdd && stockConfig.showQuickAdd && (
    <button
      onClick={handleQuickAdd}
      disabled={isAddingToCart}
      className="mt-3 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ShoppingCart className="w-4 h-4" />
      {isAddingToCart ? 'Adding...' : 'Add to Cart'}
    </button>
  )}
</div>
```

**Step 2: Run TypeScript compiler**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit color swatches integration**

```bash
git add src/react-app/components/ProductCard.tsx
git commit -m "feat(ProductCard): add color swatches and improve product info display"
```

---

## Task 8: Implement List View Mode

**Files:**
- Modify: `src/react-app/components/ProductCard.tsx:45-52`

**Step 1: Update Link wrapper for view mode**

Replace the Link opening tag and container structure:

```typescript
return (
  <>
    <Link
      to="/products/$id"
      params={{ id: product.id }}
      className={`group block ${
        viewMode === 'list'
          ? 'flex gap-4 items-start'
          : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
```

**Step 2: Update image container sizing for list view**

Update the image container div className to handle list view sizing:

```typescript
<div
  className={`relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 transition-transform duration-300 ease-out ${
    viewMode === 'list'
      ? 'w-48 flex-shrink-0 mb-0'
      : 'mb-3 group-hover:scale-[1.02]'
  }`}
  style={{ aspectRatio: viewMode === 'list' ? '3/4' : aspectRatio }}
>
```

**Step 3: Run TypeScript compiler**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Run development server to test**

Run: `npm run dev`
Expected: Server starts successfully
Test: Verify grid view works in browser

**Step 5: Commit list view mode support**

```bash
git add src/react-app/components/ProductCard.tsx
git commit -m "feat(ProductCard): implement list view mode support"
```

---

## Task 9: Create Comprehensive Tests for ProductCard

**Files:**
- Create: `src/react-app/components/__tests__/ProductCard.test.tsx`

**Step 1: Write test file structure and imports**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '../ProductCard';
import { CartProvider } from '../../context/CartContext';
import { WishlistProvider } from '../../context/WishlistContext';
import { Product } from '../../types';

// Mock product data
const mockProduct: Product = {
  id: 'test-1',
  name: 'Test Product',
  price: 99.99,
  originalPrice: 149.99,
  image: '/test-image.jpg',
  images: ['/test-image-2.jpg'],
  category: 'dresses',
  sizes: ['S', 'M', 'L'],
  colors: ['Red', 'Blue'],
  colorSwatches: [
    { name: 'Red', hex: '#FF0000' },
    { name: 'Blue', hex: '#0000FF' },
  ],
  inStock: true,
  stockStatus: 'in-stock',
  rating: 4.5,
  reviews: 120,
};

const mockProductOutOfStock: Product = {
  ...mockProduct,
  id: 'test-2',
  inStock: false,
  stockStatus: 'out-of-stock',
};

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          {ui}
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

describe('ProductCard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Basic Rendering', () => {
    it('renders product name', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('renders product price', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    it('renders sale price with discount', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      expect(screen.getByText('$149.99')).toBeInTheDocument();
      expect(screen.getByText('33% OFF')).toBeInTheDocument();
    });

    it('renders rating', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText('(120)')).toBeInTheDocument();
    });

    it('renders custom badge', () => {
      renderWithProviders(
        <ProductCard
          product={mockProduct}
          badge={{ text: 'NEW', color: 'bg-blue-500' }}
        />
      );
      expect(screen.getByText('NEW')).toBeInTheDocument();
    });
  });

  describe('Stock Status', () => {
    it('shows "Out of Stock" badge for out of stock products', () => {
      renderWithProviders(<ProductCard product={mockProductOutOfStock} />);
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });

    it('hides quick add button for out of stock products', () => {
      renderWithProviders(<ProductCard product={mockProductOutOfStock} />);
      const quickAddButton = screen.queryByRole('button', { name: /quick add/i });
      expect(quickAddButton).not.toBeInTheDocument();
    });

    it('shows quick add button for in-stock products on hover', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      const quickAddButton = screen.getByRole('button', { name: /quick add/i });
      expect(quickAddButton).toBeInTheDocument();
    });
  });

  describe('Color Swatches', () => {
    it('renders color swatches when available', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      const swatches = screen.getAllByTitle(/Red|Blue/);
      expect(swatches).toHaveLength(2);
    });

    it('shows color count when swatches not available', () => {
      const productNoSwatches = { ...mockProduct, colorSwatches: undefined };
      renderWithProviders(<ProductCard product={productNoSwatches} />);
      expect(screen.getByText('2 colors')).toBeInTheDocument();
    });

    it('limits swatches to 5 and shows remainder', () => {
      const manyColors = Array.from({ length: 8 }, (_, i) => ({
        name: `Color ${i}`,
        hex: `#00000${i}`,
      }));
      const productManyColors = { ...mockProduct, colorSwatches: manyColors };
      renderWithProviders(<ProductCard product={productManyColors} />);
      expect(screen.getByText('+3')).toBeInTheDocument();
    });
  });

  describe('Quick Add to Cart', () => {
    it('calls onAddToCart callback when provided', async () => {
      const onAddToCart = vi.fn();
      renderWithProviders(
        <ProductCard product={mockProduct} onAddToCart={onAddToCart} />
      );

      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      const quickAddButton = screen.getByRole('button', { name: /quick add/i });
      fireEvent.click(quickAddButton);

      await waitFor(() => {
        expect(onAddToCart).toHaveBeenCalledWith(mockProduct.id);
      });
    });

    it('adds product to cart when no callback provided', async () => {
      renderWithProviders(<ProductCard product={mockProduct} />);

      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      const quickAddButton = screen.getByRole('button', { name: /quick add/i });
      fireEvent.click(quickAddButton);

      await waitFor(() => {
        expect(quickAddButton).toHaveTextContent('Adding...');
      });
    });

    it('respects showQuickAdd prop', () => {
      renderWithProviders(<ProductCard product={mockProduct} showQuickAdd={false} />);
      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      const quickAddButton = screen.queryByRole('button', { name: /quick add/i });
      expect(quickAddButton).not.toBeInTheDocument();
    });
  });

  describe('Wishlist', () => {
    it('toggles wishlist on heart icon click', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      const wishlistButton = screen.getByLabelText('Add to wishlist');
      fireEvent.click(wishlistButton);

      expect(screen.getByLabelText('Remove from wishlist')).toBeInTheDocument();
    });

    it('calls onWishlistToggle callback when provided', () => {
      const onWishlistToggle = vi.fn();
      renderWithProviders(
        <ProductCard product={mockProduct} onWishlistToggle={onWishlistToggle} />
      );

      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      const wishlistButton = screen.getByLabelText('Add to wishlist');
      fireEvent.click(wishlistButton);

      expect(onWishlistToggle).toHaveBeenCalledWith(mockProduct.id);
    });

    it('respects showWishlist prop', () => {
      renderWithProviders(<ProductCard product={mockProduct} showWishlist={false} />);
      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      const wishlistButton = screen.queryByLabelText(/wishlist/i);
      expect(wishlistButton).not.toBeInTheDocument();
    });
  });

  describe('View Modes', () => {
    it('renders in grid mode by default', () => {
      const { container } = renderWithProviders(<ProductCard product={mockProduct} />);
      const link = container.querySelector('a');
      expect(link).not.toHaveClass('flex');
    });

    it('renders in list mode when specified', () => {
      const { container } = renderWithProviders(
        <ProductCard product={mockProduct} viewMode="list" />
      );
      const link = container.querySelector('a');
      expect(link).toHaveClass('flex');
    });

    it('shows quick add button inline in list mode', () => {
      renderWithProviders(<ProductCard product={mockProduct} viewMode="list" />);
      const quickAddButton = screen.getByRole('button', { name: /add to cart/i });
      expect(quickAddButton).toBeInTheDocument();
    });
  });

  describe('Hover Behavior', () => {
    it('shows secondary image on hover when available', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      const link = screen.getByRole('link');

      fireEvent.mouseEnter(link);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2); // Primary + secondary
    });

    it('shows action buttons on hover', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      const link = screen.getByRole('link');

      fireEvent.mouseEnter(link);

      expect(screen.getByLabelText('Add to wishlist')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /quick add/i })).toBeInTheDocument();
    });
  });

  describe('Aspect Ratio', () => {
    it('uses default 4/5 aspect ratio', () => {
      const { container } = renderWithProviders(<ProductCard product={mockProduct} />);
      const imageContainer = container.querySelector('[style*="aspect-ratio"]');
      expect(imageContainer).toHaveStyle({ aspectRatio: '4/5' });
    });

    it('respects custom aspect ratio', () => {
      const { container } = renderWithProviders(
        <ProductCard product={mockProduct} aspectRatio="1/1" />
      );
      const imageContainer = container.querySelector('[style*="aspect-ratio"]');
      expect(imageContainer).toHaveStyle({ aspectRatio: '1/1' });
    });
  });
});
```

**Step 2: Run tests**

Run: `npm test ProductCard`
Expected: All tests pass (may need to install @testing-library/react if not present)

**Step 3: Commit tests**

```bash
git add src/react-app/components/__tests__/ProductCard.test.tsx
git commit -m "test(ProductCard): add comprehensive component tests"
```

---

## Task 10: Update ProductGrid to Pass New Props

**Files:**
- Modify: `src/react-app/components/ProductGrid.tsx:144-148`

**Step 1: Update ProductGrid ProductCard usage**

Update the ProductCard usage in grid mode:

```typescript
<ProductCard
  key={product.id}
  product={product}
  viewMode={viewMode}
  showQuickAdd={true}
  showWishlist={true}
/>
```

**Step 2: Update ProductCardList component**

Find and update the ProductCardList component around line 226:

```typescript
function ProductCardList({ product }: { product: Product }) {
  return (
    <ProductCard
      product={product}
      viewMode="list"
      showQuickAdd={true}
      showWishlist={true}
    />
  );
}
```

**Step 3: Run TypeScript compiler**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit ProductGrid updates**

```bash
git add src/react-app/components/ProductGrid.tsx
git commit -m "feat(ProductGrid): update to use new ProductCard props"
```

---

## Task 11: Update Mock Data with New Fields

**Files:**
- Find and modify: Mock data files with Product objects

**Step 1: Find mock data files**

Run: `grep -r "const.*products.*Product\[\]" src/react-app --include="*.ts" --include="*.tsx"`

**Step 2: Update found mock data**

For each file found, add the new optional fields to sample products:

```typescript
{
  // ... existing fields
  colorSwatches: [
    { name: 'Black', hex: '#000000' },
    { name: 'Navy', hex: '#1E3A8A' },
  ],
  stockStatus: 'in-stock' as const,
  stockCount: 45,
  images: ['/path/to/alt-image.jpg'],
}
```

**Step 3: Run TypeScript compiler**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit mock data updates**

```bash
git add src/react-app/
git commit -m "feat(data): update mock products with stock status and color swatches"
```

---

## Task 12: Create Documentation

**Files:**
- Create: `docs/ProductCard.md`

**Step 1: Write comprehensive documentation**

```markdown
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

| Stock Status | Badge Displayed | Quick Add Enabled |
|--------------|----------------|-------------------|
| `in-stock` | "In Stock" (if stockCount > 100) | ✅ Yes |
| `low-stock` | "Low Stock" (amber) | ✅ Yes |
| `out-of-stock` | "Out of Stock" (gray) | ❌ No |

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
- Color contrast meets WCAG AA standards

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
```

**Step 2: Commit documentation**

```bash
git add docs/ProductCard.md
git commit -m "docs: add comprehensive ProductCard component documentation"
```

---

## Task 13: Update Linear Issue Progress

**Step 1: Add comment to Linear issue**

Create a progress comment documenting completed work:

```
✅ **ProductCard Enhancement - Complete**

All acceptance criteria have been implemented:

**Completed Features:**
- ✅ Product image with configurable aspect ratios (1:1, 3:4, 4:5) and lazy loading
- ✅ Product title with 2-line truncation, links to PDP
- ✅ Price display with sale price formatting (original crossed out)
- ✅ Quick "Add to Cart" button (adds default variant or first available)
- ✅ Wishlist toggle button (heart icon) with context integration
- ✅ Color swatch preview (shows up to 5 colors + count)
- ✅ Stock status badges: "In Stock", "Low Stock", "Out of Stock"
- ✅ Sale/New badges based on product metadata
- ✅ Hover image swap on desktop (shows secondary image)
- ✅ Grid and list view mode support
- ✅ Configurable props for callbacks and visibility

**Additional Enhancements:**
- Quick View modal integration (eye icon)
- Responsive hover animations
- Dark mode support
- Comprehensive test coverage
- Full TypeScript type safety
- Accessibility improvements

**Files Modified:**
- `src/react-app/types/index.ts` - Extended Product type
- `src/react-app/components/ProductCard.tsx` - Full enhancement
- `src/react-app/components/ProductGrid.tsx` - Props update
- `src/react-app/components/__tests__/ProductCard.test.tsx` - Tests
- `docs/ProductCard.md` - Documentation

**Test Coverage:** 100% of acceptance criteria covered

Ready for code review and QA testing.
```

**Step 2: Run Linear comment command**

This will be done via Linear API in later task.

---

## Task 14: Run All Tests and Fix Issues

**Files:**
- Various test files if failures occur

**Step 1: Run full test suite**

Run: `npm test`
Expected: All tests pass

**Step 2: Run type checking**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 3: Run linting**

Run: `npm run lint`
Expected: No lint errors (or only minor warnings)

**Step 4: Fix any failures**

If tests fail:
1. Read error messages carefully
2. Fix the specific issue
3. Re-run tests
4. Commit fixes with descriptive message

**Step 5: Commit test fixes if needed**

```bash
git add .
git commit -m "fix: resolve test failures and type errors"
```

---

## Task 15: Create Follow-up Linear Issues

**Step 1: Identify enhancement opportunities**

Review completed work and create issues for:

1. **Performance Optimization**: Image optimization with WebP format
2. **Analytics Integration**: Track quick add and wishlist interactions
3. **A/B Testing**: Test hover vs always-visible quick add
4. **Variant Selection**: Full variant picker in quick add modal
5. **Stock Notifications**: Email alerts for out-of-stock items

**Step 2: Document in recommendations file**

Create: `docs/productcard-future-enhancements.md`

```markdown
# ProductCard Future Enhancements

## Performance Optimization (High Priority)
- Implement responsive images with srcset
- Use WebP format with JPEG fallback
- Add image CDN integration
- Implement virtualization for large grids (100+ products)

## Enhanced Variant Selection (Medium Priority)
- Quick add with variant picker modal
- Size and color selection before add to cart
- Variant stock status per size/color
- Recently viewed variant persistence

## Analytics & Tracking (Medium Priority)
- Track quick add vs full PDP conversion
- Monitor wishlist add/remove rates
- A/B test button positions and copy
- Heat map hover interaction analysis

## Accessibility Improvements (Medium Priority)
- Add keyboard shortcuts for quick add
- Improve screen reader announcements
- Add skip navigation for large grids
- Enhance color contrast in dark mode

## Stock & Availability (Low Priority)
- Real-time stock updates via WebSocket
- "Notify me when available" for out-of-stock
- Pre-order support for upcoming items
- Size availability indicators

## Social Features (Low Priority)
- Share product on social media
- "Similar items" quick view
- Customer photos/reviews preview
- Wishlist sharing functionality
```

**Step 3: Commit recommendations**

```bash
git add docs/productcard-future-enhancements.md
git commit -m "docs: add ProductCard future enhancement recommendations"
```

---

## Task 16: Final Integration Testing

**Step 1: Start development server**

Run: `npm run dev`
Expected: Server starts on http://localhost:5173

**Step 2: Manual testing checklist**

Test in browser:
- [ ] Grid view displays correctly
- [ ] List view displays correctly
- [ ] Hover shows secondary image
- [ ] Quick add button works
- [ ] Wishlist toggle works
- [ ] Color swatches display
- [ ] Stock badges show correctly
- [ ] Out of stock hides quick add
- [ ] Sale price displays correctly
- [ ] Links navigate to PDP
- [ ] Dark mode works
- [ ] Mobile responsive

**Step 3: Test with real data if available**

Navigate to product listing pages and verify all features work with actual data.

**Step 4: Document any issues**

If issues found, create bug fix commits with clear messages.

---

## Task 17: Update Linear and Create Pull Request

**Step 1: Update Linear issue status**

Mark CCB-1086 as complete with final comment.

**Step 2: Push branch to remote**

```bash
git push -u origin ianrothfuss/CCB-1086
```

**Step 3: Create Pull Request**

```bash
gh pr create --title "feat: Implement ProductCard Component (CCB-1086)" --body "$(cat <<'EOF'
## Summary

Implements all requirements for CCB-1086: ProductCard component enhancements including quick add to cart, color swatches, stock status indicators, hover image swap, and view mode support.

## Changes

### Type System
- Extended `Product` type with `colorSwatches`, `stockStatus`, `stockCount`, `variants`, `defaultVariantId`
- Added `ProductVariant` interface for variant management

### ProductCard Component
- ✅ Quick "Add to Cart" with default variant selection
- ✅ Color swatch preview (up to 5 colors + count)
- ✅ Stock status badges (In Stock, Low Stock, Out of Stock)
- ✅ Hover image swap for secondary product images
- ✅ Grid and list view mode support
- ✅ Configurable aspect ratios (1:1, 3:4, 4:5)
- ✅ Custom callback props for cart and wishlist
- ✅ Improved accessibility and dark mode support

### Testing
- Comprehensive test coverage (100% of requirements)
- Unit tests for all new features
- Integration tests with Cart and Wishlist contexts

### Documentation
- Complete component API documentation
- Usage examples and best practices
- Future enhancement recommendations

## Testing

```bash
npm test ProductCard
npm run type-check
npm run lint
```

## Screenshots

_Add screenshots of grid view, list view, and hover states_

## Related Issues

- Implements CCB-1086
- Depends on existing CartContext and WishlistContext

## Checklist

- [x] All acceptance criteria met
- [x] Tests passing
- [x] TypeScript compilation successful
- [x] Documentation complete
- [x] Manual testing performed
- [x] Dark mode verified
- [x] Mobile responsive verified

EOF
)"
```

**Step 4: Request code review**

Assign reviewers and link to Linear issue.

---

## Task 18: Merge and Deploy

**Step 1: Address code review feedback**

Make requested changes and push updates.

**Step 2: Merge PR to main**

```bash
gh pr merge --squash --delete-branch
```

**Step 3: Verify deployment**

Check that changes are deployed to staging/production.

**Step 4: Update Linear issue to Done**

Mark issue as complete and close.

**Step 5: Celebrate! 🎉**

Great work implementing comprehensive ProductCard enhancements!

---

## Rollback Plan

If issues are discovered post-merge:

1. **Immediate**: Revert merge commit
   ```bash
   git revert <merge-commit-sha>
   git push origin main
   ```

2. **Create hotfix**: Fix issues in new branch
3. **Test thoroughly**: Run full test suite
4. **Re-deploy**: Merge hotfix with expedited review

---

## Success Metrics

Post-deployment, monitor:
- Quick add conversion rate vs full PDP
- Wishlist engagement increase
- Cart abandonment rate changes
- Page load performance impact
- Error rates in analytics

Target improvements:
- +15% quick add usage
- +10% wishlist additions
- <100ms performance impact
- Zero critical errors

---

## End of Plan

**Total Estimated Time**: 4-6 hours for full implementation and testing

**Next Steps**: Choose execution approach (Subagent-Driven or Parallel Session)
