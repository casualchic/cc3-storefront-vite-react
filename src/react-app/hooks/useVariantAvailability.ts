import { useMemo, useRef } from 'react';
import type { ProductOption, ProductVariant } from '../types';
import { computeAvailableOptions } from '../utils/variantMatching';

/**
 * Helper to check if two option availability results are semantically equal
 */
function areAvailabilityResultsEqual(
  a: Record<string, Set<string>>,
  b: Record<string, Set<string>>
): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => {
    const setA = a[key];
    const setB = b[key];
    if (!setB) return false;
    if (setA.size !== setB.size) return false;
    for (const value of setA) {
      if (!setB.has(value)) return false;
    }
    return true;
  });
}

/**
 * Hook to compute which option values are available based on current selections.
 *
 * Wraps computeAvailableOptions with React memoization for performance.
 * Only returns option values that have variants with inventory.
 *
 * @param options - Array of product options with their possible values
 * @param variants - Array of all product variants
 * @param selectedOptions - Current selected options (e.g., {Color: "Blue"})
 * @returns Record mapping option titles to Sets of available values
 */
export function useVariantAvailability(
  options: ProductOption[],
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): Record<string, Set<string>> {
  const cacheRef = useRef<Record<string, Set<string>> | null>(null);

  return useMemo(() => {
    const computed = computeAvailableOptions(options, variants, selectedOptions);

    // If we have a cached result and it's semantically equal, return the cached version
    // to maintain referential equality
    if (cacheRef.current && areAvailabilityResultsEqual(cacheRef.current, computed)) {
      return cacheRef.current;
    }

    // Otherwise, cache and return the new result
    cacheRef.current = computed;
    return computed;
  }, [options, variants, selectedOptions]);
}
