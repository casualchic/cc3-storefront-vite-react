# Component Requirements - Casual Chic Boutique Storefront

## Layout Requirements (LAYOUT-001 through LAYOUT-008)

### LAYOUT-001: Root Layout Structure
**Requirement:** Implement a root layout component that wraps all pages with consistent header and footer navigation.

**Technical Specification:**
- Component location: `src/react-app/routes/__root.tsx`
- Must use React Router v7's layout route pattern
- Must render Header, main content area (Outlet), and Footer
- Must maintain scroll position on navigation
- Must support nested routing

**Acceptance Criteria:**
- [x] Root layout component exists
- [x] Uses `<Outlet />` for nested route content
- [x] Header and Footer render consistently across all pages
- [x] Layout does not remount on navigation

---

### LAYOUT-002: Header Component - Desktop Navigation
**Requirement:** Implement responsive header with logo, navigation menu, and action buttons for desktop viewports (≥1024px).

**Technical Specification:**
- Logo must link to home page (`/`)
- Primary navigation links:
  - Shop (with mega menu dropdown)
  - Collections (`/collections`)
  - Sale (`/sale`) - styled in red/accent color
  - About (`/about`)
  - Contact (`/contact`)
- Action buttons (right-aligned):
  - Search (opens modal)
  - User Account (dropdown: Login/Register or Account menu based on auth state)
  - Wishlist (with badge count)
  - Shopping Cart (with badge count)

**Acceptance Criteria:**
- [ ] Logo renders and links to home
- [ ] All navigation links are clickable and route correctly
- [ ] Search button opens search modal
- [ ] User account button shows appropriate dropdown based on auth state
- [ ] Wishlist and cart badges display item counts
- [ ] Header is visually aligned and professionally styled

---

### LAYOUT-003: Header Component - Sticky Behavior
**Requirement:** Header must stick to the top of viewport on scroll with smooth animation.

**Technical Specification:**
- Initial state: Transparent or light background
- Scrolled state (>50px from top):
  - Solid white background
  - Drop shadow
  - Smooth opacity transition (300ms ease)
- Top announcement bar collapses on scroll
- Header maintains 64px height when scrolled

**Acceptance Criteria:**
- [ ] Header becomes sticky after scrolling 50px
- [ ] Background transitions smoothly from transparent to solid white
- [ ] Shadow appears on scroll
- [ ] Top announcement bar smoothly collapses
- [ ] No layout shift or jank during transition

---

### LAYOUT-004: Header Component - Mobile Navigation
**Requirement:** Implement mobile-responsive header with hamburger menu for viewports <1024px.

**Technical Specification:**
- Hamburger icon replaces desktop navigation at <1024px breakpoint
- Menu slides in from left with overlay
- Mobile menu contains:
  - All primary navigation links
  - Expandable category sections
  - Search input
  - Account link
- Cart and wishlist icons remain visible in mobile header

**Acceptance Criteria:**
- [ ] Hamburger menu icon displays at mobile breakpoints
- [ ] Menu slides in from left with smooth animation
- [ ] Overlay dims background when menu is open
- [ ] Menu closes on outside click or navigation
- [ ] All navigation items are accessible in mobile menu
- [ ] Cart/wishlist icons remain in header

---

### LAYOUT-005: Header Component - Mega Menu
**Requirement:** Implement mega menu dropdown for "Shop" navigation item (desktop only).

**Technical Specification:**
- Triggers on hover over "Shop" link
- Full-width dropdown with max-width: 1280px, centered
- 4-5 column grid layout:
  - Clothing categories
  - Accessories categories
  - Shop by Occasion
  - Featured collections with image
- Featured section includes:
  - Promotional image (300x400px)
  - Title and subtitle
  - CTA link
- Mega menu closes on mouse leave or click outside

