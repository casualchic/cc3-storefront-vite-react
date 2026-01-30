# CartDrawer Component Documentation

## Overview

The CartDrawer is a slide-out panel that provides quick access to cart contents, discount codes, free shipping progress, and checkout functionality. It automatically opens when items are added to the cart and serves as the primary shopping cart interface for the Casual Chic Boutique storefront.

## Components

### CartDrawer

Main drawer component that displays cart contents and checkout options.

**Location:** `src/react-app/components/CartDrawer.tsx`

**Props:**
- `isOpen: boolean` - Controls drawer visibility
- `onClose: () => void` - Callback when drawer should close

**Features:**
- Auto-opens when items added to cart
- Slide-in animation (right on desktop, bottom on mobile)
- Backdrop with click-outside-to-close
- Escape key closes drawer
- Body scroll lock when open
- Focus trap for accessibility
- Empty state with call-to-action
- Item count display in header

**Animations:**
- Desktop: Slides in from right with `animate-slide-in` class
- Mobile: Slides up from bottom with `animate-slide-up` class
- Backdrop: Fades in with `animate-fade-in` class
- All animations respect `prefers-reduced-motion` system preference

**Dimensions:**
- Desktop: 420px wide, full height, positioned on right edge
- Mobile: Full width, 90% height, positioned at bottom with rounded top corners

### CartItem

Reusable component for displaying individual cart items with quantity controls.

**Location:** `src/react-app/components/CartItem.tsx`

**Props:**
- `item: CartItem` - Cart item data
- `onUpdateQuantity: (productId: string, quantity: number) => void` - Quantity change handler
- `onRemove: (productId: string) => void` - Remove item handler
- `compact?: boolean` - Optional compact display mode (default: false)

**Features:**
- Product image (80x80px, rounded)
- Product name with link to product page
- Size and color badges (if applicable)
- Quantity controls with +/- buttons
- Numeric input with manual entry and validation
- Min quantity: 1, Max quantity: configurable (default 10)
- Price display (unit price if quantity > 1, total price)
- Remove button with trash icon and hover effect
- Link to product detail page

**Quantity Control Behavior:**
- Decrease button disabled when quantity = 1
- Increase button disabled when quantity = max
- Manual input validates on blur
- Invalid input resets to current quantity
- Input exceeding max caps at max quantity

### ProductRecommendations

Displays cross-sell product recommendations in horizontal carousel.

**Location:** `src/react-app/components/ProductRecommendations.tsx`

**Props:**
- `products: Product[]` - Array of recommended products

**Features:**
- Horizontal scroll carousel
- Product images (144x144px)
- Product name with link (truncated to 2 lines)
- Price display
- Quick add to cart button
- Links to product pages
- Auto-hides when no recommendations available
- Optimized for mobile touch scrolling

**Recommendation Logic:**
- Based on items currently in cart
- Excludes products already in cart
- Aggregates recommendations from all cart items
- Deduplicates suggested products
- Limits to 8 recommendations by default

## Internal Components

### FreeShippingProgress

Displays progress toward free shipping threshold.

**Props:**
- `subtotal: number` - Current cart subtotal

**States:**
- **Below Threshold:** Shows amount needed and progress bar
  - Orange progress bar with animated width transition
  - "Add $X.XX more for FREE shipping!"
- **Threshold Met:** Shows success message
  - Green checkmark and celebration emoji
  - "You qualify for FREE shipping!"

**Styling:**
- Progress bar: Gray background, orange fill
- Height: 8px (h-2)
- Smooth transition on progress changes (duration-300)

### DiscountCodeInput

Handles discount code entry and display.

**Props:**
- `appliedDiscount: AppliedDiscount | null` - Currently applied discount
- `onApply: (code: string) => { success: boolean; error?: string }` - Apply callback
- `onRemove: () => void` - Remove callback

**States:**
- **No Discount Applied:** Input field with apply button
  - Enter key submits code
  - Apply button disabled when input empty
  - Shows error message for invalid codes
- **Discount Applied:** Success display with remove button
  - Green background with discount details
  - Discount code in uppercase
  - Description text
  - Discount amount
  - X button to remove

**Validation:**
- Trims whitespace
- Case-insensitive matching
- Validates against mock discount database
- Shows specific error messages

### CartSummary

Displays cart totals and checkout controls.

**Props:**
- `subtotal: number` - Cart subtotal before discount
- `discount: number` - Applied discount amount
- `total: number` - Final total after discount
- `onContinueShopping: () => void` - Continue shopping callback

