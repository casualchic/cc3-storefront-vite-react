# Casual Chic Boutique Storefront - Implementation Documentation

## Overview

This document provides comprehensive documentation for the Casual Chic Boutique storefront implementation, including architecture, components, and usage guidelines.

## Project Structure

```text
src/react-app/
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # Main navigation header with sticky behavior
│   │   └── Footer.tsx       # Footer with newsletter signup
│   ├── feature/             # Feature-specific components (to be added)
│   └── ui/                  # Reusable UI components (to be added)
├── context/
│   ├── CartContext.tsx      # Global shopping cart state
│   ├── WishlistContext.tsx  # Global wishlist state
│   └── ThemeContext.tsx     # Dark mode theme management
├── pages/
│   ├── HomePage.tsx         # Landing page with hero and featured products
│   ├── CollectionsPage.tsx  # All products collection view
│   ├── CategoryPage.tsx     # Category-filtered product view
│   ├── SalePage.tsx         # Sale items view
│   ├── AboutPage.tsx        # About us page
│   └── ContactPage.tsx      # Contact form and information
├── routes/
│   └── __root.tsx           # Root layout with header/footer
├── mocks/
│   ├── products.ts          # Mock product data
│   └── categories.ts        # Mock category data
├── types/
│   └── index.ts             # TypeScript type definitions
├── App.tsx                  # Main app with router and providers
└── main.tsx                 # Application entry point
```

## Architecture

### State Management

#### CartContext
Manages shopping cart state with localStorage persistence:
- `items`: Array of cart items
- `addItem`: Add product to cart (merges quantities if item exists)
- `removeItem`: Remove item from cart
- `updateQuantity`: Update item quantity
- `clearCart`: Clear all items
- `totalItems`: Total number of items (sum of quantities)
- `totalPrice`: Total cart value

#### WishlistContext
Manages wishlist state with localStorage persistence:
- `items`: Array of wishlist items
- `addItem`: Add product to wishlist (prevents duplicates)
- `removeItem`: Remove item from wishlist
- `isInWishlist`: Check if product is in wishlist
- `totalItems`: Total number of items

#### ThemeContext
Manages dark/light mode with localStorage persistence:
- `theme`: Current theme ('light' | 'dark')
- `toggleTheme`: Toggle between light and dark
- `setTheme`: Set specific theme
- Respects system preference on initial load

### Routing

Uses TanStack Router with file-based routing:

```tsx
// Root route with layout
createRootRoute({
  component: RootLayout  // Header/Footer wrapper
})

// Page routes created from files
createFileRoute('/')()                    // HomePage
createFileRoute('/collections')()         // CollectionsPage
createFileRoute('/collections/under-50')() // Under50Page
createFileRoute('/category/$slug')()      // CategoryPage (dynamic)
createFileRoute('/products/$id')()        // ProductDetailPage (dynamic)
createFileRoute('/sale')()                // SalePage
createFileRoute('/about')()               // AboutPage
createFileRoute('/contact')()             // ContactPage
```

Route files are automatically discovered from `src/react-app/routes/` and compiled into a route tree.

## Components

### Header Component

**Location:** `src/react-app/components/layout/Header.tsx`

**Features:**
- Sticky header with scroll-triggered background change
- Top announcement bar that collapses on scroll
- Desktop navigation with mega menu (Shop dropdown)
- Mobile hamburger menu with slide-in drawer
- Search modal
- Theme toggle (dark/light mode)
- User account dropdown (placeholder)
- Wishlist with badge count
- Shopping cart with badge count

**Responsive Behavior:**
- Mobile (<1024px): Hamburger menu, cart/wishlist icons visible
- Desktop (≥1024px): Full navigation menu, mega menu on hover

**State:**
- `isScrolled`: Triggers sticky header styling (>50px)
- `activeMegaMenu`: Controls mega menu visibility
- `isMobileMenuOpen`: Controls mobile menu drawer
- `isSearchOpen`: Controls search modal

### Footer Component

**Location:** `src/react-app/components/layout/Footer.tsx`

**Features:**
- 4-column responsive grid layout
- Brand section with social media links (Facebook, Instagram, Twitter)
- Shop links (category shortcuts)
- Customer service links
- Company information links
- Newsletter signup with email validation
- Dynamic copyright year
- Success/error state handling for newsletter form

**Responsive Behavior:**
- Mobile: 1 column stack
- Tablet: 2 columns
- Desktop: 4 columns

### Pages

#### HomePage
- Hero section with call-to-action buttons
- Category grid (6 categories)
- Featured products grid (4 products)
- Brand story section

#### CollectionsPage
- Full product grid
- Product cards with hover effects
- Sale badge for discounted items

