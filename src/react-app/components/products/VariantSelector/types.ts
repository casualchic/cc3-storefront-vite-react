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