**Display:**
- Subtotal (gray text)
- Discount (green text, only if applied)
- Divider line
- Total (bold, large text)
- Proceed to Checkout button (black, full width, links to /checkout)
- Continue Shopping link (gray, text link)

## State Management

### CartContext Extensions

The CartContext was enhanced with drawer and discount state:

```typescript
interface CartContextType {
  // Existing cart methods
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;  // Alias for addToCart
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;

  // Drawer state
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;

  // Discount state
  appliedDiscount: AppliedDiscount | null;
  applyDiscount: (code: string) => { success: boolean; error?: string };
  removeDiscount: () => void;
}
```

**AppliedDiscount Interface:**
```typescript
interface AppliedDiscount {
  code: string;          // Uppercase discount code
  amount: number;        // Dollar amount of discount
  description: string;   // Human-readable description
}
```

## Configuration

### Shop Config

**File:** `src/react-app/config/shopConfig.ts`

```typescript
export const SHOP_CONFIG = {
  freeShippingThreshold: 75,    // Dollar amount for free shipping
  currency: 'USD',              // Currency code
  currencySymbol: '$',          // Currency symbol for display
  maxQuantityPerItem: 10,       // Maximum quantity per cart item
};
```

### Mock Discount Codes

**File:** `src/react-app/data/mockDiscounts.ts`

Available test codes:
- `SAVE10` - 10% off your order (no minimum)
- `WELCOME20` - 20% off for new customers (minimum $50 purchase)
- `FLASH15` - 15% off flash sale (max $30 discount)

**DiscountCode Interface:**
```typescript
interface DiscountCode {
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;    // Optional minimum purchase requirement
  maxDiscount?: number;    // Optional maximum discount cap
  active: boolean;
}
```

**Functions:**
- `validateDiscountCode(code: string): DiscountValidationResult` - Validates code
- `calculateDiscount(discount: DiscountCode, subtotal: number): number` - Calculates amount
- `getDiscountByCode(code: string): DiscountCode | undefined` - Retrieves discount

### Product Recommendations

**File:** `src/react-app/data/mockRecommendations.ts`

Contains mapping of product IDs to recommended product IDs for cross-sell functionality.

**Functions:**
- `getRecommendations(cartItems: CartItem[], limit?: number): string[]` - Get recommendations based on cart
- `getRecommendationsForProduct(productId: string): string[]` - Get recommendations for single product

**Recommendation Logic:**
1. Aggregate recommendations from all cart items
2. Deduplicate suggestions
3. Exclude items already in cart
4. Limit to specified count (default 8)

## Usage

### Basic Integration

The CartDrawer is integrated with the Header component:

```typescript
import { CartDrawer } from '../components/CartDrawer';
import { useCart } from '../context/CartContext';

export function Header() {
  const { isDrawerOpen, closeDrawer } = useCart();

  return (
    <>
      <header>
        {/* Header content with cart icon */}
      </header>
      <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
}
```

### Opening the Drawer

The drawer automatically opens when items are added via `addToCart()`:

```typescript
const { addToCart } = useCart();

// Automatically opens drawer
addToCart({
  productId: 'prod-123',
  name: 'Summer Dress',
  price: 49.99,
  image: '/images/dress.jpg',
  quantity: 1,
  size: 'M',
  color: 'Blue',
});
```

Or open it manually:

```typescript
const { openDrawer } = useCart();

<button onClick={openDrawer}>View Cart</button>
```

### Managing Cart Items

```typescript
const { updateQuantity, removeFromCart } = useCart();

// Update quantity for specific variant
updateQuantity('prod-123', 2, 'M', 'Blue');

// Remove item with specific variant
removeFromCart('prod-123', 'M', 'Blue');
```

### Applying Discounts

```typescript
const { applyDiscount, removeDiscount, appliedDiscount } = useCart();

// Apply discount code
const result = applyDiscount('SAVE10');
if (result.success) {
  console.log('Discount applied!');
} else {
  console.error(result.error);
}

// Remove discount
removeDiscount();

// Check current discount
if (appliedDiscount) {
  console.log(`Discount: ${appliedDiscount.code}, Amount: $${appliedDiscount.amount}`);
}
```

## Features

### Free Shipping Progress

Displays progress toward free shipping threshold configured in `SHOP_CONFIG`:
- Shows amount needed when under threshold
- Shows success message when qualified
- Animated progress bar with smooth transitions
- Orange color scheme for urgency
- Green success state
- Configurable threshold in `SHOP_CONFIG.freeShippingThreshold`

