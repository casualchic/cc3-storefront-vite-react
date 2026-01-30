# VariantSelector Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready VariantSelector component that handles product variant selection with Medusa.js compatibility and backward compatibility with existing Product types.

**Architecture:** Controlled component pattern with sub-components for each option type (Size, Color, Generic). Uses custom hooks for variant matching and availability computation. Adapts between simple Product format and full Medusa.js structure.

**Tech Stack:** React 19, TypeScript, lucide-react for icons, @testing-library/react for tests

---

## Task 1: Add Medusa-Compatible Types to Global Types

**Files:**
- Modify: `src/react-app/types/index.ts`

**Step 1: Write failing test for type existence**

Create: `src/react-app/types/index.test.ts`

```typescript
import type {
  ProductOption,
  ProductOptionValue,
  ProductVariant,
  ProductImage,
} from './index';

describe('Medusa-Compatible Types', () => {
  test('ProductOption type exists and has required fields', () => {
    const option: ProductOption = {
      id: 'opt-1',
      title: 'Size',
      values: [],
    };
    expect(option.id).toBe('opt-1');
    expect(option.title).toBe('Size');
  });

  test('ProductOptionValue type exists', () => {
    const value: ProductOptionValue = {
      id: 'val-1',
      value: 'Medium',
    };
    expect(value.value).toBe('Medium');
  });

  test('ProductVariant type exists with options array', () => {
    const variant: ProductVariant = {
      id: 'var-1',
      options: [],
    };
    expect(variant.id).toBe('var-1');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/react-app/types/index.test.ts`
Expected: FAIL - types don't exist

**Step 3: Add Medusa-compatible types to index.ts**

Modify: `src/react-app/types/index.ts` (append to end of file)

```typescript
// Medusa.js compatible types for variant selection
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

**Step 4: Run test to verify it passes**

Run: `npm test -- src/react-app/types/index.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/react-app/types/index.ts src/react-app/types/index.test.ts
git commit -m "feat: add Medusa-compatible types for variant selection (CCB-1089)

Add ProductOption, ProductOptionValue, ProductVariant, and ProductImage
types compatible with Medusa.js structure.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Create Product Adapter Utility

**Files:**
- Create: `src/react-app/utils/productAdapter.ts`
- Create: `src/react-app/utils/productAdapter.test.ts`

**Step 1: Write failing test for adapter function**

Create: `src/react-app/utils/productAdapter.test.ts`

```typescript
import { adaptSimpleProductToOptions } from './productAdapter';
import type { Product } from '../types';

describe('productAdapter', () => {
  describe('adaptSimpleProductToOptions', () => {
    test('converts simple sizes array to ProductOption', () => {
      const product: Product = {
        id: 'prod-1',
        name: 'Test Product',
        price: 29.99,
        image: 'test.jpg',
        category: 'test',
        sizes: ['S', 'M', 'L'],
        inStock: true,
      };

      const { options, variants } = adaptSimpleProductToOptions(product);

      expect(options).toHaveLength(1);
      expect(options[0].title).toBe('Size');
      expect(options[0].values).toHaveLength(3);
      expect(options[0].values[0].value).toBe('S');
    });

    test('converts colors array to ProductOption with hex metadata', () => {
      const product: Product = {
        id: 'prod-1',
        name: 'Test Product',
        price: 29.99,
        image: 'test.jpg',
        category: 'test',
        colors: ['Blue', 'Red'],
        inStock: true,
      };

      const { options } = adaptSimpleProductToOptions(product);

      expect(options).toHaveLength(1);
      expect(options[0].title).toBe('Color');
      expect(options[0].values[0].value).toBe('Blue');
    });

    test('uses colorSwatches when available', () => {
      const product: Product = {
        id: 'prod-1',
        name: 'Test Product',
        price: 29.99,
        image: 'test.jpg',
        category: 'test',
        colorSwatches: [
          { name: 'Navy', hex: '#001f3f' },
          { name: 'Crimson', hex: '#dc143c' },
        ],
        inStock: true,
      };

      const { options } = adaptSimpleProductToOptions(product);

      expect(options[0].values[0].value).toBe('Navy');
      expect(options[0].values[0].metadata?.hex).toBe('#001f3f');
    });

    test('returns empty arrays when no sizes or colors', () => {
      const product: Product = {
        id: 'prod-1',
        name: 'Test Product',
        price: 29.99,
        image: 'test.jpg',
        category: 'test',
        inStock: true,
      };

      const { options, variants } = adaptSimpleProductToOptions(product);

      expect(options).toHaveLength(0);
      expect(variants).toHaveLength(0);
    });

    test('passes through existing variants if present', () => {
      const product: Product = {
        id: 'prod-1',
        name: 'Test Product',
        price: 29.99,
        image: 'test.jpg',
        category: 'test',
        sizes: ['S', 'M'],
        variants: [
          {
            id: 'var-1',
            options: [],
            price: 29.99,
          },
        ] as any,
        inStock: true,
      };

      const { variants } = adaptSimpleProductToOptions(product);

      expect(variants).toHaveLength(1);
      expect(variants[0].id).toBe('var-1');
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/react-app/utils/productAdapter.test.ts`
Expected: FAIL - module not found

**Step 3: Implement adapter function**

Create: `src/react-app/utils/productAdapter.ts`

```typescript
import type { Product, ProductOption, ProductVariant } from '../types';

/**
 * Adapts simple Product format (sizes/colors arrays) to Medusa-compatible
 * ProductOption and ProductVariant format for VariantSelector component.
 */
export function adaptSimpleProductToOptions(product: Product): {
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

  // Convert colors/colorSwatches to option
  if (product.colors?.length || product.colorSwatches?.length) {
    const colorValues = product.colorSwatches
      ? product.colorSwatches.map((swatch, idx) => ({
          id: `color-${idx}`,
          value: swatch.name,
          option_id: 'color-option',
          metadata: { hex: swatch.hex },
        }))
      : product.colors!.map((color, idx) => ({
          id: `color-${idx}`,
          value: color,
          option_id: 'color-option',
          metadata: { hex: '#000000' }, // Default black
        }));

    options.push({
      id: 'color-option',
      title: 'Color',
      values: colorValues,
    });
  }

  // Pass through existing variants or return empty array
  const variants = product.variants || [];

  return { options, variants };
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/react-app/utils/productAdapter.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/react-app/utils/productAdapter.ts src/react-app/utils/productAdapter.test.ts
git commit -m "feat: add product adapter for simple to Medusa format (CCB-1089)

Converts Product with sizes/colors arrays to ProductOption/ProductVariant
format for VariantSelector component.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Create Variant Matching Utility

**Files:**
- Create: `src/react-app/utils/variantMatching.ts`
- Create: `src/react-app/utils/variantMatching.test.ts`

**Step 1: Write failing tests for variant matching logic**

Create: `src/react-app/utils/variantMatching.test.ts`

```typescript
import {
  findMatchingVariant,
  computeAvailableOptions,
  getVariantStockStatus,
} from './variantMatching';
import type { ProductOption, ProductVariant } from '../types';

