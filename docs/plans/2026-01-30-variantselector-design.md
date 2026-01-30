# VariantSelector Component - Design Document

**Date:** 2026-01-30
**Linear Issue:** CCB-1089
**Status:** Approved for Implementation

## Overview

The VariantSelector component enables users to select product variants (size, color, material, etc.) with real-time availability checking, stock indicators, and price updates. The component supports both the existing simple product format and the full Medusa.js structure for seamless migration.

## Business Requirements

### Core Functionality
- Size selection via buttons or dropdown
- Color selection via circular swatches with hex colors
- Visual indication for out-of-stock variants (strike-through/grayed)
- Low stock warning: "Only X left" for low inventory items
- Main image updates when color variant selected
- Price updates immediately when variant changes

### Technical Requirements
- Medusa.js compatibility for future backend integration
- Backward compatibility with existing simple Product type
- Shopify export format support
- Controlled component pattern for parent state management
- WCAG 2.1 AA accessibility compliance

## Type System & Data Models

### Medusa-Compatible Types

```typescript
export interface ProductOption {
  id: string;
  title: string;              // e.g., "Size", "Color"
  product_id?: string;
  values: ProductOptionValue[];
  metadata?: Record<string, unknown>;
}

export interface ProductOptionValue {
  id: string;
  value: string;              // e.g., "Blue", "Medium"
  option_id?: string;
  option?: ProductOption;
  metadata?: Record<string, unknown>;
}

export interface ProductVariant {
  id: string;
  sku?: string;
  barcode?: string;
  title?: string;
  product_id?: string;

  // Pricing
  price?: number;
  calculated_price?: number;
  original_price?: number;

  // Inventory
  inventory_quantity?: number;
  allow_backorder?: boolean;
  manage_inventory?: boolean;

  // Selected option values for this variant
  options: ProductOptionValue[];

  // Media
  images?: ProductImage[];
  thumbnail?: string;

  // Physical attributes
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  material?: string;

  // Metadata
  metadata?: Record<string, unknown>;
  variant_rank?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  rank?: number;
  metadata?: Record<string, unknown>;
}
```

### Backward Compatibility Adapter

The component accepts both simple and structured formats through adapter functions:

```typescript
function adaptSimpleProductToOptions(product: Product): {
  options: ProductOption[];
  variants: ProductVariant[];
} {
  const options: ProductOption[] = [];

  // Convert sizes array to option
  if (product.sizes?.length) {
    options.push({
      id: 'size-option',
      title: 'Size',
      values: product.sizes.map((size, idx) => ({
        id: `size-${idx}`,
        value: size,
        option_id: 'size-option',
      })),
    });
  }

  // Convert colors array to option with swatches
  if (product.colors?.length || product.colorSwatches?.length) {
    const colorValues = product.colorSwatches ||
      product.colors?.map(c => ({ name: c, hex: '#000' })) || [];

    options.push({
      id: 'color-option',
      title: 'Color',
      values: colorValues.map((color, idx) => ({
        id: `color-${idx}`,
        value: color.name,
        option_id: 'color-option',
        metadata: { hex: color.hex },
      })),
    });
  }

  return { options, variants: product.variants || [] };
}
```

## Component Architecture

### Props Interface

```typescript
interface VariantSelectorProps {
  // Product data - supports both formats
  product?: Product;                    // Simple format (backward compat)
  options?: ProductOption[];            // Medusa format
  variants?: ProductVariant[];          // Medusa format

  // Current selection state
  selectedOptions: Record<string, string>;  // { "Size": "M", "Color": "Blue" }

  // Callbacks
  onOptionChange: (optionName: string, value: string) => void;
  onVariantSelect?: (variant: ProductVariant | null) => void;

  // Optional customization
  displayMode?: 'default' | 'compact';
  showPrice?: boolean;                  // Show price updates
  showStock?: boolean;                  // Show stock status
  lowStockThreshold?: number;           // Default: 5

  // Feature flags
  disableUnavailable?: boolean;         // Disable out-of-stock options
  autoSelectFirst?: boolean;            // Auto-select first available
  unavailableBehavior?: 'hide' | 'disable' | 'show';
  allowOutOfStockSelection?: boolean;   // Default: true

  // Loading state
  isLoading?: boolean;
}
```