### Discount Codes

- Input field with apply button
- Enter key submits code
- Validates against mock discount codes
- Shows error for invalid codes
- Displays applied discount with description
- Shows discount amount in cart summary
- Remove button to clear discount
- Only one discount at a time
- Case-insensitive code matching
- Uppercase display of applied code

### Cross-Sell Recommendations

- Shows "You might also like" products
- Based on items currently in cart
- Quick add functionality (adds to cart without leaving drawer)
- Horizontal scroll carousel optimized for mobile
- Links to product pages for more details
- Auto-hides when no recommendations
- Excludes products already in cart

### Cart Summary

- Subtotal calculation (sum of all items)
- Discount amount (if applied, shown in green)
- Total calculation (subtotal minus discount)
- Proceed to Checkout button (links to /checkout page)
- Continue Shopping link (closes drawer)
- Currency formatting from `SHOP_CONFIG`

## Accessibility

### Focus Management
- **Focus Trap:** Keyboard focus stays within drawer when open using `focus-trap-react`
- **Initial Focus:** No forced initial focus, allows natural tab order
- **Focus Return:** Focus returns to triggering element on close
- **Allow Outside Click:** Backdrop click closes drawer without breaking focus trap

### ARIA Attributes
- `role="dialog"` - Identifies drawer as dialog
- `aria-modal="true"` - Indicates modal behavior
- `aria-labelledby` - References drawer title
- `aria-label` - Labels interactive elements (close button, quantity controls)
- `aria-hidden="true"` - Hides backdrop from screen readers

### Keyboard Navigation
- **Tab:** Move through all interactive elements
- **Shift+Tab:** Move backward through elements
- **Escape:** Closes drawer
- **Enter:** Submits discount code (when focused on input)
- **+/- Buttons:** Adjust quantity with keyboard

### Screen Readers
- Announces cart updates
- Reads product names and prices
- Announces quantity changes
- Reads discount application results
- Provides context for all controls

### Visual Indicators
- Clear focus indicators on all buttons
- Hover states for interactive elements
- Disabled states for unavailable actions
- Color coding (green for success, red for errors, orange for progress)

### Motion Preferences
- Respects `prefers-reduced-motion` system setting
- Smooth animations by default
- Reduced or no animation for users who prefer it

## Mobile Behavior

### Responsive Design
- **Desktop (≥768px):** Slides from right, 420px wide, full height
- **Mobile (<768px):** Slides from bottom, full width, 90vh height

### Mobile-Specific Features
- Rounded top corners on mobile (rounded-t-2xl)
- Touch-friendly button sizes
- Horizontal scroll for recommendations with touch support
- Swipe-friendly carousel
- Optimized spacing for touch targets
- Full-width layout maximizes screen usage

### Touch Gestures
- Tap backdrop to close
- Swipe recommendations carousel
- Tap quantity controls
- Natural mobile form inputs

## Testing

### Test Files
- `src/react-app/components/CartDrawer.test.tsx`
- `src/react-app/components/CartItem.test.tsx`
- `src/react-app/components/ProductRecommendations.test.tsx`

### Running Tests

```bash
npm test CartDrawer
npm test CartItem
npm test ProductRecommendations

# Or run all tests
npm test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui
```

### Test Coverage

**CartDrawer:**
- Renders empty state when cart is empty
- Displays cart items when present
- Shows free shipping progress
- Handles discount code application
- Displays product recommendations
- Cart summary calculation
- Opens and closes correctly
- Focus trap behavior
- Escape key closes drawer
- Backdrop click closes drawer
- Body scroll lock

**CartItem:**
- Renders item details correctly
- Quantity controls work
- Manual quantity input validation
- Remove button functionality
- Link to product page
- Price calculation
- Size and color badges
- Compact mode

**ProductRecommendations:**
- Renders recommended products
- Quick add to cart functionality
- Links to product pages
- Horizontal scroll behavior
- Hides when no recommendations

## Future Enhancements

### High Priority
1. **Medusa.js Integration**
   - Replace mock discount codes with Medusa discount API
   - Integrate with Medusa cart sessions
   - Real-time inventory checks
   - Server-side discount validation

2. **Enhanced Discount System**
   - Multiple discount types (BOGO, free shipping, free gifts)
   - Stackable discounts
   - Tiered discounts based on cart value
   - Time-limited flash sales
   - User-specific discounts

3. **Product Recommendation Engine**
   - ML-based recommendations
   - Recently viewed products
   - Frequently bought together
   - Personalized suggestions based on browsing history

