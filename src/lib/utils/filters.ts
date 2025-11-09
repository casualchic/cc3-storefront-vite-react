/**
 * Filter Utilities
 * Extract dynamic filter options from product data
 */

import type { DynamicFilterOption } from '@/components/react/FilterPills';

// Color name to hex mapping for common colors
const COLOR_HEX_MAP: Record<string, string> = {
  'beige': '#F5F5DC',
  'white': '#FFFFFF',
  'navy': '#000080',
  'cream': '#FFFDD0',
  'charcoal': '#36454F',
  'black': '#000000',
  'red': '#FF0000',
  'blue': '#0000FF',
  'green': '#008000',
  'yellow': '#FFFF00',
  'pink': '#FFC0CB',
  'purple': '#800080',
  'orange': '#FFA500',
  'brown': '#A52A2A',
  'gray': '#808080',
  'grey': '#808080',
};

/**
 * Extract dynamic filters from product array
 * Analyzes product options and attributes to generate filter configurations
 */
export function extractDynamicFilters(products: any[]): DynamicFilterOption[] {
  const filters: DynamicFilterOption[] = [];
  const optionMap = new Map<string, Map<string, number>>();

  // Collect all product options and their values
  products.forEach(product => {
    if (!product.options) return;

    product.options.forEach((option: any) => {
      const optionTitle = option.title?.toLowerCase();
      if (!optionTitle) return;

      // Skip size options as they're typically per-product
      if (optionTitle === 'size') return;

      if (!optionMap.has(optionTitle)) {
        optionMap.set(optionTitle, new Map());
      }

      const valueMap = optionMap.get(optionTitle)!;

      option.values?.forEach((val: any) => {
        const value = val.value;
        if (!value) return;

        const count = valueMap.get(value) || 0;
        valueMap.set(value, count + 1);
      });
    });

    // Also collect material if present
    if (product.material) {
      if (!optionMap.has('material')) {
        optionMap.set('material', new Map());
      }
      const materialMap = optionMap.get('material')!;
      const count = materialMap.get(product.material) || 0;
      materialMap.set(product.material, count + 1);
    }
  });

  // Convert collected data to filter options
  optionMap.forEach((valueMap, optionName) => {
    if (valueMap.size === 0) return;

    const isColor = optionName === 'color' || optionName === 'colour';
    const isMaterial = optionName === 'material';

    const values = Array.from(valueMap.entries()).map(([value, count]) => ({
      id: value.toLowerCase().replace(/\s+/g, '-'),
      value,
      count,
      ...(isColor && { colorHex: COLOR_HEX_MAP[value.toLowerCase()] || getColorFromName(value) }),
    }));

    // Sort values by count (most common first)
    values.sort((a, b) => b.count - a.count);

    filters.push({
      id: optionName,
      label: capitalizeFirst(optionName),
      type: isColor ? 'color-swatch' : 'multi-select',
      values,
    });
  });

  // Sort filters: color first, then others alphabetically
  filters.sort((a, b) => {
    if (a.id === 'color') return -1;
    if (b.id === 'color') return 1;
    return a.label.localeCompare(b.label);
  });

  return filters;
}

/**
 * Apply dynamic filters to product array
 */
export function applyDynamicFilters(products: any[], filters: Record<string, any>): any[] {
  let filtered = products;

  Object.entries(filters).forEach(([filterId, filterValue]) => {
    // Skip empty filters
    if (!filterValue) return;
    if (Array.isArray(filterValue) && filterValue.length === 0) return;

    // Skip built-in filters (handled elsewhere)
    if (['priceMin', 'priceMax', 'categories', 'inStock', 'onSale'].includes(filterId)) return;

    filtered = filtered.filter(product => {
      // Check product options
      if (product.options) {
        const matchingOption = product.options.find(
          (opt: any) => opt.title?.toLowerCase() === filterId
        );

        if (matchingOption) {
          const optionValues = matchingOption.values?.map((v: any) =>
            v.value?.toLowerCase().replace(/\s+/g, '-')
          ) || [];

          if (Array.isArray(filterValue)) {
            return filterValue.some(fv => optionValues.includes(fv));
          } else {
            return optionValues.includes(filterValue);
          }
        }
      }

      // Check material
      if (filterId === 'material' && product.material) {
        const productMaterial = product.material.toLowerCase().replace(/\s+/g, '-');
        if (Array.isArray(filterValue)) {
          return filterValue.includes(productMaterial);
        } else {
          return productMaterial === filterValue;
        }
      }

      return false;
    });
  });

  return filtered;
}

/**
 * Helper: Capitalize first letter
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Helper: Generate color hex from color name (fallback)
 */
function getColorFromName(colorName: string): string {
  // Simple hash function to generate consistent colors
  let hash = 0;
  for (let i = 0; i < colorName.length; i++) {
    hash = colorName.charCodeAt(i) + ((hash << 5) - hash);
  }

  const color = Math.abs(hash).toString(16).substring(0, 6);
  return '#' + '000000'.substring(0, 6 - color.length) + color;
}