### Component Hierarchy

```
VariantSelector (main container)
├── {options.map(option => {
│     switch(option.title) {
│       case 'Size': return <SizeSelector />
│       case 'Color': return <ColorSelector />
│       default: return <OptionSelector />
│     }
│   })}
├── <StockIndicator /> (if showStock)
└── <PriceDisplay /> (if showPrice)
```

### Sub-Components

1. **SizeSelector** - Button grid for size selection
2. **ColorSelector** - Circular swatches with hex colors
3. **OptionSelector** - Generic selector for other option types
4. **StockIndicator** - Displays stock status with icons
5. **PriceDisplay** - Shows variant pricing with animations

### State Management

The component uses a **controlled pattern** where the parent manages selection state:

```typescript
// Parent component usage example
function ProductDetailPage() {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(null);

  return (
    <VariantSelector
      product={product}
      selectedOptions={selectedOptions}
      onOptionChange={(name, value) => {
        setSelectedOptions(prev => ({ ...prev, [name]: value }));
      }}
      onVariantSelect={setCurrentVariant}
      showPrice
      showStock
    />
  );
}
```

## Variant Availability Logic

### Available Options Algorithm

When a user selects an option, compute which other options remain available:

```typescript
function computeAvailableOptions(
  options: ProductOption[],
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): Record<string, Set<string>> {

  const availableValues: Record<string, Set<string>> = {};

  // Initialize with all possible values
  options.forEach(option => {
    availableValues[option.title] = new Set(
      option.values.map(v => v.value)
    );
  });

  // Filter to only values that have matching variants
  variants.forEach(variant => {
    const matches = Object.entries(selectedOptions).every(([optionName, selectedValue]) => {
      const variantValue = variant.options.find(
        opt => opt.option?.title === optionName
      );
      return !variantValue || variantValue.value === selectedValue;
    });

    if (matches && variant.inventory_quantity !== 0) {
      variant.options.forEach(optionValue => {
        const optionTitle = optionValue.option?.title;
        if (optionTitle) {
          availableValues[optionTitle].add(optionValue.value);
        }
      });
    }
  });

  return availableValues;
}
```

### Stock Status Computation

```typescript
function getVariantStockStatus(
  variant: ProductVariant | null,
  lowStockThreshold: number = 5
): {
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  quantity?: number;
  message: string;
} {
  if (!variant) {
    return { status: 'out-of-stock', message: 'Out of Stock' };
  }

  const qty = variant.inventory_quantity ?? 0;

  if (qty === 0) {
    return { status: 'out-of-stock', message: 'Out of Stock' };
  }

  if (qty <= lowStockThreshold) {
    return {
      status: 'low-stock',
      quantity: qty,
      message: `Only ${qty} left in stock`
    };
  }

  return { status: 'in-stock', message: 'In Stock' };
}
```

### Variant Matching

```typescript
function findMatchingVariant(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): ProductVariant | null {

  return variants.find(variant => {
    return Object.entries(selectedOptions).every(([optionName, selectedValue]) => {
      const variantOption = variant.options.find(
        opt => opt.option?.title === optionName
      );
      return variantOption?.value === selectedValue;
    });
  }) || null;
}
```

## Visual States & UX

### Option Value States

```typescript
type OptionValueState =
  | 'available'      // Normal, clickable, in stock
  | 'selected'       // Currently selected
  | 'out-of-stock'   // Variant exists but no inventory - STILL CLICKABLE
  | 'unavailable'    // No variant exists - HIDDEN or DISABLED
```

