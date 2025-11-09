/**
 * SizeSelector Component
 * Size selection buttons for product variants
 */

import { useState } from 'react';

interface SizeSelectorProps {
  sizes: SizeOption[];
  selectedSize: string | null;
  onSizeChange: (size: string) => void;
  disabled?: boolean;
}

export interface SizeOption {
  value: string;
  label: string;
  available: boolean;
  inventory?: number;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSizeChange,
  disabled = false,
}: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-heading text-sm font-semibold text-forest">
          Size
        </label>
        {selectedSize && (
          <span className="text-sm text-charcoal">
            Selected: {sizes.find(s => s.value === selectedSize)?.label}
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size.value;
          const isAvailable = size.available && !disabled;

          return (
            <button
              key={size.value}
              type="button"
              onClick={() => isAvailable && onSizeChange(size.value)}
              disabled={!isAvailable}
              className={`
                relative px-4 py-3 rounded-lg font-medium text-sm transition-all
                ${
                  isSelected
                    ? 'bg-primary text-white border-2 border-primary shadow-md'
                    : isAvailable
                    ? 'bg-white text-forest border-2 border-neutral hover:border-sage hover:bg-neutral'
                    : 'bg-neutral text-charcoal cursor-not-allowed border-2 border-neutral opacity-60'
                }
                ${!isAvailable ? 'relative overflow-hidden' : ''}
              `}
              aria-label={`Select size ${size.label}`}
              aria-pressed={isSelected}
            >
              {size.label}

              {/* Out of stock diagonal line */}
              {!size.available && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-charcoal/30 transform -rotate-45" />
                </div>
              )}

              {/* Low stock indicator */}
              {isAvailable && size.inventory !== undefined && size.inventory > 0 && size.inventory <= 3 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full"
                     title={`Only ${size.inventory} left`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Out of stock message */}
      {selectedSize && !sizes.find(s => s.value === selectedSize)?.available && (
        <p className="text-sm text-secondary flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          This size is currently out of stock
        </p>
      )}
    </div>
  );
}
