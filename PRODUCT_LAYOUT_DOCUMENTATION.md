# Product Layout Implementation Documentation

## Overview

This document describes the implementation of the Product Layout component with category navigation and filtering capabilities for the Casual Chic Boutique storefront.

## Components Implemented

### 1. ProductLayout Component
**Location**: `src/react-app/components/products/ProductLayout.tsx`

Main layout component that orchestrates product display with filtering and sorting.

**Features**:
- Category and subcategory filtering
- Price range filtering
- Size and color filtering
- In-stock and on-sale toggles
- URL-based state management (filters persist in query parameters)
- localStorage-based view preference (grid/list)
- Responsive sidebar (drawer on mobile)
- Results count display

**Props**:
- `category?: string` - Pre-selected category slug
- `subcategory?: string` - Pre-selected subcategory slug

**State Management**:
- Filters are synced to URL query parameters
- View mode preference is stored in localStorage
- All state updates trigger URL changes via `history.replaceState()`

### 2. ProductFilters Component
**Location**: `src/react-app/components/products/ProductFilters.tsx`

Sidebar filter panel with collapsible sections.

**Features**:
- Category hierarchy navigation (categories + subcategories)
- Price range selection
- Size and color chip selection
- In-stock only checkbox
- On-sale checkbox
- Expandable/collapsible sections
- Product count display per category
- Mobile drawer support

**Props**:
- `selectedCategory?: string`
- `selectedSubcategory?: string`
- `selectedSizes?: string[]`
- `selectedColors?: string[]`
- `priceRange?: [number, number]`
- `inStockOnly?: boolean`
- `onSale?: boolean`
- `onFilterChange: (filters) => void`
- `isOpen?: boolean` - Controls mobile drawer state
- `onClose?: () => void` - Callback for closing mobile drawer

### 3. ProductSort Component
**Location**: `src/react-app/components/products/ProductSort.tsx`

Dropdown for sorting products.

**Sort Options**:
- Relevance (default)
- Price: Low to High
- Price: High to Low
- Newest
- Best Selling

**Props**:
- `currentSort: SortOption`
- `onSortChange: (sort: SortOption) => void`

### 4. ProductGrid Component
**Location**: `src/react-app/components/products/ProductGrid.tsx`

Grid/list container for displaying products with view toggle.

**Features**:
- Grid view (responsive columns: 1 → 2 → 3 → 4)
- List view (single column with expanded info)
- View mode toggle buttons with icons
- Empty state message

**Props**:
- `products: Product[]`
- `viewMode: ViewMode`
- `onViewModeChange: (mode: ViewMode) => void`

### 5. ProductCard Component
**Location**: `src/react-app/components/products/ProductCard.tsx`

Individual product card with cart and wishlist integration.

**Features**:
- Product image with badges (sale, new, out-of-stock)
- Wishlist toggle button
- Price display (with original price if on sale)
- Star rating and review count
- Color swatches
- Add to cart button
- Grid and list view variants

**Props**:
- `product: Product`
- `viewMode?: 'grid' | 'list'`

## Supporting Components

### 6. Layout Components

**Header** (`src/react-app/components/layout/Header.tsx`):
- Logo and navigation
- Theme toggle (light/dark mode)
- Wishlist and cart icons with count badges
- Sticky positioning

**Footer** (`src/react-app/components/layout/Footer.tsx`):
- Four-column footer with links
- Responsive grid (1 → 2 → 4 columns)
- Copyright notice

**RootLayout** (`src/react-app/components/layout/RootLayout.tsx`):
- Wraps all pages with Header and Footer
- Flex layout for sticky footer

## Context Providers

### CartContext
**Location**: `src/react-app/context/CartContext.tsx`

Manages shopping cart state with localStorage persistence.

**API**:
- `cart: CartItem[]` - Current cart items
- `addToCart(item)` - Add item or increment quantity
- `removeFromCart(productId, size?, color?)` - Remove item
- `updateQuantity(productId, quantity, size?, color?)` - Update quantity
- `clearCart()` - Empty cart
- `getCartTotal()` - Calculate total price
- `getCartItemCount()` - Count total items

### WishlistContext
**Location**: `src/react-app/context/WishlistContext.tsx`

Manages wishlist state with localStorage persistence.

**API**:
- `wishlist: WishlistItem[]` - Current wishlist items
- `addToWishlist(item)` - Add item to wishlist
- `removeFromWishlist(productId)` - Remove item
- `isInWishlist(productId)` - Check if item is in wishlist
- `clearWishlist()` - Empty wishlist

### ThemeContext
**Location**: `src/react-app/context/ThemeContext.tsx`

Manages theme state (light/dark mode) with localStorage and system preference.

**API**:
- `theme: 'light' | 'dark'` - Current theme
- `toggleTheme()` - Toggle between light and dark
- `setTheme(theme)` - Set specific theme

## Type Definitions

**Location**: `src/react-app/types/index.ts`

Comprehensive TypeScript interfaces for:
- `Product` - Product data structure
- `Category` & `SubCategory` - Category hierarchy
- `CartItem` & `WishlistItem` - Cart and wishlist items
- `SortOption` - Sort dropdown values
- `ViewMode` - Grid or list view
- `FilterState` & `ProductFilters` - Filter state types

## Mock Data

### Categories
**Location**: `src/react-app/mocks/categories.ts`