### Medium Priority
1. **Saved for Later**
   - Move items to wishlist from cart
   - Temporary save without checkout
   - Easy restore to cart

2. **Gift Options**
   - Gift wrapping selection
   - Gift message input
   - Gift receipt option

3. **Cart Sharing**
   - Generate shareable cart link
   - Social sharing integration
   - Email cart to friend

### Low Priority
1. **Advanced Features**
   - Cart expiration warnings for limited stock
   - Price drop notifications
   - Back in stock alerts
   - Bundle discounts
   - Subscription options

2. **Analytics**
   - Cart abandonment tracking
   - Conversion funnel metrics
   - A/B testing for drawer behavior
   - Recommendation effectiveness tracking

## Service Layer Architecture

### Cart Service Abstraction

**File:** `src/react-app/services/cartService.ts`

The cart service abstraction prepares for Medusa integration:

```typescript
interface CartService {
  getCart(): CartItem[];
  saveCart(cart: CartItem[]): void;
  addItem(item: CartItem): void;
  updateQuantity(productId: string, quantity: number, size?: string, color?: string): boolean;
  removeItem(productId: string, size?: string, color?: string): void;
  clearCart(): void;
}
```

**Current Implementation:**
- `LocalStorageCartService` - Uses browser localStorage
- Simple key-value storage
- JSON serialization
- Synchronous operations

**Future Implementation:**
- `MedusaCartService` - Integrates with Medusa.js backend
- Server-side cart sessions
- Real-time inventory validation
- Multi-device cart sync
- Guest cart conversion on login

**Migration Path:**
1. Implement `MedusaCartService` with same interface
2. Update `CartProvider` to use Medusa service
3. Add loading states for async operations
4. Implement error handling for network failures
5. Add optimistic UI updates with rollback

## Technical Implementation Details

### Performance Optimizations

**useMemo for Expensive Calculations:**
- Item count calculation
- Recommended product IDs
- Recommended products mapping

**Conditional Rendering:**
- Empty state vs. items list
- Discount display only when applied
- Recommendations only when available

**Event Handler Optimization:**
- Debounced quantity input
- Memoized callbacks to prevent re-renders

### Side Effects Management

**Body Scroll Lock:**
```typescript
useEffect(() => {
  if (isOpen) {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }
}, [isOpen]);
```

**Escape Key Handler:**
```typescript
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  };
  if (isOpen) {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }
}, [isOpen, onClose]);
```

### CSS Classes and Animations

**Custom Tailwind Animations:**
- `animate-slide-in` - Slide from right (desktop)
- `animate-slide-up` - Slide from bottom (mobile)
- `animate-fade-in` - Backdrop fade

**Responsive Classes:**
- `md:` prefix for desktop-specific styles
- Mobile-first approach
- Breakpoint: 768px (md)

## Troubleshooting

### Common Issues

**Drawer doesn't open when adding to cart:**
- Verify `CartProvider` wraps the application
- Check that `addToCart` is called correctly
- Ensure `isDrawerOpen` state is properly managed

**Discount code not applying:**
- Check code matches exactly (case-insensitive)
- Verify discount is active in `mockDiscounts.ts`
- Check minimum purchase requirements
- Ensure no other discount is already applied

**Recommendations not showing:**
- Verify cart has items
- Check `RECOMMENDATION_MAP` has entries for cart items
- Ensure recommended products exist
- Check that recommendations aren't already in cart

**Focus trap issues:**
- Verify `focus-trap-react` is installed
- Check that drawer has focusable elements
- Ensure `active` prop is synchronized with `isOpen`

**Scroll not locking:**
- Check body overflow style is being set
- Verify effect cleanup is running
- Test in different browsers

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2015+ features required
- CSS Grid and Flexbox for layouts
- CSS custom properties for theming
- LocalStorage API for persistence
- Keyboard event handling
- Touch events for mobile

## Dependencies

- `@tanstack/react-router` - Routing and navigation
- `lucide-react` - Icon components
- `focus-trap-react` - Accessibility focus management
- React 18+ - Component framework
- TypeScript - Type safety

## Related Documentation

- `IMPLEMENTATION_DOCUMENTATION.md` - Overall project documentation
- `docs/ProductCard.md` - Product card component
- `docs/ProductGrid.md` - Product grid component
- Linear Issue CCB-1090 - CartDrawer implementation ticket

---

**Last Updated:** January 30, 2026
**Version:** 1.0.0
**Author:** Development Team
**Linear Issue:** CCB-1090
