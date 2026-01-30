# CartDrawer Component Design

**Date:** 2026-01-30
**Linear Issue:** CCB-1090
**Status:** Design Complete - Ready for Implementation

## Overview

Build a slide-out CartDrawer component that provides quick cart access and management without leaving the current page. The drawer opens automatically when items are added to cart and offers a streamlined path to checkout.

## Design Decisions

### Opening Mechanism
**Decision:** Smart Hybrid Approach
The cart icon in the header opens the drawer instead of navigating to `/cart`. The drawer includes a "View Full Cart" link for users who want the detailed cart page experience. This provides instant feedback while maintaining access to the full cart page.

### Component Reusability
**Decision:** Shared CartItem Component
Create a reusable `<CartItem>` component used in both the drawer and cart page. This ensures visual consistency and reduces code duplication.

### Backend Integration
**Decision:** Deferred Medusa Integration
Implement with localStorage now using a service layer pattern. The abstraction makes swapping to Medusa.js cart APIs straightforward when ready. Service layer isolates all data access logic from UI components.

### Configuration
**Decision:** Dynamic Configuration
Use configuration files for thresholds and settings (free shipping, currency, etc.) rather than hardcoding values. This allows easy updates without code changes.

### Discount Codes
**Decision:** Mock Validation for Now
Implement mock discount code validation with hardcoded test codes. This validates the UI flow and makes real backend integration easier later.

### Cross-Sell Recommendations
**Decision:** Mock Related Products
Create a simple mock mapping of products to related products. This demonstrates the feature realistically without requiring a recommendation engine.

### Auto-Open Behavior
**Decision:** Always Auto-Open
Drawer slides in automatically whenever items are added to cart from anywhere in the app. This provides immediate visual confirmation and encourages checkout.

## Architecture

### Component Structure

```
src/react-app/
├── components/
│   ├── CartDrawer.tsx          # Main drawer component
│   ├── CartDrawer.test.tsx     # Component tests
│   ├── CartItem.tsx            # Reusable cart item display
│   └── CartItem.test.tsx       # CartItem tests
├── context/
│   └── CartContext.tsx         # Enhanced with drawer state
├── services/
│   └── cartService.ts          # Abstract cart operations (localStorage → Medusa)
├── config/
│   └── shopConfig.ts           # Free shipping threshold, currency
├── data/
│   ├── mockDiscounts.ts        # Mock discount codes
│   └── mockRecommendations.ts  # Mock product relationships
└── hooks/
    └── useCartDrawer.ts        # Optional: drawer-specific logic
```

### State Management

**CartContext Enhancements:**
- `isDrawerOpen: boolean` - Drawer visibility state
- `openDrawer(): void` - Open drawer programmatically
- `closeDrawer(): void` - Close drawer
- `appliedDiscount: AppliedDiscount | null` - Current discount
- `applyDiscount(code: string): Promise<void>` - Apply discount code
- `removeDiscount(): void` - Remove current discount

**Service Layer Pattern:**
```typescript
// cartService.ts - abstracts data source
interface CartService {
  getCart(): Promise<CartItem[]>;
  addItem(item: CartItem): Promise<void>;
  updateQuantity(id: string, quantity: number): Promise<void>;
  removeItem(id: string): Promise<void>;
  applyDiscount(code: string): Promise<Discount>;
}

// Implementation: LocalStorageCartService (now)
// Future: MedusaCartService (later)
```

This pattern means components import `cartService` not `localStorage`, making the swap transparent to UI code.

## UI Layout

### Drawer Structure

**Dimensions:**
- Desktop: 420px width × 100vh height
- Mobile: 100vw width × 90vh height (slides from bottom)
- Z-index: 1000 (above main content, below potential modals)

**Layout Sections (top to bottom):**

1. **Header (fixed)**
   - "Shopping Cart" title with item count badge
   - Close button (X icon, lucide-react)
   - Bottom border divider

2. **Main Content (scrollable)**
   - **Empty State:**
     - Shopping bag icon (lucide-react)
     - "Your cart is empty" heading
     - "Continue Shopping" button → closes drawer

   - **Cart Items List:**
     - Scrollable container with 16px gap
     - CartItem components
     - Add/remove animations (slide + fade)