**Acceptance Criteria:**
- [ ] Mega menu opens on "Shop" hover
- [ ] Grid layout displays categories in organized columns
- [ ] Featured image section renders with proper styling
- [ ] All links are clickable and route correctly
- [ ] Menu closes appropriately
- [ ] No mega menu on mobile (hamburger only)

---

### LAYOUT-006: Footer Component - Content Sections
**Requirement:** Implement comprehensive footer with navigation links, social icons, and newsletter signup.

**Technical Specification:**
- 4-column grid layout (responsive: 1 column mobile, 2 columns tablet, 4 columns desktop)
- Sections:
  1. Brand section: Logo, tagline, social media icons (Facebook, Instagram, Twitter, Pinterest)
  2. Shop: Quick links to main categories
  3. Customer Service: Contact, Size Guide, Shipping, Returns, FAQ
  4. Company: About, Careers, Press, Privacy Policy, Terms of Service
- Newsletter signup form:
  - Email input with validation
  - Subscribe button
  - Success/error messaging
  - Privacy disclaimer
- Bottom bar: Copyright text, payment icons, "Powered by" attribution

**Acceptance Criteria:**
- [ ] All footer sections render with proper content
- [ ] Social media icons link to respective platforms
- [ ] Newsletter form validates email format
- [ ] Newsletter form shows success/error states
- [ ] Footer is fully responsive across breakpoints
- [ ] Copyright year updates dynamically

---

### LAYOUT-007: Responsive Design System
**Requirement:** Implement consistent responsive design system across all layout components.

**Technical Specification:**
- Breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- Mobile-first approach: base styles for mobile, progressive enhancement for larger screens
- Use Tailwind CSS breakpoint utilities
- Maximum content width: 1280px (xl container)
- Consistent padding: 16px mobile, 24px tablet, 32px desktop

**Acceptance Criteria:**
- [ ] All components respond correctly at defined breakpoints
- [ ] No horizontal scroll at any viewport width
- [ ] Content remains readable on smallest supported device (320px)
- [ ] Spacing is consistent and follows design system
- [ ] Touch targets are minimum 44x44px on mobile

---

### LAYOUT-008: SEO and Dark Mode Support
**Requirement:** Implement SEO meta tags and dark mode theming support.

**Technical Specification:**
- SEO meta tags (via React Helmet or route metadata):
  - Page title
  - Meta description
  - Open Graph tags (og:title, og:description, og:image)
  - Twitter Card tags
  - Canonical URL
- Dark mode:
  - CSS variables for colors in `:root` and `.dark`
  - Theme toggle button in header
  - Persist theme preference in localStorage
  - Respect system preference (prefers-color-scheme)

**Acceptance Criteria:**
- [ ] Each route defines appropriate meta tags
- [ ] Meta tags update on route change
- [ ] Dark mode toggle switches theme correctly
- [ ] Theme preference persists across sessions
- [ ] Colors adapt properly in dark mode
- [ ] No flash of wrong theme on page load

---

## Data Dependencies

### Cart State
- Item count: integer
- Items: array of CartItem objects
  - id: string
  - productId: string
  - name: string
  - price: number
  - quantity: number
  - size: string
  - color: string
  - image: string

### Wishlist State
- Item count: integer
- Items: array of WishlistItem objects
  - id: string
  - productId: string
  - name: string
  - price: number
  - image: string

### Auth State
- isAuthenticated: boolean
- user: User object or null
  - id: string
  - email: string
  - name: string
  - avatar?: string

---

## Design References

Based on best-performing fashion e-commerce sites:
- **Princess Polly**: Bold hero sections, sticky header, prominent search and cart
- **Nordstrom**: Clean mega menus, sophisticated color palette, strong typography
- **Anthropologie**: Lifestyle-focused imagery, curated collections, editorial feel

