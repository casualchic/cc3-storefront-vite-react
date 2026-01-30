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
      // Check if selection is complete (all option types have a selected value)
      const allOptionsSelected = variant.options.every((opt) => {
        const optionTitle = opt.option?.title;
        return optionTitle && selectedOptions[optionTitle] !== undefined;
      });

      if (!allOptionsSelected) {
        return false;
      }

      // Check if all selected options match the variant
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
  // Filter to only values that have matching variants with inventory
  const availableFromVariants: Record<string, Set<string>> = {};
  options.forEach((option) => {
    availableFromVariants[option.title] = new Set();
  });

  variants.forEach((variant) => {
    // Check if this variant matches current selections
    const matches = Object.entries(selectedOptions).every(
      ([optionName, selectedValue]) => {
        const variantOption = variant.options.find(
          (opt) => opt.option?.title === optionName
        );
        return variantOption?.value === selectedValue;
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