Mock category data with hierarchy:
- Women (Tops, Dresses, Bottoms, Outerwear, Accessories)
- Men (Shirts, Pants, Outerwear, Accessories)
- Accessories (Bags, Jewelry, Hats, Scarves)
- Sale

**Helper functions**:
- `getCategoryBySlug(slug)` - Find category by slug
- `getSubcategoryBySlug(categorySlug, subcategorySlug)` - Find subcategory

### Products
**Location**: `src/react-app/mocks/products.ts`

Mock product data (20 products across categories).

**Helper functions**:
- `getProductsByCategory(categorySlug, subcategorySlug?)` - Filter by category
- `getSaleProducts()` - Get sale items
- `getNewProducts()` - Get new arrivals
- `getProductById(id)` - Find by ID

## Styling

All components use CSS modules with CSS custom properties for theming.

**Design System Variables**:
```css
/* Light Mode */
--bg-primary: #FFFFFF
--bg-secondary: #F9FAFB
--text-primary: #000000
--text-secondary: #6B7280
--border-color: #D1D5DB
--accent-red: #DC2626

/* Dark Mode (on :root.dark) */
--bg-primary: #1F2937
--bg-secondary: #111827
--text-primary: #FFFFFF
--text-secondary: #9CA3AF
--border-color: #374151
--accent-red: #EF4444
```

**Responsive Breakpoints**:
- Mobile: < 640px
- Small: 640px - 767px
- Medium: 768px - 1023px
- Large: 1024px - 1279px
- Extra Large: ≥ 1280px

## URL State Management

Filters and sort preferences are stored in URL query parameters:

```
/category/women?subcategory=dresses&sizes=S,M&colors=Black&minPrice=50&maxPrice=150&inStock=true&onSale=true&sort=price-low-high
```

**Parameters**:
- `category` - Category slug
- `subcategory` - Subcategory slug
- `sizes` - Comma-separated size list
- `colors` - Comma-separated color list
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `inStock` - true/false for in-stock filter
- `onSale` - true/false for sale filter
- `sort` - Sort option

## localStorage Keys

- `cc3-cart` - Shopping cart data (JSON array of CartItem)
- `cc3-wishlist` - Wishlist data (JSON array of WishlistItem)
- `cc3-theme` - Theme preference ('light' or 'dark')
- `cc3-view-mode` - View mode preference ('grid' or 'list')

## Responsive Behavior

### Desktop (≥ 1024px)
- Sidebar always visible
- Filter toggle hidden
- Grid: 3-4 columns
- List: full width

### Tablet (768px - 1023px)
- Sidebar as drawer (overlay)
- Filter toggle button visible
- Grid: 2 columns
- List: full width

### Mobile (< 768px)
- Sidebar as drawer (80% width, max 320px)
- Filter toggle button visible
- Grid: 1 column
- List: 1 column

## Usage Example

```tsx
import { ProductLayout } from './components/products/ProductLayout';

// All products
<ProductLayout />

// Filtered by category
<ProductLayout category="women" />

// Filtered by category and subcategory
<ProductLayout category="women" subcategory="dresses" />
```

## Integration with App

The App component wraps everything with context providers:

```tsx
<ThemeProvider>
  <WishlistProvider>
    <CartProvider>
      <RootLayout>
        {/* Pages */}
      </RootLayout>
    </CartProvider>
  </WishlistProvider>
</ThemeProvider>
```

## Acceptance Criteria Status

- ✅ Category sidebar/breadcrumb navigation showing current hierarchy
- ✅ Filter panel (collapsible on mobile)
- ✅ Filters persist in URL query parameters
- ✅ Sort dropdown with options: relevance, price (low-high, high-low), newest, bestselling
- ✅ Grid/List view toggle with preference stored in localStorage
- ✅ Results count display: "Showing X of Y products"

## Future Enhancements

- Add breadcrumb navigation component
- Implement pagination or infinite scroll
- Add filter reset per section
- Add price range slider
- Implement product quick view modal
- Add keyboard navigation support
- Add URL-based deep linking to specific products
- Integration with TanStack Router for proper routing

## Files Created

### Components
- `src/react-app/components/layout/Header.tsx` & `.css`
- `src/react-app/components/layout/Footer.tsx` & `.css`
- `src/react-app/components/layout/RootLayout.tsx` & `.css`
- `src/react-app/components/products/ProductLayout.tsx` & `.css`
- `src/react-app/components/products/ProductFilters.tsx` & `.css`
- `src/react-app/components/products/ProductSort.tsx` & `.css`
- `src/react-app/components/products/ProductGrid.tsx` & `.css`
- `src/react-app/components/products/ProductCard.tsx` & `.css`

### Context
- `src/react-app/context/CartContext.tsx`
- `src/react-app/context/WishlistContext.tsx`
- `src/react-app/context/ThemeContext.tsx`

### Types & Data
- `src/react-app/types/index.ts`
- `src/react-app/mocks/categories.ts`
- `src/react-app/mocks/products.ts`

### Pages
- `src/react-app/pages/HomePage.tsx`
- `src/react-app/pages/CategoryPage.tsx`

### Modified
- `src/react-app/App.tsx` - Added context providers and basic routing
- `src/react-app/App.css` - Updated with page styles
- `src/react-app/index.css` - Updated with design system variables
- `package.json` - Added @tanstack/react-router dependency