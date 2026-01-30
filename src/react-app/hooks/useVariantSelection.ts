import { useMemo } from 'react';
import type { ProductVariant } from '../types';
import { findMatchingVariant } from '../utils/variantMatching';

/**
 * Hook to manage variant selection state and determine current variant.
 * 
 * Wraps findMatchingVariant with React memoization for performance.
 * 
 * @param variants - Array of all product variants
 * @param selectedOptions - Current selected options (e.g., {Color: "Blue", Size: "M"})
 * @returns Object with currentVariant (matching variant or null) and isComplete (whether selection is complete)
 */
export function useVariantSelection(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): { currentVariant: ProductVariant | null; isComplete: boolean } {
  const currentVariant = useMemo(
    () => findMatchingVariant(variants, selectedOptions),
    [variants, selectedOptions]
  );

  const isComplete = currentVariant !== null;

  return useMemo(
    () => ({ currentVariant, isComplete }),
    [currentVariant, isComplete]
  );
}