3. **Footer (fixed)**
   - Free shipping progress bar
   - Discount code input + apply/remove
   - Subtotal display (large, bold)
   - Discount amount (if applied, green)
   - Total (with discount applied)
   - "Proceed to Checkout" button (primary, links to `/checkout`)
   - "Continue Shopping" link (secondary, closes drawer)
   - Cross-sell recommendations carousel

**Overlay Backdrop:**
- 50% opacity black (#000000 with opacity 0.5)
- Optional: backdrop-filter: blur(4px) for modern browsers
- Click to close drawer

## CartItem Component

### Visual Layout
```
┌─────────────────────────────────────────────────────┐
│ [Image]  │  Product Name                     $49.99 │
│  80x80   │  Size: M, Color: Blue                    │
│          │  [−] [2] [+]  [Remove]                   │
└─────────────────────────────────────────────────────┘
```

### Props Interface
```typescript
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  compact?: boolean;  // For future variants
}
```

### Features
- **Image:** 80×80px, optimized, clickable link to product page
- **Product Info:** Name (max 2 lines, ellipsis), size/color badges
- **Price:** Current price, original price if on sale (strikethrough)
- **Quantity Controls:**
  - Minus button (disabled at qty 1, removes at 0)
  - Number input (editable, min: 1, max: 10)
  - Plus button (disabled at max, shows tooltip)
- **Remove Button:** Trash icon, immediate removal (no confirmation)
- **Optimistic Updates:** UI updates immediately, reverts on error
- **Loading States:** Subtle spinner during updates

### Animations
- **Add item:** Slide right + fade in (200ms)
- **Remove item:** Slide left + fade out (200ms)
- **Quantity change:** Price pulses briefly (150ms)

## Animations & Interactions

### Drawer Animations

**Opening:**
```css
transform: translateX(100%) → translateX(0)
duration: 300ms
easing: cubic-bezier(0.4, 0, 0.2, 1) /* ease-out */
backdrop opacity: 0 → 0.5 (200ms)
```

**Closing:**
- Reverse animation (slide right, fade out)
- Triggered by: close button, backdrop click, Escape key

**Mobile Specific:**
- Slides up from bottom instead of right
- Drag-down gesture to close (threshold: 100px swipe)
- Rounded top corners (16px border radius)

### Interactive Behaviors

**Auto-Open on Add to Cart:**
- Triggers when `addToCart()` called from anywhere
- If already open, new item highlights with pulse animation
- Mobile: Optional haptic feedback

**Scrolling:**
- Header and footer are sticky/fixed
- Only middle section scrolls
- Header shows shadow when scrolled (visual feedback)
- Auto-scroll to newly added item

**Focus Management:**
- Focus trap: Tab cycles within drawer
- On open: Focus moves to close button
- On close: Focus returns to trigger (cart icon)
- Escape key closes drawer

**Backdrop:**
- Click outside closes drawer
- Prevents body scroll when open (`overflow: hidden` on body)
- Semi-transparent with blur effect

## Feature Specifications

### Free Shipping Progress Bar

**Configuration** (`shopConfig.ts`):
```typescript
export const SHOP_CONFIG = {
  freeShippingThreshold: 75,
  currency: 'USD',
  currencySymbol: '$'
};
```

**Display States:**
- **Under threshold:** "Add $X more for FREE shipping!" (orange/accent)
- **Threshold met:** "You qualify for FREE shipping! 🎉" (green)
- Animated progress bar (width percentage-based)
- Positioned above subtotal in footer

**Calculation:**
```typescript
const amountToFreeShipping = Math.max(
  0,
  SHOP_CONFIG.freeShippingThreshold - subtotal
);
const progress = Math.min(100, (subtotal / threshold) * 100);
```

### Discount Code Feature

**Mock Discount Codes** (`mockDiscounts.ts`):
```typescript
export const MOCK_DISCOUNTS: Record<string, DiscountCode> = {
  'SAVE10': { type: 'percentage', value: 10, description: '10% off' },
  'WELCOME20': { type: 'percentage', value: 20, description: '20% off' },
  'FLASH15': { type: 'percentage', value: 15, description: '15% off' }
};

interface DiscountCode {
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
}
```

**UI States:**
- **Empty:** Input with placeholder "Enter discount code"
- **Applied:** Code badge + discount amount, "Remove" button
- **Invalid:** Red error message "Invalid discount code"
- **Success:** Green checkmark, discount reflected in total

**Behavior:**
- Only one discount code at a time
- Applying new code removes previous
- Discount applied to subtotal
- Validates against mock codes (case-insensitive)

### Cross-Sell Recommendations

**Mock Data** (`mockRecommendations.ts`):
```typescript
export const PRODUCT_RECOMMENDATIONS: Record<string, string[]> = {
  'prod-1': ['prod-5', 'prod-8', 'prod-12'],
  'prod-2': ['prod-6', 'prod-9', 'prod-13'],
  // Map cart product IDs to recommended product IDs
};
```

**Display:**
- "You might also like" heading
- Horizontal scrollable carousel
- 3-4 products visible at once
- Mini product cards: image, name, price, quick-add button
- Only shows when cart has items
- Positioned above checkout button

**Logic:**
- Aggregate recommendations from all cart items
- Deduplicate and limit to 8 recommendations
- Exclude products already in cart
- Fallback to featured products if no recommendations

## Accessibility

### Focus Management
- **Focus Trap:** Use `focus-trap-react` or custom implementation
- **Tab Order:** Close → Items → Discount → Checkout
- **Focus Return:** Returns to cart icon on close
- **Skip Link:** Hidden "Skip to checkout" for screen readers

### ARIA Attributes
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="cart-drawer-title"
  aria-describedby="cart-drawer-description"
>
  <h2 id="cart-drawer-title">Shopping Cart</h2>
  <div id="cart-drawer-description">
    Review your items and proceed to checkout
  </div>
</div>
```

### Screen Reader Announcements
- Live region (`aria-live="polite"`) for cart updates
- "Item added to cart" / "2 items in cart"
- "Quantity updated to 3"
- "10% discount applied"
- Error announcements (`aria-live="assertive"`)

### Keyboard Navigation
- All interactive elements keyboard accessible
- Visible focus indicators (2px outline, accent color)
- Logical tab order
- Escape closes drawer
- Enter on cart icon opens drawer

## Error Handling

### Network Errors (Future Medusa Integration)
- Optimistic updates revert on failure
- Toast notification: "Failed to update cart. Please try again."
- Retry button in error message
- Error boundaries catch React errors

### Validation Errors
- Invalid discount code: Inline error below input
- Quantity limits: Disable buttons, show tooltip
- Out of stock: Gray out item, "Out of stock" badge

### State Recovery
- Cart persists in localStorage (survives refresh)
- Drawer state doesn't persist (always starts closed)
- Graceful degradation if localStorage unavailable
- Error fallback UI for missing data

### Loading States
- Initial load: Skeleton loaders for cart items
- Updates: Subtle spinner on affected controls
- Disabled state for buttons during actions
- Non-blocking (users can still browse)

## TypeScript Interfaces

```typescript
// CartDrawer Component
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// CartItem Component
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  compact?: boolean;
}