### Color Palette
- Primary: Black (#000000) and White (#FFFFFF)
- Accent: Red for Sale items (#DC2626)
- Grays: #F9FAFB (bg), #6B7280 (text), #D1D5DB (borders)
- Dark mode: Inverted with #1F2937 backgrounds

### Typography
- Headings: Bold, large scale (32px - 48px)
- Body: 14px-16px, line-height 1.6
- Font family: System font stack (default Tailwind)

### Spacing Scale
- Consistent 8px base unit
- Sections: 64px-96px vertical padding
- Components: 16px-32px internal padding

---

## Product Grid Requirements (PROD-001 through PROD-005)

### PROD-001: ProductGrid Component - Responsive Layout
**Requirement:** Implement a responsive ProductGrid component that adapts column count based on viewport width.

**Technical Specification:**
- Component location: `src/react-app/components/ProductGrid.tsx`
- Breakpoint-based column layout:
  - Mobile (<640px): 1 column
  - Tablet (640px-1023px): 2 columns
  - Desktop (≥1024px): 3-4 columns (configurable)
- Use CSS Grid with gap spacing (24px)
- Maintain consistent aspect ratios across grid items
- Support `columns` prop to override desktop column count (2 | 3 | 4)

**Acceptance Criteria:**
- [ ] Grid renders 1 column on mobile viewports
- [ ] Grid renders 2 columns on tablet viewports (640px+)
- [ ] Grid renders 3-4 columns on desktop (1024px+), configurable via prop
- [ ] Grid maintains consistent spacing and alignment
- [ ] Grid is fully responsive without horizontal scroll

---

### PROD-002: ProductGrid Component - View Mode Support
**Requirement:** Support both grid and list view modes with smooth transitions.

**Technical Specification:**
- `viewMode` prop accepts 'grid' | 'list'
- Grid mode: Standard grid layout with ProductCard components
- List mode: Horizontal layout with image left, details right
  - Larger images (200x250px)
  - More product details visible
  - Horizontal arrangement of action buttons
- Smooth CSS transitions between view modes (300ms ease)
- Preserve product data and state during view mode changes

**Acceptance Criteria:**
- [ ] Grid mode displays products in responsive grid
- [ ] List mode displays products in horizontal layout
- [ ] View mode switching is smooth with CSS transitions
- [ ] Product state (wishlist, etc.) persists across view changes
- [ ] Both view modes are fully accessible

---

### PROD-003: ProductGrid Component - Loading States
**Requirement:** Display skeleton loading states during data fetches.

**Technical Specification:**
- `isLoading` prop controls loading state display
- Skeleton components match ProductCard dimensions
- Skeleton count matches expected grid layout (12 skeletons default)
- Pulse animation for skeleton elements (Tailwind `animate-pulse`)
- Loading skeletons respect current view mode (grid vs list)
- Maintain layout stability (no shift when data loads)

**Acceptance Criteria:**
- [ ] Skeleton loaders display when isLoading is true
- [ ] Skeletons match ProductCard dimensions and layout
- [ ] Pulse animation provides visual feedback
- [ ] No layout shift when loading completes
- [ ] Skeletons adapt to current view mode

---

### PROD-004: ProductGrid Component - Empty and Error States
**Requirement:** Display user-friendly empty and error states with appropriate actions.

**Technical Specification:**
- Empty state (no products):
  - Icon (package or search icon from lucide-react)
  - Heading: "No products found"
  - Description: Context-appropriate message
  - Optional CTA button (e.g., "Clear filters", "Browse all products")
- Error state (isError prop is true):
  - Icon (alert-circle from lucide-react)
  - Heading: "Oops! Something went wrong"
  - Description: "We couldn't load the products. Please try again."
  - Retry button that triggers provided callback
- Center-aligned, padded container (min-height: 400px)
- Consistent with overall design system

**Acceptance Criteria:**
- [ ] Empty state displays when products array is empty
- [ ] Empty state includes helpful message and icon
- [ ] Error state displays when isError is true
- [ ] Error state includes retry button that triggers callback
- [ ] States are visually consistent with design system
- [ ] States are accessible (proper heading hierarchy, button labels)

---

### PROD-005: ProductGrid Component - Infinite Scroll Pagination
**Requirement:** Implement infinite scroll with TanStack Query's useInfiniteQuery and intersection observer.

**Technical Specification:**
- Integration with TanStack Query `useInfiniteQuery`:
  - Accepts paginated API responses
  - Manages page cursors/offsets automatically
  - Handles loading states for initial and subsequent loads
- Infinite scroll trigger:
  - Intersection Observer API monitors sentinel element
  - Sentinel placed after last product in grid
  - Triggers `fetchNextPage` when sentinel is visible
  - 200px root margin for early triggering
- "Load More" button fallback:
  - Displayed below grid when `hasNextPage` is true
  - Manual trigger for `fetchNextPage`
  - Shows loading spinner when fetching
  - Disabled state during fetch
- Loading indicator:
  - Inline skeleton loaders for new page (4-6 items)
  - Positioned below existing products
  - Does not disrupt scroll position

**Props Interface:**
```typescript
interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => void;
  viewMode?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
  onRetry?: () => void;
  emptyStateMessage?: string;
  emptyStateAction?: {
    label: string;
    onClick: () => void;
  };
}
```

**Acceptance Criteria:**
- [ ] Infinite scroll automatically loads next page when scrolling near bottom
- [ ] Intersection observer properly triggers fetchNextPage
- [ ] "Load More" button provides manual trigger option
- [ ] Loading indicators display during pagination
- [ ] No duplicate products loaded
- [ ] Scroll position maintained during page loads
- [ ] hasNextPage correctly controls whether to show Load More button
- [ ] Works seamlessly with TanStack Query useInfiniteQuery

---

## Product Grid Integration Notes

### TanStack Query Setup
ProductGrid is designed to work with TanStack Query's `useInfiniteQuery`. Example usage:

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { ProductGrid } from '@/components/ProductGrid';

function ProductsPage() {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: ({ pageParam = 0 }) => fetchProducts(pageParam, filters),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const products = data?.pages.flatMap(page => page.products) ?? [];

  return (
    <ProductGrid
      products={products}
      isLoading={isLoading}
      isError={isError}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      viewMode="grid"
      columns={4}
    />
  );
}
```

### Performance Considerations
- For lists > 100 items, consider virtualizing with `@tanstack/react-virtual`
- Implement proper React keys using product IDs
- Use `loading="lazy"` for product images
- Optimize image sizes and formats (WebP with fallbacks)
- Debounce filter changes to reduce API calls

---

## Product Image Gallery Requirements (PROD-040 through PROD-045)

### PROD-040: ProductImageGallery - Desktop Hover Zoom
**Requirement:** Implement magnifier lens zoom on hover for desktop users.

**Technical Specification:**
- Component location: `src/react-app/components/ProductImageGallery.tsx`
- Custom hook: `src/react-app/hooks/useHoverZoom.ts`
- Activates on mouse enter (desktop only via `(hover: hover)` media query)
- 2x magnification by default (configurable via `zoomScale` prop)
- Smooth cursor tracking using RequestAnimationFrame
- CSS transform with transform-origin for GPU acceleration
- Hint overlay: "Click to open fullscreen" (fades after 1s)

**Acceptance Criteria:**
- [x] Hover zoom activates on desktop only
- [x] Magnified view follows mouse cursor smoothly
- [x] No zoom on touch devices
- [x] Respects `enableHoverZoom` prop
- [x] Smooth transitions with GPU acceleration
- [x] Accessible to keyboard users (can skip to lightbox)

---

### PROD-041: ProductImageGallery - Mobile Touch Gestures
**Requirement:** Implement horizontal swipe navigation for mobile devices.

**Technical Specification:**
- Custom hook: `src/react-app/hooks/useSwipeGestures.ts`
- Touch event listeners: touchstart, touchmove, touchend
- Minimum threshold: 50px distance OR 0.5px/ms velocity
- Visual feedback: image follows finger during swipe
- Edge resistance at first/last image
- Ignore vertical swipes (>30° angle)
- Prevent page scroll during horizontal swipe

**Acceptance Criteria:**
- [x] Swipe left navigates to next image
- [x] Swipe right navigates to previous image
- [x] Visual feedback during swipe
- [x] Insufficient swipe cancels and bounces back
- [x] Vertical swipes don't trigger navigation
- [x] Respects `enableSwipe` prop

---

### PROD-042: ProductImageGallery - Enhanced Lightbox Zoom
**Requirement:** Implement interactive pan and pinch zoom in fullscreen lightbox.

**Technical Specification:**
- Library: `react-zoom-pan-pinch` v3.6.1
- Desktop: Mouse wheel to zoom, click-drag to pan
- Mobile: Pinch to zoom, drag to pan
- Double-tap/click toggles 2x zoom
- Zoom range: 1x to 4x scale
- Navigation disabled while zoomed (scale > 1)
- Reset button appears when zoomed
- Zoom resets when changing images

**Acceptance Criteria:**
- [x] Mouse wheel zoom works on desktop
- [x] Pinch zoom works on mobile
- [x] Pan/drag when zoomed
- [x] Double-tap toggles zoom
- [x] Reset button when zoomed
- [x] Navigation locked while zoomed
- [x] Smooth zoom transitions

---

### PROD-043: ProductImageGallery - Video Support
**Requirement:** Support mixed image and video media in gallery.

**Technical Specification:**
- Type definitions: `src/react-app/types/media.ts`
- MediaItem interface supports both images and videos
- Video thumbnails show play icon overlay
- Duration badge displays on video thumbnails
- Videos open in lightbox with standard HTML5 controls
- Video preload="metadata" for performance
- VideoObject schema for SEO

**Acceptance Criteria:**
- [x] Mixed image/video galleries work
- [x] Play icon overlay on video thumbnails
- [x] Duration badge displays (e.g., "1:30")
- [x] Videos play in lightbox
- [x] VideoObject schema renders for SEO
- [x] Video controls accessible
- [x] Lazy loading for videos

---

### PROD-044: ProductImageGallery - Image Optimization
**Requirement:** Optimize images with WebP, responsive srcset, and lazy loading.

**Technical Specification:**
- Component: `src/react-app/components/OptimizedImage.tsx`
- Utilities: `src/react-app/utils/imageOptimization.ts`
- Picture element with WebP and JPEG sources
- Responsive srcset: 320w, 640w, 960w, 1280w, 1920w
- Main image: `loading="eager"` (LCP optimization)
- Thumbnails: `loading="lazy"`
- CDN query params: ?w={width}&fm={format}&q={quality}

**Acceptance Criteria:**
- [x] WebP format with JPEG fallback
- [x] Responsive srcset for multiple sizes
- [x] Proper sizes attribute
- [x] Eager loading for main image
- [x] Lazy loading for thumbnails
- [x] CDN optimization parameters

---

### PROD-045: ProductImageGallery - Backward Compatibility
**Requirement:** Support legacy `images: string[]` prop while introducing new `media: MediaItem[]` prop.

**Technical Specification:**
- Accept both prop interfaces
- Convert legacy `images` array to MediaItem[] internally
- All new features work with both prop types
- No breaking changes to existing implementations
- Type-safe conversion using useMemo

**Acceptance Criteria:**
- [x] Legacy `images` prop still works
- [x] New `media` prop supported
- [x] Automatic conversion between formats
- [x] Type safety maintained
- [x] No breaking changes

---

## Implementation Notes

### Performance Metrics

**Before Enhancement:**
- LCP: ~2.5s
- CLS: 0.05
- Bundle size: N/A

**After Enhancement:**
- LCP: ~1.8s (WebP + eager loading)
- CLS: 0 (reserved space + dimensions)
- Bundle increase: +18KB gzipped (react-zoom-pan-pinch + hooks)

### Browser Support
- Modern browsers with ES6+ support
- Touch events for mobile (iOS Safari, Chrome Android)
- Hover media query for desktop detection
- Picture element for WebP support

### Accessibility
- Keyboard navigation throughout
- Screen reader announcements
- ARIA labels on all interactive elements
- Focus management in lightbox
- Respects prefers-reduced-motion

### Future Enhancements
- 360° product view
- AR try-on integration
- YouTube/Vimeo embed support
- Social media video integration
- Shoppable video features

---

## Cart Component Requirements (CART-020 through CART-034)

### CART-020: CartItem Component - Product Display
**Requirement:** Display individual cart items with product thumbnail, name, and variant information.

**Technical Specification:**
- Component location: `src/react-app/components/CartItem.tsx`
- Product thumbnail: 80x80px, rounded corners, links to product detail page
- Product name: Clickable link to product detail page, line-clamp-2 for long names
- Variant display: Size and color shown as compact badges
- Responsive layout: Image left, details center, remove button right
- Support compact mode via prop for different display contexts

**Acceptance Criteria:**
- [x] Product thumbnail renders at 80x80px with proper aspect ratio
- [x] Product name links to `/product/$productId`
- [x] Size variant displays as badge when present
- [x] Color variant displays as badge when present
- [x] Layout adapts to compact mode

---

### CART-021: CartItem Component - Quantity Controls
**Requirement:** Implement quantity adjustment controls with min/max validation.

**Technical Specification:**
- Quantity controls: Plus/minus buttons with numeric input
- Minimum quantity: 1 (decrease button disabled at min)
- Maximum quantity: Configurable via `SHOP_CONFIG.maxQuantityPerItem` (default: 10)
- Manual input: Allows typing quantity directly
- Validation: On blur, clamp to valid range and update cart
- Inventory-aware: Max should respect available inventory (future enhancement)

**Acceptance Criteria:**
- [x] Plus button increases quantity up to max
- [x] Minus button decreases quantity down to 1
- [x] Manual input field accepts numeric values
- [x] Invalid inputs reset to current quantity on blur
- [x] Out-of-range values clamp to valid range
- [ ] Inventory warning displays when exceeding available stock

---

### CART-022: CartItem Component - Price Display
**Requirement:** Show line item pricing with unit price breakdown.

**Technical Specification:**
- Line item total: `quantity × unit price`, displayed prominently
- Unit price: Show "each" price below total when quantity > 1
- Currency formatting: Use `SHOP_CONFIG.currencySymbol` and 2 decimal places
- Real-time updates: Price updates immediately when quantity changes

**Acceptance Criteria:**
- [x] Line item total displays correctly
- [x] Unit price shows when quantity > 1
- [x] Currency symbol and formatting consistent
- [x] Prices update in real-time

---

### CART-023: CartItem Component - Remove Item
**Requirement:** Allow users to remove items from cart with clear visual feedback.

**Technical Specification:**
- Remove button: Trash icon (lucide-react Trash2)
- Position: Right side of cart item row
- Hover state: Red background with red icon
- Confirmation: Optional confirmation dialog for high-value items (future enhancement)
- Callback: `onRemove(productId, size?, color?)` to handle variant-specific removal

**Acceptance Criteria:**
- [x] Remove button displays trash icon
- [x] Hover state provides visual feedback
- [x] Clicking remove calls onRemove callback
- [x] Item removed from cart immediately
- [ ] Optional confirmation dialog for expensive items

---

### CART-024: CartItem Component - Save for Later
**Requirement:** Provide option to move items from cart to wishlist/save for later.

**Technical Specification:**
- UI element: Link or button below quantity controls
- Text: "Save for later" or "Move to wishlist"
- Callback: `onSaveForLater(productId, size?, color?)` optional prop
- Behavior: Removes from cart, adds to wishlist
- Visibility: Only show if `onSaveForLater` callback provided

**Acceptance Criteria:**
- [ ] "Save for later" option displays when callback provided
- [ ] Clicking triggers onSaveForLater callback
- [ ] Item moves to wishlist context
- [ ] Item removed from cart
- [ ] Success feedback shown to user

---

### CART-025: CartItem Component - Inventory Warnings
**Requirement:** Display warnings when requested quantity exceeds available inventory.

**Technical Specification:**
- Warning trigger: When `item.quantity > item.availableInventory`
- Visual indicator: Warning icon and amber/yellow text
- Message: "Only X left in stock" or "Limited availability"
- Auto-adjustment: Option to auto-clamp quantity to available stock
- Real-time updates: Check inventory on quantity change

**Acceptance Criteria:**
- [ ] Warning displays when quantity exceeds inventory
- [ ] Warning message is clear and actionable
- [ ] Visual styling uses warning colors
- [ ] Optional auto-adjustment to available quantity
- [ ] Warning disappears when quantity valid

---

### CART-026: CartItem Component - Props Interface
**Requirement:** Define type-safe props interface for CartItem component.

**Technical Specification:**
```typescript
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  onRemove: (productId: string, size?: string, color?: string) => void;
  onSaveForLater?: (productId: string, size?: string, color?: string) => void;
  compact?: boolean;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  availableInventory?: number; // For inventory warnings
}
```

**Acceptance Criteria:**
- [x] CartItemProps interface defined
- [x] All required props implemented
- [x] Optional props work correctly
- [x] Type safety enforced
- [ ] availableInventory support added

---

### CART-030: CartSummary Component - Subtotal Display
**Requirement:** Calculate and display cart subtotal (sum of all line items before discounts/shipping/tax).

**Technical Specification:**
- Component location: Inline in `CartDrawer.tsx` (lines 139-182) or separate component
- Calculation: Sum of `item.price × item.quantity` for all cart items
- Display: "Subtotal" label with amount right-aligned
- Currency formatting: Consistent with `SHOP_CONFIG`
- Updates: Real-time as cart items change

**Acceptance Criteria:**
- [x] Subtotal calculates correctly
- [x] Label and amount displayed clearly
- [x] Currency formatting consistent
- [x] Updates in real-time

---

### CART-031: CartSummary Component - Discount Display
**Requirement:** Show applied discount code and savings amount.

**Technical Specification:**
- Display conditions: Only show when discount applied
- Information shown:
  - Discount code name (e.g., "SAVE10")
  - Discount amount with minus sign (e.g., "-$10.00")
- Remove option: Small "X" button to remove discount
- Styling: Use green or success color for savings
- Calculation: Based on discount rules (percentage, fixed, minimum requirements)

**Acceptance Criteria:**
- [x] Discount code name displays
- [x] Discount amount shows with negative sign
- [x] Remove button allows clearing discount
- [x] Only displays when discount active
- [x] Styling indicates savings

---

### CART-032: CartSummary Component - Shipping Estimate
**Requirement:** Display shipping cost estimate or "Calculated at checkout" message.

**Technical Specification:**
- Default behavior: "Calculated at checkout" message
- With shipping estimate: Show amount (e.g., "$5.99")
- Free shipping indicator: "$0.00 - Free shipping" when qualified
- Free shipping threshold: Progress bar showing distance to free shipping
- Region-based estimation: Optional prop to pass region-specific rate
- Calculation: Based on `shippingEstimate` prop or threshold logic

**Acceptance Criteria:**
- [ ] "Calculated at checkout" displays by default
- [ ] Shipping estimate shows when provided
- [x] Free shipping message displays when qualified
- [x] Progress bar shows distance to threshold
- [ ] Region-based rates supported via props

---

### CART-033: CartSummary Component - Tax Estimate
**Requirement:** Display estimated tax based on detected or selected region.

**Technical Specification:**
- Default behavior: "Calculated at checkout" message
- With tax estimate: Show amount (e.g., "$8.40")
- Tax calculation: Based on `taxEstimate` prop or region tax rate
- Region detection: Use IP geolocation, user preferences, or shipping address
- Disclaimer: "Estimated" label to indicate preliminary calculation
- Updates: Recalculate when cart total or region changes

**Acceptance Criteria:**
- [ ] "Calculated at checkout" displays by default
- [ ] Tax estimate shows when provided
- [ ] "Estimated" disclaimer included
- [ ] Amount calculates based on region
- [ ] Updates when cart changes

---

### CART-034: CartSummary Component - Grand Total
**Requirement:** Display final cart total including all adjustments.

**Technical Specification:**
- Calculation: `subtotal - discount + shipping + tax`
- Display: Prominent styling (larger font, bold)
- Label: "Total" or "Grand Total"
- Currency formatting: Consistent with shop config
- Visual hierarchy: Most prominent price in summary
- Updates: Real-time as any cart value changes

**Props Interface:**
```typescript
interface CartSummaryProps {
  subtotal: Money | number;
  discount?: AppliedDiscount | number;
  shippingEstimate?: Money | number | 'calculated';
  taxEstimate?: Money | number | 'calculated';
  total: Money | number;
  onContinueShopping?: () => void;
  onCheckout?: () => void;
}

type Money = {
  amount: number;
  currency: string;
};

interface AppliedDiscount {
  code: string;
  amount: number;
  description?: string;
}
```

**Acceptance Criteria:**
- [x] Grand total displays prominently
- [x] Calculation includes all components
- [x] Visual styling emphasizes importance
- [x] Updates in real-time
- [ ] Props interface supports all display options

---

## Cart Component Implementation Notes

### Current Status (as of PR #12 - CCB-1090)

**Completed Components:**
- ✅ CartDrawer: Full-featured slide-out cart with animations, focus management
- ✅ CartItem: Product display, quantity controls, remove functionality
- ✅ CartSummary: Subtotal, discount, total (embedded in CartDrawer)
- ✅ ProductRecommendations: Cross-sell carousel
- ✅ FreeShippingProgress: Progress bar to free shipping threshold
- ✅ DiscountCodeInput: Apply/remove discount codes with validation

**Outstanding Features:**
- ❌ Save for later / Move to wishlist (CART-024)
- ❌ Inventory warnings (CART-025)
- ❌ Shipping estimate display (CART-032)
- ❌ Tax estimate display (CART-033)
- ❌ Separate CartSummary component extraction (optional refactor)

### Related Components

**Dependencies:**
- CartContext (`src/react-app/context/CartContext.tsx`): Global cart state management
- cartService (`src/react-app/services/cartService.ts`): Cart persistence layer
- mockDiscounts (`src/react-app/data/mockDiscounts.ts`): Discount code validation
- mockRecommendations (`src/react-app/data/mockRecommendations.ts`): Product recommendations
- shopConfig (`src/react-app/config/shopConfig.ts`): Shop-wide constants

**Type Definitions:**
- `src/react-app/types/index.ts`: CartItem, Product, AppliedDiscount interfaces

### Testing Coverage

**Existing Tests:**
- CartDrawer.test.tsx: Comprehensive tests for drawer, empty state, discounts, free shipping
- CartItem.test.tsx: Tests for rendering, quantity controls, validation, removal
- cartService.test.ts: Service layer CRUD operations, validation, storage

**Test Coverage Needs:**
- Save for later functionality
- Inventory warning display
- Tax/shipping estimate display
- Edge cases for new props

### Future Enhancements

- [ ] Persistent wishlist/saved items
- [ ] Real-time inventory sync
- [ ] Multi-currency support
- [ ] Gift wrapping options
- [ ] Promo code suggestions
- [ ] Cart abandonment recovery
- [ ] Bundle/package deals
- [ ] Subscription items in cart