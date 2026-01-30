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
      : (product.colors || []).map((color, idx) => ({
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
