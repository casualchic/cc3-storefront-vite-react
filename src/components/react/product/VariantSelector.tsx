/**
 * VariantSelector Component
 * Main container for product variant selection (size, color, etc.)
 * Manages variant state and updates based on user selections
 */

import { useState, useEffect, useMemo } from 'react';
import SizeSelector, { type SizeOption } from './SizeSelector';
import ColorSwatches, { type ColorOption } from './ColorSwatches';
import type { ProductVariant } from '@/lib/types/medusa';

interface VariantSelectorProps {
  productId: string;
  variants: ProductVariant[];
  defaultVariantId?: string;
  onVariantChange: (variant: ProductVariant | null) => void;
}

export default function VariantSelector({
  productId,
  variants,
  defaultVariantId,
  onVariantChange,
}: VariantSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Helper to get option value from Medusa variant
  const getOptionValue = (variant: ProductVariant, optionName: string): string | undefined => {
    if (!variant.options || !Array.isArray(variant.options)) return undefined;
    const option = variant.options.find((opt: any) => opt.option?.title?.toLowerCase() === optionName.toLowerCase());
    return option?.value;
  };

  // Extract unique sizes and colors from variants
  const { sizes, colors } = useMemo(() => {
    const sizeSet = new Set<string>();
    const colorSet = new Set<string>();

    variants.forEach((variant) => {
      const size = getOptionValue(variant, 'size');
      const color = getOptionValue(variant, 'color');
      if (size) sizeSet.add(size);
      if (color) colorSet.add(color);
    });

    return {
      sizes: Array.from(sizeSet),
      colors: Array.from(colorSet),
    };
  }, [variants]);

  // Build size options with availability
  const sizeOptions: SizeOption[] = useMemo(() => {
    return sizes.map((size) => {
      // Check if this size is available in any color (if color is selected)
      // or just check if the size exists in stock
      const availableVariants = variants.filter((v) => {
        const variantSize = getOptionValue(v, 'size');
        const variantColor = getOptionValue(v, 'color');
        const sizeMatches = variantSize === size;
        const colorMatches = !selectedColor || variantColor === selectedColor;
        return sizeMatches && colorMatches;
      });

      const available = availableVariants.some((v) => {
        return (v.inventory_quantity ?? 0) > 0;
      });

      const inventory = availableVariants.reduce(
        (sum, v) => sum + (v.inventory_quantity ?? 0),
        0
      );

      return {
        value: size,
        label: size,
        available,
        inventory: inventory > 0 ? inventory : undefined,
      };
    });
  }, [sizes, variants, selectedColor]);

  // Build color options with availability
  const colorOptions: ColorOption[] = useMemo(() => {
    return colors.map((color) => {
      // Check if this color is available in any size (if size is selected)
      // or just check if the color exists in stock
      const availableVariants = variants.filter((v) => {
        const variantColor = getOptionValue(v, 'color');
        const variantSize = getOptionValue(v, 'size');
        const colorMatches = variantColor === color;
        const sizeMatches = !selectedSize || variantSize === selectedSize;
        return colorMatches && sizeMatches;
      });

      const available = availableVariants.some((v) => {
        return (v.inventory_quantity ?? 0) > 0;
      });

      const inventory = availableVariants.reduce(
        (sum, v) => sum + (v.inventory_quantity ?? 0),
        0
      );

      // Try to get hex code from metadata or use default colors
      const hexCode = getColorHex(color);

      return {
        value: color,
        label: color,
        hexCode,
        available,
        inventory: inventory > 0 ? inventory : undefined,
      };
    });
  }, [colors, variants, selectedSize]);

  // Find the current selected variant
  const selectedVariant = useMemo(() => {
    if (!selectedSize && !selectedColor && sizes.length === 0 && colors.length === 0) {
      // No variants, return the first one (default product)
      return variants[0] || null;
    }

    return (
      variants.find((v) => {
        const variantSize = getOptionValue(v, 'size');
        const variantColor = getOptionValue(v, 'color');
        const sizeMatches = !selectedSize || variantSize === selectedSize;
        const colorMatches = !selectedColor || variantColor === selectedColor;
        return sizeMatches && colorMatches;
      }) || null
    );
  }, [variants, selectedSize, selectedColor, sizes.length, colors.length]);

  // Initialize with default variant if provided
  useEffect(() => {
    if (defaultVariantId) {
      const defaultVariant = variants.find((v) => v.id === defaultVariantId);
      if (defaultVariant) {
        const variantSize = getOptionValue(defaultVariant, 'size');
        const variantColor = getOptionValue(defaultVariant, 'color');
        if (variantSize) setSelectedSize(variantSize);
        if (variantColor) setSelectedColor(variantColor);
      }
    }
  }, [defaultVariantId, variants]);

  // Notify parent of variant changes
  useEffect(() => {
    onVariantChange(selectedVariant);
  }, [selectedVariant, onVariantChange]);

  // If product has no variants, don't show selectors
  if (variants.length === 0) {
    return null;
  }

  // If product has only one variant with no options, don't show selectors
  if (variants.length === 1 && sizes.length === 0 && colors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Color Selector */}
      {colors.length > 0 && (
        <ColorSwatches
          colors={colorOptions}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />
      )}

      {/* Size Selector */}
      {sizes.length > 0 && (
        <SizeSelector
          sizes={sizeOptions}
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
        />
      )}

      {/* Selected Variant Info */}
      {selectedVariant && (
        <div className="pt-4 border-t border-neutral">
          <div className="flex items-center justify-between text-sm">
            <span className="text-charcoal">SKU:</span>
            <span className="font-medium text-forest">
              {selectedVariant.sku || selectedVariant.id}
            </span>
          </div>
          {selectedVariant.inventory_quantity !== null && (
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-charcoal">Availability:</span>
              {(selectedVariant.inventory_quantity ?? 0) > 0 ? (
                <span className="font-medium text-sage flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  In Stock ({selectedVariant.inventory_quantity})
                </span>
              ) : (
                <span className="font-medium text-secondary flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Out of Stock
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* No variant selected message */}
      {!selectedVariant && (sizes.length > 0 || colors.length > 0) && (
        <div className="p-4 bg-neutral/50 rounded-lg">
          <p className="text-sm text-charcoal text-center">
            Please select {sizes.length > 0 && colors.length > 0 ? 'a size and color' : sizes.length > 0 ? 'a size' : 'a color'}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Helper function to get hex color code from color name
 * Can be expanded with more colors or fetched from product metadata
 */
function getColorHex(colorName: string): string | undefined {
  const colorMap: Record<string, string> = {
    black: '#000000',
    white: '#FFFFFF',
    red: '#EF4444',
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    pink: '#EC4899',
    purple: '#8B5CF6',
    gray: '#6B7280',
    grey: '#6B7280',
    navy: '#1E3A8A',
    beige: '#D4C5B9',
    brown: '#92400E',
    orange: '#F97316',
    teal: '#14B8A6',
    olive: '#84CC16',
    cream: '#FEF3C7',
    burgundy: '#991B1B',
    charcoal: '#374151',
  };

  return colorMap[colorName.toLowerCase()];
}