#### CategoryPage
- Dynamic category header with description
- Filtered product grid
- Category not found handling

#### SalePage
- Red-themed sale page
- Only shows products with `originalPrice`
- Displays discount percentage

#### AboutPage
- Company mission and values
- Brand story
- Call to action to join community

#### ContactPage
- Contact information (email, phone, address)
- Contact form (name, email, message)
- Form validation (not yet implemented - basic form handler prevents page reload)

## Styling

### Tailwind CSS Configuration

**Dark Mode:** Class-based (`class` strategy)

**Custom Colors:**
```javascript
colors: {
  primary: { DEFAULT: '#000000', foreground: '#FFFFFF' },
  accent: { DEFAULT: '#DC2626', foreground: '#FFFFFF' },
}
```

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### CSS Variables

Light mode (`:root`):
```css
--background: 0 0% 100%;
--foreground: 0 0% 0%;
--primary: 0 0% 0%;
--accent: 0 84% 49%;
```

Dark mode (`.dark`):
```css
--background: 0 0% 12%;
--foreground: 0 0% 98%;
--primary: 0 0% 98%;
--accent: 0 84% 49%;
```

## Data Models

### Product
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;  // For sale items
  image: string;
  images?: string[];
  description?: string;
  category: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  rating?: number;
  reviews?: number;
}
```

### CartItem
```typescript
interface CartItem {
  id: string;              // Unique cart item ID
  productId: string;        // Reference to product
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}
```

### WishlistItem
```typescript
interface WishlistItem {
  id: string;              // Unique wishlist item ID
  productId: string;        // Reference to product
  name: string;
  price: number;
  image: string;
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}
```

## Development

### Running the Development Server

```bash
npm run dev
```

Starts Vite development server with hot module replacement.

### Building for Production

```bash
npm run build
```

Runs TypeScript compiler and Vite build for both SSR bundle and client assets.

### Testing

```bash
npm run test
```

(Note: Tests not yet implemented - see future enhancements)

## Accessibility

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order is logical and intuitive
- Focus states are visible

### ARIA Labels
- Icons have appropriate `aria-label` attributes
- Navigation landmarks are properly labeled

### Color Contrast
- Meets WCAG AA standards for text contrast
- Dark mode also meets contrast requirements

## Performance Optimizations

### Code Splitting
- React lazy loading can be added for route-based code splitting
- Dynamic imports for heavy components

### Image Optimization
- Currently uses placeholder images
- Production should use optimized images with proper sizes

### State Management
- LocalStorage for persistent state (cart, wishlist, theme)
- No unnecessary re-renders with proper context usage

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2015+ features used
- CSS Grid and Flexbox for layouts
- CSS custom properties for theming

## Future Enhancements

### High Priority
1. Product detail page with size/color selection
2. Functional shopping cart page with checkout
3. User authentication and account management
4. Search functionality with product filtering
5. Wishlist page view

### Medium Priority
1. Product reviews and ratings display
2. Related products and recommendations
3. Quick view modal for products
4. Size chart modal
5. Loading states and error handling

### Low Priority
1. Product zoom on hover/click
2. Recently viewed products
3. Compare products feature
4. Gift card support
5. Multi-currency support

## Known Limitations

1. **Mock Data**: Currently using hardcoded mock data for products and categories
2. **No Backend Integration**: Cart and wishlist only persist in localStorage
3. **No Product Images**: Using placeholder background colors
4. **No Search**: Search button opens empty modal
5. **No Authentication**: User account is placeholder only
6. **No Checkout**: Cart doesn't have checkout flow

## Linear Issue Tracking

**Issue:** CCB-1082 - Implement Root Layout Component with Header/Footer

**Status:** In Progress

**Acceptance Criteria Met:**
- ✅ Root layout component implemented
- ✅ Header with logo, navigation, search, cart, wishlist
- ✅ Footer with navigation, social icons, newsletter
- ✅ Mobile hamburger menu
- ✅ Sticky header on scroll
- ✅ Responsive design across breakpoints
- ✅ Dark mode support
- ⏳ Mega menu (structure in place, needs refinement)
- ⏳ Search functionality (modal opens, needs implementation)

## Deployment

### Cloudflare Workers
This project is configured for deployment on Cloudflare Workers with Vite.

```bash
npm run deploy
```

(Note: Deployment configuration may need adjustment based on Cloudflare account setup)

## Support and Maintenance

For questions or issues:
- Review this documentation
- Check COMPONENT_REQUIREMENTS.md for detailed specifications
- Refer to Linear issue CCB-1082 for acceptance criteria
- Contact development team for assistance

---

**Last Updated:** January 26, 2026
**Version:** 1.0.0
**Author:** Development Team