describe('variantMatching', () => {
  const blueOption = { id: 'blue', value: 'Blue', option: { title: 'Color' } as any };
  const redOption = { id: 'red', value: 'Red', option: { title: 'Color' } as any };
  const smallOption = { id: 's', value: 'S', option: { title: 'Size' } as any };
  const mediumOption = { id: 'm', value: 'M', option: { title: 'Size' } as any };
  const largeOption = { id: 'l', value: 'L', option: { title: 'Size' } as any };

  describe('findMatchingVariant', () => {
    test('finds exact match when all options selected', () => {
      const variants: ProductVariant[] = [
        { id: 'var-1', options: [blueOption, smallOption] },
        { id: 'var-2', options: [blueOption, mediumOption] },
        { id: 'var-3', options: [redOption, smallOption] },
      ];

      const result = findMatchingVariant(variants, {
        Color: 'Blue',
        Size: 'M',
      });

      expect(result?.id).toBe('var-2');
    });

    test('returns null when no match found', () => {
      const variants: ProductVariant[] = [
        { id: 'var-1', options: [blueOption, smallOption] },
      ];

      const result = findMatchingVariant(variants, {
        Color: 'Red',
        Size: 'L',
      });

      expect(result).toBeNull();
    });

    test('returns null for partial selection', () => {
      const variants: ProductVariant[] = [
        { id: 'var-1', options: [blueOption, smallOption] },
      ];

      const result = findMatchingVariant(variants, {
        Color: 'Blue',
      });

      expect(result).toBeNull();
    });
  });

  describe('computeAvailableOptions', () => {
    test('returns all options when nothing selected', () => {
      const options: ProductOption[] = [
        {
          id: 'color-opt',
          title: 'Color',
          values: [
            { id: 'blue', value: 'Blue' },
            { id: 'red', value: 'Red' },
          ],
        },
        {
          id: 'size-opt',
          title: 'Size',
          values: [
            { id: 's', value: 'S' },
            { id: 'm', value: 'M' },
          ],
        },
      ];

      const variants: ProductVariant[] = [
        { id: 'var-1', options: [blueOption, smallOption], inventory_quantity: 10 },
        { id: 'var-2', options: [redOption, mediumOption], inventory_quantity: 5 },
      ];

      const result = computeAvailableOptions(options, variants, {});

      expect(result.Color.has('Blue')).toBe(true);
      expect(result.Color.has('Red')).toBe(true);
      expect(result.Size.has('S')).toBe(true);
      expect(result.Size.has('M')).toBe(true);
    });

    test('filters sizes when color selected', () => {
      const options: ProductOption[] = [
        {
          id: 'color-opt',
          title: 'Color',
          values: [
            { id: 'blue', value: 'Blue' },
            { id: 'red', value: 'Red' },
          ],
        },
        {
          id: 'size-opt',
          title: 'Size',
          values: [
            { id: 's', value: 'S' },
            { id: 'm', value: 'M' },
            { id: 'l', value: 'L' },
          ],
        },
      ];

      const variants: ProductVariant[] = [
        { id: 'var-1', options: [blueOption, smallOption], inventory_quantity: 10 },
        { id: 'var-2', options: [blueOption, mediumOption], inventory_quantity: 5 },
        { id: 'var-3', options: [redOption, largeOption], inventory_quantity: 3 },
      ];

      const result = computeAvailableOptions(options, variants, {
        Color: 'Blue',
      });

      expect(result.Size.has('S')).toBe(true);
      expect(result.Size.has('M')).toBe(true);
      expect(result.Size.has('L')).toBe(false); // Only available in Red
    });

    test('excludes out-of-stock variants from availability', () => {
      const options: ProductOption[] = [
        {
          id: 'size-opt',
          title: 'Size',
          values: [
            { id: 's', value: 'S' },
            { id: 'm', value: 'M' },
          ],
        },
      ];

      const variants: ProductVariant[] = [
        { id: 'var-1', options: [smallOption], inventory_quantity: 10 },
        { id: 'var-2', options: [mediumOption], inventory_quantity: 0 },
      ];

      const result = computeAvailableOptions(options, variants, {});

      expect(result.Size.has('S')).toBe(true);
      expect(result.Size.has('M')).toBe(false); // Out of stock
    });
  });

  describe('getVariantStockStatus', () => {
    test('returns out-of-stock when variant is null', () => {
      const result = getVariantStockStatus(null, 5);

      expect(result.status).toBe('out-of-stock');
      expect(result.message).toBe('Out of Stock');
    });

    test('returns out-of-stock when inventory is zero', () => {
      const variant: ProductVariant = {
        id: 'var-1',
        options: [],
        inventory_quantity: 0,
      };

      const result = getVariantStockStatus(variant, 5);

      expect(result.status).toBe('out-of-stock');
      expect(result.message).toBe('Out of Stock');
    });

    test('returns low-stock when below threshold', () => {
      const variant: ProductVariant = {
        id: 'var-1',
        options: [],
        inventory_quantity: 3,
      };

      const result = getVariantStockStatus(variant, 5);

      expect(result.status).toBe('low-stock');
      expect(result.quantity).toBe(3);
      expect(result.message).toBe('Only 3 left in stock');
    });

    test('returns in-stock when above threshold', () => {
      const variant: ProductVariant = {
        id: 'var-1',
        options: [],
        inventory_quantity: 10,
      };

      const result = getVariantStockStatus(variant, 5);

      expect(result.status).toBe('in-stock');
      expect(result.message).toBe('In Stock');
    });

    test('treats undefined inventory as zero', () => {
      const variant: ProductVariant = {
        id: 'var-1',
        options: [],
      };

      const result = getVariantStockStatus(variant, 5);

      expect(result.status).toBe('out-of-stock');
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/react-app/utils/variantMatching.test.ts`
Expected: FAIL - module not found

**Step 3: Implement variant matching utilities**

Create: `src/react-app/utils/variantMatching.ts`

```typescript
import type { ProductOption, ProductVariant } from '../types';

/**
 * Finds a variant that exactly matches the selected options.
 * Returns null if no exact match or if selection is incomplete.
 */
export function findMatchingVariant(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): ProductVariant | null {
  return (
    variants.find((variant) => {
      return Object.entries(selectedOptions).every(
        ([optionName, selectedValue]) => {
          const variantOption = variant.options.find(
            (opt) => opt.option?.title === optionName
          );
          return variantOption?.value === selectedValue;
        }
      );
    }) || null
  );
}

/**
 * Computes which option values are available based on current selections.
 * Excludes options that have no matching variants with inventory.
 */
export function computeAvailableOptions(
  options: ProductOption[],
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): Record<string, Set<string>> {
  const availableValues: Record<string, Set<string>> = {};

  // Initialize with all possible values
  options.forEach((option) => {
    availableValues[option.title] = new Set(option.values.map((v) => v.value));
  });

  // Filter to only values that have matching variants with inventory
  const availableFromVariants: Record<string, Set<string>> = {};
  options.forEach((option) => {
    availableFromVariants[option.title] = new Set();
  });

  variants.forEach((variant) => {
    // Check if this variant matches current selections
    const matches = Object.entries(selectedOptions).every(
      ([optionName, selectedValue]) => {
        const variantValue = variant.options.find(
          (opt) => opt.option?.title === optionName
        );
        return !variantValue || variantValue.value === selectedValue;
      }
    );

    // Only include if matches and has inventory
    if (matches && (variant.inventory_quantity ?? 0) > 0) {
      variant.options.forEach((optionValue) => {
        const optionTitle = optionValue.option?.title;
        if (optionTitle) {
          availableFromVariants[optionTitle].add(optionValue.value);
        }
      });
    }
  });

  return availableFromVariants;
}

/**
 * Determines stock status for a variant based on inventory quantity.
 */
export function getVariantStockStatus(
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
      message: `Only ${qty} left in stock`,
    };
  }

  return { status: 'in-stock', message: 'In Stock' };
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/react-app/utils/variantMatching.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/react-app/utils/variantMatching.ts src/react-app/utils/variantMatching.test.ts
git commit -m "feat: add variant matching and availability utilities (CCB-1089)

Implements findMatchingVariant, computeAvailableOptions, and
getVariantStockStatus for VariantSelector component logic.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Create Custom Hooks for Variant Selection

**Files:**
- Create: `src/react-app/hooks/useVariantSelection.ts`
- Create: `src/react-app/hooks/useVariantSelection.test.ts`
- Create: `src/react-app/hooks/useVariantAvailability.ts`
- Create: `src/react-app/hooks/useVariantAvailability.test.ts`

**Step 1: Write failing test for useVariantSelection hook**

Create: `src/react-app/hooks/useVariantSelection.test.ts`

```typescript
import { renderHook } from '@testing-library/react';
import { useVariantSelection } from './useVariantSelection';
import type { ProductVariant } from '../types';

describe('useVariantSelection', () => {
  const blueSmall: ProductVariant = {
    id: 'var-1',
    options: [
      { id: 'blue', value: 'Blue', option: { title: 'Color' } as any },
      { id: 's', value: 'S', option: { title: 'Size' } as any },
    ],
    price: 29.99,
    inventory_quantity: 10,
  };

  const blueMedium: ProductVariant = {
    id: 'var-2',
    options: [
      { id: 'blue', value: 'Blue', option: { title: 'Color' } as any },
      { id: 'm', value: 'M', option: { title: 'Size' } as any },
    ],
    price: 29.99,
    inventory_quantity: 5,
  };

  test('returns null variant when no selection', () => {
    const { result } = renderHook(() =>
      useVariantSelection([blueSmall, blueMedium], {})
    );

    expect(result.current.currentVariant).toBeNull();
    expect(result.current.isComplete).toBe(false);
  });

  test('returns null variant when partial selection', () => {
    const { result } = renderHook(() =>
      useVariantSelection([blueSmall, blueMedium], { Color: 'Blue' })
    );

    expect(result.current.currentVariant).toBeNull();
    expect(result.current.isComplete).toBe(false);
  });

  test('returns matching variant when all options selected', () => {
    const { result } = renderHook(() =>
      useVariantSelection([blueSmall, blueMedium], {
        Color: 'Blue',
        Size: 'S',
      })
    );

    expect(result.current.currentVariant?.id).toBe('var-1');
    expect(result.current.isComplete).toBe(true);
  });

  test('memoizes result when inputs unchanged', () => {
    const { result, rerender } = renderHook(
      ({ variants, selected }) => useVariantSelection(variants, selected),
      {
        initialProps: {
          variants: [blueSmall],
          selected: { Color: 'Blue', Size: 'S' },
        },
      }
    );

    const firstResult = result.current;
    rerender({
      variants: [blueSmall],
      selected: { Color: 'Blue', Size: 'S' },
    });

    expect(result.current).toBe(firstResult);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/react-app/hooks/useVariantSelection.test.ts`
Expected: FAIL - module not found

**Step 3: Implement useVariantSelection hook**

Create: `src/react-app/hooks/useVariantSelection.ts`

```typescript
import { useMemo } from 'react';
import type { ProductVariant } from '../types';
import { findMatchingVariant } from '../utils/variantMatching';

/**
 * Hook to manage variant selection state and determine current variant.
 */
export function useVariantSelection(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
) {
  const currentVariant = useMemo(
    () => findMatchingVariant(variants, selectedOptions),
    [variants, selectedOptions]
  );

  const isComplete = useMemo(() => {
    return currentVariant !== null;
  }, [currentVariant]);

  return { currentVariant, isComplete };
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/react-app/hooks/useVariantSelection.test.ts`
Expected: PASS

**Step 5: Write failing test for useVariantAvailability hook**

Create: `src/react-app/hooks/useVariantAvailability.test.ts`

```typescript
import { renderHook } from '@testing-library/react';
import { useVariantAvailability } from './useVariantAvailability';
import type { ProductOption, ProductVariant } from '../types';

describe('useVariantAvailability', () => {
  const options: ProductOption[] = [
    {
      id: 'color-opt',
      title: 'Color',
      values: [
        { id: 'blue', value: 'Blue' },
        { id: 'red', value: 'Red' },
      ],
    },
    {
      id: 'size-opt',
      title: 'Size',
      values: [
        { id: 's', value: 'S' },
        { id: 'm', value: 'M' },
      ],
    },
  ];

  const variants: ProductVariant[] = [
    {
      id: 'var-1',
      options: [
        { id: 'blue', value: 'Blue', option: { title: 'Color' } as any },
        { id: 's', value: 'S', option: { title: 'Size' } as any },
      ],
      inventory_quantity: 10,
    },
    {
      id: 'var-2',
      options: [
        { id: 'red', value: 'Red', option: { title: 'Color' } as any },
        { id: 'm', value: 'M', option: { title: 'Size' } as any },
      ],
      inventory_quantity: 5,
    },
  ];

  test('returns all options when nothing selected', () => {
    const { result } = renderHook(() =>
      useVariantAvailability(options, variants, {})
    );

    expect(result.current.Color.has('Blue')).toBe(true);
    expect(result.current.Color.has('Red')).toBe(true);
    expect(result.current.Size.has('S')).toBe(true);
    expect(result.current.Size.has('M')).toBe(true);
  });

  test('filters options when selection made', () => {
    const { result } = renderHook(() =>
      useVariantAvailability(options, variants, { Color: 'Blue' })
    );

    expect(result.current.Size.has('S')).toBe(true);
    expect(result.current.Size.has('M')).toBe(false);
  });

  test('memoizes result when inputs unchanged', () => {
    const { result, rerender } = renderHook(
      ({ opts, vars, selected }) =>
        useVariantAvailability(opts, vars, selected),
      {
        initialProps: { opts: options, vars: variants, selected: {} },
      }
    );

    const firstResult = result.current;
    rerender({ opts: options, vars: variants, selected: {} });

    expect(result.current).toBe(firstResult);
  });
});
```

**Step 6: Run test to verify it fails**

Run: `npm test -- src/react-app/hooks/useVariantAvailability.test.ts`
Expected: FAIL - module not found

**Step 7: Implement useVariantAvailability hook**

Create: `src/react-app/hooks/useVariantAvailability.ts`

```typescript
import { useMemo } from 'react';
import type { ProductOption, ProductVariant } from '../types';
import { computeAvailableOptions } from '../utils/variantMatching';

/**
 * Hook to compute which option values are available based on current selections.
 */
export function useVariantAvailability(
  options: ProductOption[],
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): Record<string, Set<string>> {
  return useMemo(
    () => computeAvailableOptions(options, variants, selectedOptions),
    [options, variants, selectedOptions]
  );
}
```

**Step 8: Run test to verify it passes**

Run: `npm test -- src/react-app/hooks/useVariantAvailability.test.ts`
Expected: PASS

**Step 9: Commit**

```bash
git add src/react-app/hooks/useVariantSelection.ts src/react-app/hooks/useVariantSelection.test.ts src/react-app/hooks/useVariantAvailability.ts src/react-app/hooks/useVariantAvailability.test.ts
git commit -m "feat: add custom hooks for variant selection logic (CCB-1089)

Implements useVariantSelection and useVariantAvailability hooks with
memoization for performance.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Create StockIndicator Sub-Component

**Files:**
- Create: `src/react-app/components/products/VariantSelector/StockIndicator.tsx`
- Create: `src/react-app/components/products/VariantSelector/StockIndicator.test.tsx`
- Create: `src/react-app/components/products/VariantSelector/StockIndicator.css`

**Step 1: Write failing test for StockIndicator**

Create: `src/react-app/components/products/VariantSelector/StockIndicator.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { StockIndicator } from './StockIndicator';

describe('StockIndicator', () => {
  test('renders in-stock status with green color', () => {
    render(
      <StockIndicator
        status="in-stock"
        quantity={100}
        message="In Stock"
      />
    );

    expect(screen.getByText('In Stock')).toBeInTheDocument();
    expect(screen.getByText('In Stock').closest('div')).toHaveClass(
      'stock-indicator',
      'stock-in-stock'
    );
  });

  test('renders low-stock status with amber color and quantity', () => {
    render(
      <StockIndicator
        status="low-stock"
        quantity={3}
        message="Only 3 left in stock"
      />
    );

    expect(screen.getByText('Only 3 left in stock')).toBeInTheDocument();
    expect(screen.getByText('Only 3 left in stock').closest('div')).toHaveClass(
      'stock-low-stock'
    );
  });

  test('renders out-of-stock status with red color', () => {
    render(
      <StockIndicator
        status="out-of-stock"
        message="Out of Stock"
      />
    );

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByText('Out of Stock').closest('div')).toHaveClass(
      'stock-out-of-stock'
    );
  });

  test('renders with correct ARIA attributes', () => {
    render(
      <StockIndicator
        status="low-stock"
        quantity={2}
        message="Only 2 left"
      />
    );

    const indicator = screen.getByText('Only 2 left').closest('div');
    expect(indicator).toHaveAttribute('role', 'status');
    expect(indicator).toHaveAttribute('aria-live', 'polite');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/react-app/components/products/VariantSelector/StockIndicator.test.tsx`
Expected: FAIL - module not found

**Step 3: Implement StockIndicator component**

Create: `src/react-app/components/products/VariantSelector/StockIndicator.tsx`

```typescript
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import './StockIndicator.css';

interface StockIndicatorProps {
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  quantity?: number;
  message: string;
}

export function StockIndicator({ status, message }: StockIndicatorProps) {
  const Icon =
    status === 'in-stock'
      ? CheckCircle
      : status === 'low-stock'
      ? AlertCircle
      : XCircle;

  return (
    <div
      className={`stock-indicator stock-${status}`}
      role="status"
      aria-live="polite"
    >
      <Icon className="stock-icon" size={16} aria-hidden="true" />
      <span className="stock-message">{message}</span>
    </div>
  );
}
```

**Step 4: Create styles for StockIndicator**

Create: `src/react-app/components/products/VariantSelector/StockIndicator.css`

```css
.stock-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  transition: opacity 200ms ease-in-out;
}

.stock-icon {
  flex-shrink: 0;
}

.stock-message {
  line-height: 1.25rem;
}

.stock-in-stock {
  color: #059669; /* green-600 */
}

.stock-low-stock {
  color: #f59e0b; /* amber-500 */
}

.stock-out-of-stock {
  color: #dc2626; /* red-600 */
}
```

**Step 5: Run test to verify it passes**

Run: `npm test -- src/react-app/components/products/VariantSelector/StockIndicator.test.tsx`
Expected: PASS

**Step 6: Commit**

```bash
git add src/react-app/components/products/VariantSelector/StockIndicator.tsx src/react-app/components/products/VariantSelector/StockIndicator.test.tsx src/react-app/components/products/VariantSelector/StockIndicator.css
git commit -m "feat: add StockIndicator sub-component (CCB-1089)

Displays stock status with color-coded icons and messages for
in-stock, low-stock, and out-of-stock states.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Create PriceDisplay Sub-Component

**Files:**
- Create: `src/react-app/components/products/VariantSelector/PriceDisplay.tsx`
- Create: `src/react-app/components/products/VariantSelector/PriceDisplay.test.tsx`
- Create: `src/react-app/components/products/VariantSelector/PriceDisplay.css`

**Step 1: Write failing test for PriceDisplay**

Create: `src/react-app/components/products/VariantSelector/PriceDisplay.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { PriceDisplay } from './PriceDisplay';

describe('PriceDisplay', () => {
  test('renders current price only when no original price', () => {
    render(<PriceDisplay price={29.99} />);

    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.queryByText(/original/i)).not.toBeInTheDocument();
  });

  test('renders sale price with strikethrough original price', () => {
    render(<PriceDisplay price={19.99} originalPrice={29.99} />);

    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toHaveClass('price-original');
  });

  test('renders "Select options" when no price provided', () => {
    render(<PriceDisplay />);

    expect(screen.getByText('Select options')).toBeInTheDocument();
  });

  test('has correct ARIA label', () => {
    render(<PriceDisplay price={29.99} />);

    const priceElement = screen.getByText('$29.99').closest('div');
    expect(priceElement).toHaveAttribute('aria-label', 'Price: $29.99');
  });

  test('has sale price ARIA label when on sale', () => {
    render(<PriceDisplay price={19.99} originalPrice={29.99} />);

    const priceElement = screen.getByText('$19.99').closest('div');
    expect(priceElement).toHaveAttribute(
      'aria-label',
      'Sale price: $19.99, original price: $29.99'
    );
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/react-app/components/products/VariantSelector/PriceDisplay.test.tsx`
Expected: FAIL - module not found

**Step 3: Implement PriceDisplay component**

Create: `src/react-app/components/products/VariantSelector/PriceDisplay.tsx`

```typescript
import './PriceDisplay.css';

interface PriceDisplayProps {
  price?: number;
  originalPrice?: number;
}

export function PriceDisplay({ price, originalPrice }: PriceDisplayProps) {
  if (price === undefined) {
    return (
      <div className="price-display price-placeholder">
        <span className="price-select-text">Select options</span>
      </div>
    );
  }

  const isOnSale = originalPrice && originalPrice > price;
  const ariaLabel = isOnSale
    ? `Sale price: $${price.toFixed(2)}, original price: $${originalPrice.toFixed(2)}`
    : `Price: $${price.toFixed(2)}`;

  return (
    <div className="price-display" aria-label={ariaLabel}>
      <span className="price-current">${price.toFixed(2)}</span>
      {isOnSale && (
        <span className="price-original" aria-hidden="true">
          ${originalPrice.toFixed(2)}
        </span>
      )}
    </div>
  );
}
```

**Step 4: Create styles for PriceDisplay**

Create: `src/react-app/components/products/VariantSelector/PriceDisplay.css`

```css
.price-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  transition: opacity 300ms ease-in-out;
}

.price-current {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000;
}

.price-original {
  font-size: 1.125rem;
  font-weight: 400;
  color: #6b7280; /* gray-500 */
  text-decoration: line-through;
}

.price-placeholder {
  color: #9ca3af; /* gray-400 */
}

.price-select-text {
  font-size: 1rem;
  font-style: italic;
}

@media (prefers-color-scheme: dark) {
  .price-current {
    color: #fff;
  }

  .price-original {
    color: #9ca3af;
  }
}
```

**Step 5: Run test to verify it passes**

Run: `npm test -- src/react-app/components/products/VariantSelector/PriceDisplay.test.tsx`
Expected: PASS

**Step 6: Commit**

```bash
git add src/react-app/components/products/VariantSelector/PriceDisplay.tsx src/react-app/components/products/VariantSelector/PriceDisplay.test.tsx src/react-app/components/products/VariantSelector/PriceDisplay.css
git commit -m "feat: add PriceDisplay sub-component (CCB-1089)

Displays variant pricing with sale price support and accessibility.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Create SizeSelector Sub-Component

**Files:**
- Create: `src/react-app/components/products/VariantSelector/SizeSelector.tsx`
- Create: `src/react-app/components/products/VariantSelector/SizeSelector.test.tsx`
- Create: `src/react-app/components/products/VariantSelector/SizeSelector.css`

**Step 1: Write failing test for SizeSelector**

Create: `src/react-app/components/products/VariantSelector/SizeSelector.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { SizeSelector } from './SizeSelector';
import type { ProductOption } from '../../../types';

describe('SizeSelector', () => {
  const sizeOption: ProductOption = {
    id: 'size-opt',
    title: 'Size',
    values: [
      { id: 's', value: 'S' },
      { id: 'm', value: 'M' },
      { id: 'l', value: 'L' },
    ],
  };

  test('renders all size options as buttons', () => {
    render(
      <SizeSelector
        option={sizeOption}
        selectedValue={undefined}
        availableValues={new Set(['S', 'M', 'L'])}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /size s/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /size m/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /size l/i })).toBeInTheDocument();
  });

  test('highlights selected size', () => {
    render(
      <SizeSelector
        option={sizeOption}
        selectedValue="M"
        availableValues={new Set(['S', 'M', 'L'])}
        onSelect={jest.fn()}
      />
    );

    const mediumButton = screen.getByRole('button', { name: /size m/i });
    expect(mediumButton).toHaveClass('size-button', 'size-button-selected');
    expect(mediumButton).toHaveAttribute('aria-checked', 'true');
  });

  test('disables unavailable sizes', () => {
    render(
      <SizeSelector
        option={sizeOption}
        selectedValue={undefined}
        availableValues={new Set(['S', 'M'])} // L not available
        onSelect={jest.fn()}
      />
    );

    const largeButton = screen.getByRole('button', { name: /size l/i });
    expect(largeButton).toBeDisabled();
    expect(largeButton).toHaveClass('size-button-unavailable');
  });

  test('calls onSelect when size clicked', () => {
    const handleSelect = jest.fn();
    render(
      <SizeSelector
        option={sizeOption}
        selectedValue={undefined}
        availableValues={new Set(['S', 'M', 'L'])}
        onSelect={handleSelect}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /size m/i }));

    expect(handleSelect).toHaveBeenCalledWith('Size', 'M');
  });

  test('has proper ARIA group label', () => {
    render(
      <SizeSelector
        option={sizeOption}
        selectedValue={undefined}
        availableValues={new Set(['S', 'M', 'L'])}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByRole('group', { name: 'Size selection' })).toBeInTheDocument();
  });

  test('supports keyboard navigation', () => {
    render(
      <SizeSelector
        option={sizeOption}
        selectedValue={undefined}
        availableValues={new Set(['S', 'M', 'L'])}
        onSelect={jest.fn()}
      />
    );

    const smallButton = screen.getByRole('button', { name: /size s/i });
    smallButton.focus();
    expect(smallButton).toHaveFocus();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/react-app/components/products/VariantSelector/SizeSelector.test.tsx`
Expected: FAIL - module not found

**Step 3: Implement SizeSelector component**

Create: `src/react-app/components/products/VariantSelector/SizeSelector.tsx`

```typescript
import type { ProductOption } from '../../../types';
import './SizeSelector.css';

interface SizeSelectorProps {
  option: ProductOption;
  selectedValue: string | undefined;
  availableValues: Set<string>;
  onSelect: (optionName: string, value: string) => void;
}

export function SizeSelector({
  option,
  selectedValue,
  availableValues,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div className="size-selector" role="group" aria-label={`${option.title} selection`}>
      <label className="size-label">{option.title}:</label>
      <div className="size-buttons">
        {option.values.map((optionValue) => {
          const isSelected = selectedValue === optionValue.value;
          const isAvailable = availableValues.has(optionValue.value);

          return (
            <button
              key={optionValue.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${option.title} ${optionValue.value}`}
              disabled={!isAvailable}
              className={`
                size-button
                ${isSelected ? 'size-button-selected' : ''}
                ${!isAvailable ? 'size-button-unavailable' : ''}
              `.trim()}
              onClick={() => onSelect(option.title, optionValue.value)}
            >
              {optionValue.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 4: Create styles for SizeSelector**

Create: `src/react-app/components/products/VariantSelector/SizeSelector.css`

```css
.size-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.size-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151; /* gray-700 */
}

.size-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.size-button {
  min-width: 3rem;
  height: 3rem;
  padding: 0.5rem 1rem;
  border: 2px solid #d1d5db; /* gray-300 */
  border-radius: 0.375rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease-in-out;
}

.size-button:hover:not(:disabled) {
  border-color: #000;
}

.size-button:focus {
  outline: 2px solid #000;
  outline-offset: 2px;
}

.size-button-selected {
  border-color: #000;
  background-color: #000;
  color: #fff;
}

.size-button-unavailable {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .size-button {
    height: 2.75rem; /* 44px minimum touch target */
  }
}

@media (prefers-color-scheme: dark) {
  .size-label {
    color: #e5e7eb;
  }

  .size-button {
    border-color: #4b5563;
    background-color: #1f2937;
    color: #e5e7eb;
  }

  .size-button:hover:not(:disabled) {
    border-color: #fff;
  }

  .size-button-selected {
    border-color: #fff;
    background-color: #fff;
    color: #000;
  }
}
```

**Step 5: Run test to verify it passes**

Run: `npm test -- src/react-app/components/products/VariantSelector/SizeSelector.test.tsx`
Expected: PASS

**Step 6: Commit**

```bash
git add src/react-app/components/products/VariantSelector/SizeSelector.tsx src/react-app/components/products/VariantSelector/SizeSelector.test.tsx src/react-app/components/products/VariantSelector/SizeSelector.css
git commit -m "feat: add SizeSelector sub-component (CCB-1089)

Button grid for size selection with keyboard navigation and
accessibility support.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Create ColorSelector Sub-Component

**Files:**
- Create: `src/react-app/components/products/VariantSelector/ColorSelector.tsx`
- Create: `src/react-app/components/products/VariantSelector/ColorSelector.test.tsx`
- Create: `src/react-app/components/products/VariantSelector/ColorSelector.css`

**Step 1: Write failing test for ColorSelector**

Create: `src/react-app/components/products/VariantSelector/ColorSelector.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ColorSelector } from './ColorSelector';
import type { ProductOption } from '../../../types';

describe('ColorSelector', () => {
  const colorOption: ProductOption = {
    id: 'color-opt',
    title: 'Color',
    values: [
      { id: 'blue', value: 'Blue', metadata: { hex: '#0000ff' } },
      { id: 'red', value: 'Red', metadata: { hex: '#ff0000' } },
      { id: 'green', value: 'Green', metadata: { hex: '#00ff00' } },
    ],
  };

  test('renders all color swatches', () => {
    render(
      <ColorSelector
        option={colorOption}
        selectedValue={undefined}
        availableValues={new Set(['Blue', 'Red', 'Green'])}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /color blue/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /color red/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /color green/i })).toBeInTheDocument();
  });

  test('applies hex color as background', () => {
    render(
      <ColorSelector
        option={colorOption}
        selectedValue={undefined}
        availableValues={new Set(['Blue', 'Red', 'Green'])}
        onSelect={jest.fn()}
      />
    );

    const blueButton = screen.getByRole('button', { name: /color blue/i });
    const swatch = blueButton.querySelector('.color-swatch');
    expect(swatch).toHaveStyle({ backgroundColor: '#0000ff' });
  });

  test('shows checkmark on selected color', () => {
    render(
      <ColorSelector
        option={colorOption}
        selectedValue="Blue"
        availableValues={new Set(['Blue', 'Red', 'Green'])}
        onSelect={jest.fn()}
      />
    );

    const blueButton = screen.getByRole('button', { name: /color blue/i });
    expect(blueButton).toHaveClass('color-button-selected');
    expect(blueButton).toHaveAttribute('aria-checked', 'true');
  });

  test('disables unavailable colors', () => {
    render(
      <ColorSelector
        option={colorOption}
        selectedValue={undefined}
        availableValues={new Set(['Blue', 'Red'])} // Green unavailable
        onSelect={jest.fn()}
      />
    );

    const greenButton = screen.getByRole('button', { name: /color green/i });
    expect(greenButton).toBeDisabled();
    expect(greenButton).toHaveClass('color-button-unavailable');
  });

  test('calls onSelect when color clicked', () => {
    const handleSelect = jest.fn();
    render(
      <ColorSelector
        option={colorOption}
        selectedValue={undefined}
        availableValues={new Set(['Blue', 'Red', 'Green'])}
        onSelect={handleSelect}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /color red/i }));

    expect(handleSelect).toHaveBeenCalledWith('Color', 'Red');
  });

  test('uses default color when hex not provided', () => {
    const colorWithoutHex: ProductOption = {
      id: 'color-opt',
      title: 'Color',
      values: [{ id: 'navy', value: 'Navy' }],
    };

    render(
      <ColorSelector
        option={colorWithoutHex}
        selectedValue={undefined}
        availableValues={new Set(['Navy'])}
        onSelect={jest.fn()}
      />
    );

    const navyButton = screen.getByRole('button', { name: /color navy/i });
    const swatch = navyButton.querySelector('.color-swatch');
    expect(swatch).toHaveStyle({ backgroundColor: '#cccccc' });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/react-app/components/products/VariantSelector/ColorSelector.test.tsx`
Expected: FAIL - module not found

**Step 3: Implement ColorSelector component**

Create: `src/react-app/components/products/VariantSelector/ColorSelector.tsx`

```typescript
import { Check } from 'lucide-react';
import type { ProductOption } from '../../../types';
import './ColorSelector.css';

interface ColorSelectorProps {
  option: ProductOption;
  selectedValue: string | undefined;
  availableValues: Set<string>;
  onSelect: (optionName: string, value: string) => void;
}

export function ColorSelector({
  option,
  selectedValue,
  availableValues,
  onSelect,
}: ColorSelectorProps) {
  return (
    <div className="color-selector" role="group" aria-label={`${option.title} selection`}>
      <label className="color-label">{option.title}:</label>
      <div className="color-swatches">
        {option.values.map((optionValue) => {
          const isSelected = selectedValue === optionValue.value;
          const isAvailable = availableValues.has(optionValue.value);
          const hexColor = (optionValue.metadata?.hex as string) || '#cccccc';

          return (
            <button
              key={optionValue.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${option.title} ${optionValue.value}`}
              disabled={!isAvailable}
              className={`
                color-button
                ${isSelected ? 'color-button-selected' : ''}
                ${!isAvailable ? 'color-button-unavailable' : ''}
              `.trim()}
              onClick={() => onSelect(option.title, optionValue.value)}
              title={optionValue.value}
            >
              <span
                className="color-swatch"
                style={{ backgroundColor: hexColor }}
                aria-hidden="true"
              >
                {isSelected && <Check size={16} className="color-check" />}
              </span>
              <span className="color-name">{optionValue.value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 4: Create styles for ColorSelector**

Create: `src/react-app/components/products/VariantSelector/ColorSelector.css`

```css
.color-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.color-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151; /* gray-700 */
}

.color-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.color-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.color-button:focus {
  outline: 2px solid #000;
  outline-offset: 4px;
  border-radius: 0.375rem;
}

.color-swatch {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem; /* 40px desktop */
  height: 2.5rem;
  border: 2px solid #d1d5db; /* gray-300 */
  border-radius: 50%;
  transition: all 150ms ease-in-out;
}

.color-button:hover:not(:disabled) .color-swatch {
  border-color: #000;
  transform: scale(1.1);
}

.color-button-selected .color-swatch {
  border-color: #000;
  border-width: 3px;
}

.color-check {
  color: #fff;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}

.color-name {
  font-size: 0.75rem;
  color: #374151;
  text-align: center;
}

.color-button-unavailable {
  opacity: 0.4;
  cursor: not-allowed;
}

.color-button-unavailable .color-swatch {
  position: relative;
}

.color-button-unavailable .color-swatch::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #000;
  transform: translateY(-50%) rotate(-45deg);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .color-swatch {
    width: 2.25rem; /* 36px mobile */
    height: 2.25rem;
  }
}

@media (prefers-color-scheme: dark) {
  .color-label,
  .color-name {
    color: #e5e7eb;
  }

  .color-swatch {
    border-color: #4b5563;
  }

  .color-button:hover:not(:disabled) .color-swatch,
  .color-button-selected .color-swatch {
    border-color: #fff;
  }

  .color-button:focus {
    outline-color: #fff;
  }
}
```

**Step 5: Run test to verify it passes**

Run: `npm test -- src/react-app/components/products/VariantSelector/ColorSelector.test.tsx`
Expected: PASS

**Step 6: Commit**

```bash
git add src/react-app/components/products/VariantSelector/ColorSelector.tsx src/react-app/components/products/VariantSelector/ColorSelector.test.tsx src/react-app/components/products/VariantSelector/ColorSelector.css
git commit -m "feat: add ColorSelector sub-component (CCB-1089)

Circular color swatches with hex colors, checkmark selection indicator,
and diagonal line for unavailable colors.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Create OptionSelector Generic Sub-Component

**Files:**
- Create: `src/react-app/components/products/VariantSelector/OptionSelector.tsx`
- Create: `src/react-app/components/products/VariantSelector/OptionSelector.test.tsx`
- Create: `src/react-app/components/products/VariantSelector/OptionSelector.css`

**Step 1: Write failing test for OptionSelector**

Create: `src/react-app/components/products/VariantSelector/OptionSelector.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { OptionSelector } from './OptionSelector';
import type { ProductOption } from '../../../types';

describe('OptionSelector', () => {
  const materialOption: ProductOption = {
    id: 'material-opt',
    title: 'Material',
    values: [
      { id: 'cotton', value: 'Cotton' },
      { id: 'poly', value: 'Polyester' },
      { id: 'blend', value: 'Cotton Blend' },
    ],
  };

  test('renders all option values as buttons', () => {
    render(
      <OptionSelector
        option={materialOption}
        selectedValue={undefined}
        availableValues={new Set(['Cotton', 'Polyester', 'Cotton Blend'])}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /material cotton$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /material polyester/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /material cotton blend/i })).toBeInTheDocument();
  });

  test('highlights selected option', () => {
    render(
      <OptionSelector
        option={materialOption}
        selectedValue="Polyester"
        availableValues={new Set(['Cotton', 'Polyester', 'Cotton Blend'])}
        onSelect={jest.fn()}
      />
    );

    const polyesterButton = screen.getByRole('button', {
      name: /material polyester/i,
    });
    expect(polyesterButton).toHaveClass('option-button-selected');
    expect(polyesterButton).toHaveAttribute('aria-checked', 'true');
  });

  test('disables unavailable options', () => {
    render(
      <OptionSelector
        option={materialOption}
        selectedValue={undefined}
        availableValues={new Set(['Cotton', 'Polyester'])} // Blend unavailable
        onSelect={jest.fn()}
      />
    );

    const blendButton = screen.getByRole('button', {
      name: /material cotton blend/i,
    });
    expect(blendButton).toBeDisabled();
  });

  test('calls onSelect when option clicked', () => {
    const handleSelect = jest.fn();
    render(
      <OptionSelector
        option={materialOption}
        selectedValue={undefined}
        availableValues={new Set(['Cotton', 'Polyester', 'Cotton Blend'])}
        onSelect={handleSelect}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /material cotton$/i }));

    expect(handleSelect).toHaveBeenCalledWith('Material', 'Cotton');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/react-app/components/products/VariantSelector/OptionSelector.test.tsx`
Expected: FAIL - module not found

**Step 3: Implement OptionSelector component**

Create: `src/react-app/components/products/VariantSelector/OptionSelector.tsx`

```typescript
import type { ProductOption } from '../../../types';
import './OptionSelector.css';

interface OptionSelectorProps {
  option: ProductOption;
  selectedValue: string | undefined;
  availableValues: Set<string>;
  onSelect: (optionName: string, value: string) => void;
}

export function OptionSelector({
  option,
  selectedValue,
  availableValues,
  onSelect,
}: OptionSelectorProps) {
  return (
    <div
      className="option-selector"
      role="group"
      aria-label={`${option.title} selection`}
    >
      <label className="option-label">{option.title}:</label>
      <div className="option-buttons">
        {option.values.map((optionValue) => {
          const isSelected = selectedValue === optionValue.value;
          const isAvailable = availableValues.has(optionValue.value);

          return (
            <button
              key={optionValue.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${option.title} ${optionValue.value}`}
              disabled={!isAvailable}
              className={`
                option-button
                ${isSelected ? 'option-button-selected' : ''}
                ${!isAvailable ? 'option-button-unavailable' : ''}
              `.trim()}
              onClick={() => onSelect(option.title, optionValue.value)}
            >
              {optionValue.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 4: Create styles for OptionSelector**

Create: `src/react-app/components/products/VariantSelector/OptionSelector.css`

```css
.option-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151; /* gray-700 */
}

.option-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.option-button {
  padding: 0.5rem 1rem;
  border: 2px solid #d1d5db; /* gray-300 */
  border-radius: 0.375rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease-in-out;
  white-space: nowrap;
}

.option-button:hover:not(:disabled) {
  border-color: #000;
}

.option-button:focus {
  outline: 2px solid #000;
  outline-offset: 2px;
}

.option-button-selected {
  border-color: #000;
  background-color: #000;
  color: #fff;
}

.option-button-unavailable {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (prefers-color-scheme: dark) {
  .option-label {
    color: #e5e7eb;
  }

  .option-button {
    border-color: #4b5563;
    background-color: #1f2937;
    color: #e5e7eb;
  }

  .option-button:hover:not(:disabled) {
    border-color: #fff;
  }

  .option-button-selected {
    border-color: #fff;
    background-color: #fff;
    color: #000;
  }
}
```

**Step 5: Run test to verify it passes**

Run: `npm test -- src/react-app/components/products/VariantSelector/OptionSelector.test.tsx`
Expected: PASS

**Step 6: Commit**

```bash
git add src/react-app/components/products/VariantSelector/OptionSelector.tsx src/react-app/components/products/VariantSelector/OptionSelector.test.tsx src/react-app/components/products/VariantSelector/OptionSelector.css
git commit -m "feat: add OptionSelector generic sub-component (CCB-1089)

Generic option selector for non-size/color options like Material, Style, etc.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Create Main VariantSelector Component

**Files:**
- Create: `src/react-app/components/products/VariantSelector/VariantSelector.tsx`
- Create: `src/react-app/components/products/VariantSelector/VariantSelector.test.tsx`
- Create: `src/react-app/components/products/VariantSelector/VariantSelector.css`
- Create: `src/react-app/components/products/VariantSelector/types.ts`
- Create: `src/react-app/components/products/VariantSelector/index.tsx`

**Step 1: Write component-specific types**

Create: `src/react-app/components/products/VariantSelector/types.ts`

```typescript
import type { Product, ProductOption, ProductVariant } from '../../../types';

export interface VariantSelectorProps {
  // Product data - supports both formats
  product?: Product;
  options?: ProductOption[];
  variants?: ProductVariant[];

  // Current selection state
  selectedOptions: Record<string, string>;

  // Callbacks
  onOptionChange: (optionName: string, value: string) => void;
  onVariantSelect?: (variant: ProductVariant | null) => void;

  // Optional customization
  displayMode?: 'default' | 'compact';
  showPrice?: boolean;
  showStock?: boolean;
  lowStockThreshold?: number;

  // Feature flags
  disableUnavailable?: boolean;
  autoSelectFirst?: boolean;
  unavailableBehavior?: 'hide' | 'disable' | 'show';
  allowOutOfStockSelection?: boolean;

  // Loading state
  isLoading?: boolean;
}
```

**Step 2: Write failing test for main component**

Create: `src/react-app/components/products/VariantSelector/VariantSelector.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { VariantSelector } from './VariantSelector';
import type { Product, ProductOption, ProductVariant } from '../../../types';

describe('VariantSelector', () => {
  describe('with Medusa format (options + variants)', () => {
    const options: ProductOption[] = [
      {
        id: 'color-opt',
        title: 'Color',
        values: [
          { id: 'blue', value: 'Blue', metadata: { hex: '#0000ff' } },
          { id: 'red', value: 'Red', metadata: { hex: '#ff0000' } },
        ],
      },
      {
        id: 'size-opt',
        title: 'Size',
        values: [
          { id: 's', value: 'S' },
          { id: 'm', value: 'M' },
        ],
      },
    ];

    const variants: ProductVariant[] = [
      {
        id: 'var-1',
        options: [
          { id: 'blue', value: 'Blue', option: { title: 'Color' } as any },
          { id: 's', value: 'S', option: { title: 'Size' } as any },
        ],
        price: 29.99,
        inventory_quantity: 10,
      },
      {
        id: 'var-2',
        options: [
          { id: 'red', value: 'Red', option: { title: 'Color' } as any },
          { id: 'm', value: 'M', option: { title: 'Size' } as any },
        ],
        price: 34.99,
        inventory_quantity: 3,
      },
    ];

    test('renders all option selectors', () => {
      render(
        <VariantSelector
          options={options}
          variants={variants}
          selectedOptions={{}}
          onOptionChange={jest.fn()}
        />
      );

      expect(screen.getByRole('group', { name: /color selection/i })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: /size selection/i })).toBeInTheDocument();
    });

    test('calls onOptionChange when option selected', () => {
      const handleChange = jest.fn();
      render(
        <VariantSelector
          options={options}
          variants={variants}
          selectedOptions={{}}
          onOptionChange={handleChange}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /color blue/i }));

      expect(handleChange).toHaveBeenCalledWith('Color', 'Blue');
    });

    test('calls onVariantSelect when variant matched', () => {
      const handleVariantSelect = jest.fn();
      render(
        <VariantSelector
          options={options}
          variants={variants}
          selectedOptions={{ Color: 'Blue', Size: 'S' }}
          onOptionChange={jest.fn()}
          onVariantSelect={handleVariantSelect}
        />
      );

      expect(handleVariantSelect).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'var-1' })
      );
    });

    test('shows price when showPrice is true', () => {
      render(
        <VariantSelector
          options={options}
          variants={variants}
          selectedOptions={{ Color: 'Blue', Size: 'S' }}
          onOptionChange={jest.fn()}
          showPrice
        />
      );

      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });

    test('shows stock status when showStock is true', () => {
      render(
        <VariantSelector
          options={options}
          variants={variants}
          selectedOptions={{ Color: 'Red', Size: 'M' }}
          onOptionChange={jest.fn()}
          showStock
          lowStockThreshold={5}
        />
      );

      expect(screen.getByText(/only 3 left/i)).toBeInTheDocument();
    });
  });

  describe('with simple Product format', () => {
    const product: Product = {
      id: 'prod-1',
      name: 'Test Product',
      price: 29.99,
      image: 'test.jpg',
      category: 'test',
      sizes: ['S', 'M', 'L'],
      colors: ['Blue', 'Red'],
      inStock: true,
    };

    test('adapts simple product to options/variants', () => {
      render(
        <VariantSelector
          product={product}
          selectedOptions={{}}
          onOptionChange={jest.fn()}
        />
      );

      expect(screen.getByRole('group', { name: /size selection/i })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: /color selection/i })).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    test('shows loading state', () => {
      render(
        <VariantSelector
          options={[]}
          variants={[]}
          selectedOptions={{}}
          onOptionChange={jest.fn()}
          isLoading
        />
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test('throws error when neither product nor options provided', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(
          <VariantSelector selectedOptions={{}} onOptionChange={jest.fn()} />
        );
      }).toThrow();

      consoleError.mockRestore();
    });
  });
});
```

**Step 3: Run test to verify it fails**

Run: `npm test -- src/react-app/components/products/VariantSelector/VariantSelector.test.tsx`
Expected: FAIL - module not found

**Step 4: Implement main VariantSelector component**

Create: `src/react-app/components/products/VariantSelector/VariantSelector.tsx`

```typescript
import { useMemo, useEffect } from 'react';
import type { VariantSelectorProps } from './types';
import { adaptSimpleProductToOptions } from '../../../utils/productAdapter';
import { useVariantSelection } from '../../../hooks/useVariantSelection';
import { useVariantAvailability } from '../../../hooks/useVariantAvailability';
import { getVariantStockStatus } from '../../../utils/variantMatching';
import { SizeSelector } from './SizeSelector';
import { ColorSelector } from './ColorSelector';
import { OptionSelector } from './OptionSelector';
import { StockIndicator } from './StockIndicator';
import { PriceDisplay } from './PriceDisplay';
import './VariantSelector.css';

export function VariantSelector({
  product,
  options: propOptions,
  variants: propVariants,
  selectedOptions,
  onOptionChange,
  onVariantSelect,
  displayMode = 'default',
  showPrice = false,
  showStock = false,
  lowStockThreshold = 5,
  isLoading = false,
}: VariantSelectorProps) {
  // Adapt simple product format to Medusa format if needed
  const { options, variants } = useMemo(() => {
    if (propOptions && propVariants) {
      return { options: propOptions, variants: propVariants };
    }
    if (product) {
      return adaptSimpleProductToOptions(product);
    }
    throw new Error('Must provide either product or options+variants');
  }, [product, propOptions, propVariants]);

  // Get current variant and availability
  const { currentVariant, isComplete } = useVariantSelection(
    variants,
    selectedOptions
  );
  const availableValues = useVariantAvailability(
    options,
    variants,
    selectedOptions
  );

  // Notify parent when variant changes
  useEffect(() => {
    if (onVariantSelect && isComplete) {
      onVariantSelect(currentVariant);
    }
  }, [currentVariant, isComplete, onVariantSelect]);

  // Get stock status
  const stockStatus = useMemo(
    () => getVariantStockStatus(currentVariant, lowStockThreshold),
    [currentVariant, lowStockThreshold]
  );

  if (isLoading) {
    return (
      <div className="variant-selector-loading">
        <p>Loading options...</p>
      </div>
    );
  }

  return (
    <div className={`variant-selector variant-selector-${displayMode}`}>
      {options.map((option) => {
        const selectedValue = selectedOptions[option.title];
        const available = availableValues[option.title] || new Set();

        // Render different selector based on option type
        if (option.title === 'Size') {
          return (
            <SizeSelector
              key={option.id}
              option={option}
              selectedValue={selectedValue}
              availableValues={available}
              onSelect={onOptionChange}
            />
          );
        }

        if (option.title === 'Color') {
          return (
            <ColorSelector
              key={option.id}
              option={option}
              selectedValue={selectedValue}
              availableValues={available}
              onSelect={onOptionChange}
            />
          );
        }

        return (
          <OptionSelector
            key={option.id}
            option={option}
            selectedValue={selectedValue}
            availableValues={available}
            onSelect={onOptionChange}
          />
        );
      })}

      {showStock && isComplete && (
        <StockIndicator
          status={stockStatus.status}
          quantity={stockStatus.quantity}
          message={stockStatus.message}
        />
      )}

      {showPrice && (
        <PriceDisplay
          price={currentVariant?.price}
          originalPrice={currentVariant?.original_price}
        />
      )}
    </div>
  );
}
```

**Step 5: Create styles for main component**

Create: `src/react-app/components/products/VariantSelector/VariantSelector.css`

```css
.variant-selector {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
}

.variant-selector-compact {
  gap: 1rem;
}

.variant-selector-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #6b7280; /* gray-500 */
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .variant-selector {
    gap: 1.25rem;
  }
}
```

**Step 6: Create index file for exports**

Create: `src/react-app/components/products/VariantSelector/index.tsx`

```typescript
export { VariantSelector } from './VariantSelector';
export type { VariantSelectorProps } from './types';
```

**Step 7: Run test to verify it passes**

Run: `npm test -- src/react-app/components/products/VariantSelector/VariantSelector.test.tsx`
Expected: PASS

**Step 8: Commit**

```bash
git add src/react-app/components/products/VariantSelector/
git commit -m "feat: add main VariantSelector component (CCB-1089)

Orchestrates all sub-components with adapter logic for backward
compatibility. Supports both simple Product and Medusa formats.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 11: Create Documentation

**Files:**
- Create: `src/react-app/components/products/VariantSelector/README.md`

**Step 1: Write comprehensive component documentation**

Create: `src/react-app/components/products/VariantSelector/README.md`

```markdown
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
```

**Step 2: Commit documentation**

```bash
git add src/react-app/components/products/VariantSelector/README.md
git commit -m "docs: add VariantSelector component documentation (CCB-1089)

Comprehensive usage guide, API reference, and migration instructions.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 12: Update Linear Issue

**Step 1: Post progress comment to Linear**

Update Linear issue CCB-1089 with implementation status:

```
VariantSelector component implementation complete! ✅

**Completed:**
- ✅ Type system with Medusa.js compatibility
- ✅ Backward compatibility adapter for simple Product format
- ✅ Variant matching and availability utilities
- ✅ Custom hooks (useVariantSelection, useVariantAvailability)
- ✅ Sub-components: StockIndicator, PriceDisplay, SizeSelector, ColorSelector, OptionSelector
- ✅ Main VariantSelector component with orchestration logic
- ✅ Comprehensive test coverage (>90%)
- ✅ Full documentation and usage guide

**All Acceptance Criteria Met:**
- ✅ Size selection via buttons
- ✅ Color selection via circular swatches
- ✅ Visual indication for out-of-stock variants
- ✅ Low stock warning ("Only X left")
- ✅ Main image updates when color variant selected (via onVariantSelect callback)
- ✅ Price updates immediately when variant changes

**Next Steps:**
- Integration with ProductDetailPage component
- E2E testing on product pages
- Performance testing with large variant sets
```

---

## Task 13: Run Full Test Suite

**Step 1: Run all tests**

Run: `npm test`
Expected: All tests PASS with >90% coverage

**Step 2: Fix any failing tests**

If any tests fail, debug and fix issues before proceeding.

**Step 3: Commit any test fixes**

```bash
git add .
git commit -m "test: fix any remaining test issues (CCB-1089)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 14: Final Push and PR

**Step 1: Push branch to remote**

```bash
git push -u origin ianrothfuss/ccb-1089
```

**Step 2: Create pull request**

```bash
gh pr create --title "feat: Implement VariantSelector Component (CCB-1089)" --body "$(cat <<'EOF'
## Summary
Implements the VariantSelector component for product variant selection with Medusa.js compatibility and backward compatibility.

## Features
- Size selection via button grid
- Color selection via circular swatches
- Stock indicators (in-stock, low-stock, out-of-stock)
- Price updates on variant change
- Real-time availability computation
- WCAG 2.1 AA accessibility
- Responsive design

## Implementation Details
- **Type System**: Added Medusa-compatible types (ProductOption, ProductVariant, etc.)
- **Adapter**: Converts simple Product format to Medusa format
- **Utilities**: Variant matching, availability computation, stock status
- **Hooks**: useVariantSelection, useVariantAvailability
- **Sub-components**: StockIndicator, PriceDisplay, SizeSelector, ColorSelector, OptionSelector
- **Main Component**: Orchestrates all logic with controlled pattern

## Testing
- Unit tests for all utilities and components
- Integration tests for variant resolution
- >90% test coverage achieved
- Accessibility tests (ARIA, keyboard navigation)

## Acceptance Criteria
- ✅ Size selection via buttons
- ✅ Color selection via circular swatches
- ✅ Out-of-stock visual indicators
- ✅ Low stock warnings
- ✅ Image update support (via callback)
- ✅ Price updates on variant change

## Documentation
- Component README with usage examples
- Design document in docs/plans
- Type definitions with JSDoc comments

🤖 Generated with Claude Code
EOF
)"
```

**Step 3: Verify PR created successfully**

Expected: PR URL displayed

---

## Completion Checklist

✅ All types added to global types
✅ Product adapter utility created
✅ Variant matching utilities created
✅ Custom hooks created with tests
✅ All sub-components created with tests
✅ Main VariantSelector component created
✅ Comprehensive documentation written
✅ All tests passing (>90% coverage)
✅ Linear issue updated
✅ PR created and pushed

**Total Estimated Time:** 3-4 hours for complete implementation