// Discount Types
interface DiscountCode {
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
}

interface AppliedDiscount {
  code: string;
  amount: number;
  description: string;
}

// Cart Summary
interface CartSummary {
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
}

// Configuration
interface ShopConfig {
  freeShippingThreshold: number;
  currency: string;
  currencySymbol: string;
}

// Product Recommendation
interface ProductRecommendation {
  id: string;
  name: string;
  price: number;
  image: string;
}
```

## Testing Strategy

### Unit Tests
**CartDrawer.test.tsx:**
- ✓ Drawer opens/closes correctly
- ✓ Auto-opens when item added to cart
- ✓ Backdrop click closes drawer
- ✓ Escape key closes drawer
- ✓ Empty state displays when cart is empty
- ✓ Cart items render with correct data
- ✓ Free shipping progress calculates correctly
- ✓ Subtotal and total calculate correctly
- ✓ Cross-sell recommendations display

**CartItem.test.tsx:**
- ✓ Quantity controls update cart
- ✓ Remove button deletes item
- ✓ Plus button disabled at max quantity
- ✓ Minus button disabled at quantity 1
- ✓ Price displays correctly (with/without discount)
- ✓ Size and color badges display
- ✓ Image links to product page

**Discount Tests:**
- ✓ Valid codes apply discounts
- ✓ Invalid codes show error
- ✓ Only one code at a time
- ✓ Remove button clears discount

### Integration Tests
- ✓ CartContext integration
- ✓ Add to cart flow (product page → drawer opens)
- ✓ Checkout navigation works
- ✓ Focus trap behavior
- ✓ Body scroll lock when open

### Accessibility Tests
- ✓ axe-core automated checks pass
- ✓ Keyboard navigation works throughout
- ✓ Screen reader announcements (jest-dom)
- ✓ Focus management on open/close
- ✓ ARIA attributes correct

### Visual Regression Tests (Optional)
- Drawer open/closed states
- Mobile vs desktop layouts
- Animation snapshots

## Future Enhancements (Linear Follow-Up Issues)

### Enhanced Discount Types
**Issue:** Advanced Promotion System
- Free gift with purchase
- Tiered buy-more-save-more discounts
- Bundle discounts
- Category-specific promotions

**Rationale:** These require proper backend integration with Medusa's promotion engine. Mock implementation would be too complex and not representative of production behavior.

### Medusa.js Backend Integration
**Issue:** Connect CartDrawer to Medusa.js Cart API
- Replace localStorage with Medusa cart endpoints
- Implement cart session management
- Add Durable Objects for real-time cart sync
- Handle cart merging (guest → authenticated)
- Add proper error handling and retry logic

**Migration Path:**
1. Implement `MedusaCartService` extending `CartService` interface
2. Swap service in CartContext
3. Update CartContext to use cart session tokens
4. Add optimistic updates with server reconciliation
5. Test thoroughly with backend

### Additional Features
- **Saved for Later:** Move items to wishlist from cart
- **Recently Viewed:** Show recently viewed products in drawer
- **Gift Wrapping:** Add gift wrapping option
- **Gift Message:** Include personalized message
- **Estimated Delivery:** Show delivery date estimates
- **Stock Warnings:** Real-time low stock alerts
- **Price Alerts:** Notify if prices changed since adding

## Implementation Checklist

### Phase 1: Core Structure
- [ ] Create CartDrawer component shell
- [ ] Create CartItem component
- [ ] Implement drawer open/close animations
- [ ] Add backdrop and click-outside-to-close
- [ ] Implement Escape key handler
- [ ] Add focus trap

### Phase 2: Cart Display
- [ ] Render cart items list
- [ ] Implement empty state
- [ ] Add quantity controls to CartItem
- [ ] Add remove button to CartItem
- [ ] Implement item add/remove animations
- [ ] Calculate and display subtotal

### Phase 3: Features
- [ ] Add free shipping progress bar
- [ ] Implement discount code input and validation
- [ ] Create mock discount data
- [ ] Add cross-sell recommendations
- [ ] Create mock recommendations data
- [ ] Implement recommendations carousel

### Phase 4: Integration
- [ ] Enhance CartContext with drawer state
- [ ] Implement auto-open on add to cart
- [ ] Create shop configuration file
- [ ] Add cart service abstraction layer
- [ ] Update Header to open drawer instead of navigate

### Phase 5: Polish
- [ ] Add loading states
- [ ] Implement error handling
- [ ] Add accessibility features
- [ ] Mobile responsive adjustments
- [ ] Add keyboard navigation
- [ ] Screen reader testing

### Phase 6: Testing
- [ ] Write unit tests for CartDrawer
- [ ] Write unit tests for CartItem
- [ ] Write integration tests
- [ ] Run accessibility audit
- [ ] Manual testing (keyboard, screen reader)

### Phase 7: Documentation
- [ ] Component usage documentation
- [ ] Update IMPLEMENTATION_DOCUMENTATION.md
- [ ] Add inline code comments
- [ ] Create Storybook stories (optional)

## Success Criteria

The implementation is complete when:
- ✓ Drawer slides in/out smoothly with correct animations
- ✓ Auto-opens when items added to cart
- ✓ All cart operations work (add, remove, update quantity)
- ✓ Free shipping progress bar displays and updates
- ✓ Discount codes validate and apply correctly
- ✓ Cross-sell recommendations display
- ✓ Empty state displays when cart is empty
- ✓ Accessibility audit passes (axe-core)
- ✓ Keyboard navigation works completely
- ✓ Mobile responsive and touch-friendly
- ✓ All tests pass (unit, integration, accessibility)
- ✓ Code follows project patterns and style guide

## Notes

- Service layer pattern ensures easy Medusa migration
- Mock discount codes are case-insensitive
- Free shipping threshold configurable in one place
- CartItem component reusable across drawer and cart page
- Focus trap prevents keyboard users from tabbing outside drawer
- Body scroll lock prevents background scrolling
- Optimistic updates provide instant feedback
- All animations respect `prefers-reduced-motion`