### State Definitions

1. **Available** - Default style, clickable, has inventory
2. **Selected** - Highlighted with accent color and bold border
3. **Out of Stock** - Variant exists but inventory_quantity = 0
   - Still clickable to show details
   - Visual indicator (strike-through or badge)
   - Stock message displays when selected
4. **Unavailable** - No variant exists for this combination
   - Hidden OR disabled based on `unavailableBehavior` prop
   - Cannot be selected

### User Flows

**Scenario 1: Out of Stock (Variant Exists)**
1. User clicks "Blue" color
2. User clicks "Medium" size (which is out of stock)
3. ✅ Selection is allowed, both options show as selected
4. Stock indicator shows: "Out of Stock"
5. "Add to Cart" button is disabled with text "Out of Stock - Notify Me"
6. User can still see variant images and price

**Scenario 2: Unavailable (Variant Doesn't Exist)**
1. User clicks "Blue" color
2. "XL" size button is grayed out and disabled (or hidden)
3. ❌ User cannot click "XL"
4. Tooltip on hover: "Not available in Blue"

## UI Design

### Size Selector - Button Grid

```
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ XS  │ │  S  │ │  M  │ │  L  │ │ XL  │
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘
```

- Button style with border (48px height desktop, 44px mobile)
- Selected: Bold border, accent color
- Disabled: Gray with reduced opacity
- Out of stock: Regular border with strike-through overlay

### Color Selector - Circular Swatches

```
  ●     ●     ●     ●     ●
Black  Blue  Red  Green  Gray
       ✓
```

- Circular swatches (40px diameter desktop, 36px mobile)
- Fill with actual hex color from metadata
- Selected: Checkmark icon overlay
- Out of stock: Diagonal line overlay
- Disabled: 50% opacity

### Stock Indicator Styling

```css
.stock-in-stock {
  color: #059669;  /* green-600 */
  icon: check-circle
}

.stock-low-stock {
  color: #F59E0B;  /* amber-500 */
  icon: alert-circle
  text: "Only X left"
}

.stock-out-of-stock {
  color: #DC2626;  /* red-600 */
  icon: x-circle
  text: "Out of Stock"
}
```

### Responsive Behavior

**Desktop (≥768px):**
- Horizontal layout with options side-by-side
- Full button sizes (48px height)

**Mobile (<768px):**
- Vertical stacking of option groups
- Slightly smaller buttons (44px height minimum)
- Color swatches: 36px diameter

### Accessibility

```typescript
// ARIA labels and roles
<div role="group" aria-label="Size selection">
  <button
    role="radio"
    aria-checked={isSelected}
    aria-disabled={isUnavailable}
    aria-label={`Size ${value}${isOutOfStock ? ' - Out of stock' : ''}`}
  >
    {value}
  </button>
</div>
```

**Keyboard Navigation:**
- Tab: Move between option groups
- Arrow keys: Navigate within option group
- Space/Enter: Select option
- Screen reader announces: "Size Medium, selected, in stock"

**Animations:**
- Option selection: 150ms ease-in-out
- Stock status change: 200ms fade
- Price update: 300ms with number counter animation
- Image updates: Crossfade 400ms

## Error Handling & Edge Cases

### Edge Cases

1. **Single Option Product**
   - Auto-select the only option
   - Show as read-only badge
   - UI: "Size: One Size" (non-interactive)

2. **No Variants Defined**
   - Generate combinations on-the-fly
   - OR show options as informational only

3. **All Variants Out of Stock**
   - Show all options as selectable
   - Message: "This product is currently out of stock"
   - CTA: "Notify When Available"

4. **Partial Selection**
   - Show selected options
   - Keep other options available
   - Don't compute final variant yet
   - Indicators show "Select all options"

5. **Invalid Selection from Props**
   - Validate on mount
   - Clear invalid selections via callback
   - Log warning in development
   - Show error: "Selection unavailable, please choose again"

6. **Missing Option Metadata**
   - Color without hex: Use name or default gray
   - Show text label as fallback

### Validation

```typescript
function validateProps(props: VariantSelectorProps): string[] {
  const errors: string[] = [];

  if (!props.product && (!props.options || !props.variants)) {
    errors.push('Must provide either product or options+variants');
  }

  if (props.variants?.length && !props.options?.length) {
    errors.push('Variants require corresponding options');
  }

  Object.entries(props.selectedOptions).forEach(([name, value]) => {
    const option = props.options?.find(o => o.title === name);
    if (option && !option.values.some(v => v.value === value)) {
      errors.push(`Invalid value "${value}" for option "${name}"`);
    }
  });

  return errors;
}
```

## File Structure

```
src/react-app/
├── components/
│   └── products/
│       └── VariantSelector/
│           ├── index.tsx                    # Main export
│           ├── VariantSelector.tsx          # Main component
│           ├── VariantSelector.test.tsx     # Unit tests
│           ├── VariantSelector.css          # Styles
│           ├── SizeSelector.tsx             # Size renderer
│           ├── ColorSelector.tsx            # Color swatch renderer
│           ├── OptionSelector.tsx           # Generic renderer
│           ├── StockIndicator.tsx           # Stock display
│           ├── PriceDisplay.tsx             # Price display
│           └── types.ts                     # Component types
├── hooks/
│   ├── useVariantSelection.ts               # Selection logic
│   └── useVariantAvailability.ts            # Availability logic
├── utils/
│   ├── variantMatching.ts                   # Algorithms
│   └── productAdapter.ts                    # Format adapter
└── types/
    └── index.ts                             # Global types
```

## Performance Optimizations

1. **Memoization**
   - useMemo for variant lookup
   - useMemo for availability computation
   - useMemo for adapter functions

2. **Lazy Loading**
   - Sub-components code-split if needed
   - Images lazy-loaded

3. **Debouncing**
   - Rapid option changes debounced before callbacks

## Testing Strategy

### Unit Tests (>90% coverage)

- Option selection behavior
- Availability logic with various combinations
- Backward compatibility with simple Product type
- Accessibility (ARIA labels, keyboard navigation)
- Edge cases (single option, all out of stock, etc.)

### Integration Tests

- Complete user flows
- Variant resolution
- Price/stock updates
- Parent callback integration

### Visual Regression Tests

- Default state
- Selected state
- Out of stock state
- Compact mode

## Migration Path

**Phase 1: Backward Compatible (Current)**
```typescript
<VariantSelector product={simpleProduct} />
```

**Phase 2: Structured Format**
```typescript
<VariantSelector
  options={convertedOptions}
  variants={convertedVariants}
/>
```

**Phase 3: Medusa Integration**
```typescript
<VariantSelector
  options={medusaProduct.options}
  variants={medusaProduct.variants}
/>
```

## Future Enhancements

### v1.1 - Inventory Intelligence
- Backorder support (`allow_backorder` flag)
- Pre-order functionality
- Restock notifications
- Multi-vendor inventory tracking
- Permanent out-of-stock vs temporary

### v1.2 - Advanced Features
- Quantity selector integration
- Bulk variant selection
- Variant comparison view
- "Notify me when available" button

### v1.3 - Personalization
- Recommended variants based on history
- Recently viewed variants
- Size recommendations
- Smart defaults based on user preferences

## Dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest"
  }
}
```

## Success Metrics

- Component renders without errors
- All 6 acceptance criteria from Linear issue met
- >90% test coverage achieved
- WCAG 2.1 AA accessibility compliance
- Zero breaking changes to existing Product type
- Medusa.js format compatibility verified

## Related Documentation

- Linear Issue: CCB-1089
- Component Requirements: PROD-050 through PROD-055
- Medusa.js Product API: https://docs.medusajs.com/api/store#products
