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
