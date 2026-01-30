# VariantSelector Component

A production-ready variant selection component for e-commerce product pages. Supports size, color, and custom option selection with real-time availability checking, stock indicators, and price updates.

## Features

- ✅ Medusa.js compatible with backward compatibility for simple Product type
- ✅ Size selection via button grid
- ✅ Color selection via circular swatches with hex colors
- ✅ Generic option selector for material, style, etc.
- ✅ Real-time availability computation
- ✅ Stock indicators (in-stock, low-stock, out-of-stock)
- ✅ Price updates on variant change
- ✅ WCAG 2.1 AA accessible
- ✅ Keyboard navigation support
- ✅ Responsive design (mobile/desktop)

## Installation

The component is already integrated into the project. Import from:

```typescript
import { VariantSelector } from '@/components/products/VariantSelector';
```

## Basic Usage

### With Medusa.js Format

```typescript
import { useState } from 'react';
import { VariantSelector } from '@/components/products/VariantSelector';
import type { ProductOption, ProductVariant } from '@/types';

function ProductDetailPage() {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(null);

  const options: ProductOption[] = [
    {
      id: 'size-opt',
      title: 'Size',
      values: [
        { id: 's', value: 'S' },
        { id: 'm', value: 'M' },
        { id: 'l', value: 'L' },
      ],
    },
    {
      id: 'color-opt',
      title: 'Color',
      values: [
        { id: 'blue', value: 'Blue', metadata: { hex: '#0000ff' } },
        { id: 'red', value: 'Red', metadata: { hex: '#ff0000' } },
      ],
    },
  ];

  const variants: ProductVariant[] = [
    {
      id: 'var-1',
      title: 'S / Blue',
      options: [
        { id: 'blue', value: 'Blue', option: { title: 'Color' } },
        { id: 's', value: 'S', option: { title: 'Size' } },
      ],
      price: 29.99,
      inventory_quantity: 10,
    },
    // ... more variants
  ];

  return (
    <VariantSelector
      options={options}
      variants={variants}
      selectedOptions={selectedOptions}
      onOptionChange={(name, value) => {
        setSelectedOptions((prev) => ({ ...prev, [name]: value }));
      }}
      onVariantSelect={setCurrentVariant}
      showPrice
      showStock
      lowStockThreshold={5}
    />
  );
}
```

### With Simple Product Format (Backward Compatible)

```typescript
import { Product } from '@/types';

const product: Product = {
  id: 'prod-1',
  name: 'Cotton T-Shirt',
  price: 29.99,
  image: 'tshirt.jpg',
  category: 'clothing',
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  colorSwatches: [
    { name: 'Navy', hex: '#001f3f' },
    { name: 'White', hex: '#ffffff' },
  ],
  inStock: true,
};

<VariantSelector
  product={product}
  selectedOptions={selectedOptions}
  onOptionChange={handleOptionChange}
  showPrice
  showStock
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `product` | `Product?` | - | Simple product format (backward compat) |
| `options` | `ProductOption[]?` | - | Medusa-style options array |
| `variants` | `ProductVariant[]?` | - | Medusa-style variants array |
| `selectedOptions` | `Record<string, string>` | **Required** | Current selections (e.g., `{ Size: 'M', Color: 'Blue' }`) |
| `onOptionChange` | `(name: string, value: string) => void` | **Required** | Called when option selected |
| `onVariantSelect` | `(variant: ProductVariant \| null) => void?` | - | Called when variant found |
| `displayMode` | `'default' \| 'compact'` | `'default'` | Layout density |
| `showPrice` | `boolean` | `false` | Show price display |
| `showStock` | `boolean` | `false` | Show stock indicator |
| `lowStockThreshold` | `number` | `5` | Threshold for low stock warning |
| `disableUnavailable` | `boolean` | `false` | Disable unavailable options |
| `autoSelectFirst` | `boolean` | `false` | Auto-select first option |
| `unavailableBehavior` | `'hide' \| 'disable' \| 'show'` | `'disable'` | How to handle unavailable options |
| `allowOutOfStockSelection` | `boolean` | `true` | Allow selecting out-of-stock variants |
| `isLoading` | `boolean` | `false` | Show loading state |

## State Management

The component uses a **controlled pattern**. Parent component manages:

1. **Selected Options State**: Track user selections
2. **Current Variant State**: Store matched variant for cart operations

```typescript
const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(null);
```

## Variant Availability Logic

The component automatically computes which options are available based on:

1. **Current Selections**: Filters options that don't have matching variants
2. **Inventory**: Excludes options with zero inventory (unless out-of-stock selection allowed)

Example:
- User selects "Blue" color
- Only sizes available in Blue variants remain selectable
- Out-of-stock sizes are shown but grayed out

## Stock Status

Three stock states:

| Status | Condition | Color | Icon |
|--------|-----------|-------|------|
| In Stock | `qty > lowStockThreshold` | Green | CheckCircle |
| Low Stock | `0 < qty <= lowStockThreshold` | Amber | AlertCircle |
| Out of Stock | `qty === 0` | Red | XCircle |

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation (Tab, Arrow keys, Space/Enter)
- Screen reader support with ARIA labels
- Focus management
- Color contrast ratios meet standards

### Keyboard Navigation

- **Tab**: Move between option groups
- **Arrow Keys**: Navigate within group
- **Space/Enter**: Select option
- **Shift+Tab**: Reverse navigation

## Styling

Component uses CSS modules with class names:

- `.variant-selector` - Main container
- `.size-selector` - Size option group
- `.color-selector` - Color option group
- `.option-selector` - Generic option group
- `.stock-indicator` - Stock status display
- `.price-display` - Price display

Override styles via CSS specificity or CSS modules.

## Testing

Run tests:

```bash
npm test -- src/react-app/components/products/VariantSelector
```

Test coverage includes:
- Option selection behavior
- Availability logic
- Stock status computation
- Variant matching
- Accessibility (ARIA, keyboard nav)
- Edge cases

## Migration from Simple to Medusa Format

### Phase 1: Current (Backward Compatible)
```typescript
<VariantSelector product={simpleProduct} />
```

### Phase 2: Structured Format
```typescript
const { options, variants } = adaptSimpleProductToOptions(product);
<VariantSelector options={options} variants={variants} />
```

### Phase 3: Direct Medusa Integration
```typescript
const product = await medusaClient.products.retrieve(id);
<VariantSelector
  options={product.options}
  variants={product.variants}
/>
```

## Future Enhancements

- [ ] Backorder support
- [ ] Pre-order functionality
- [ ] Restock notifications
- [ ] Multi-vendor inventory
- [ ] Quantity selector integration
- [ ] Variant comparison view
- [ ] Size recommendations

## Related Documentation

- [Design Document](../../../../../docs/plans/2026-01-30-variantselector-design.md)
- [Linear Issue CCB-1089](https://linear.app/casual-chic/issue/CCB-1089)
- [Medusa.js Product API](https://docs.medusajs.com/api/store#products)
