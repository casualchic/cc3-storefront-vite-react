// Type definitions for Casual Chic Boutique storefront

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description?: string;
  category: string;
  subcategory?: string;
  sizes?: string[];
  colors?: string[];
  colorSwatches?: ColorSwatch[];
  variants?: ProductVariant[];
  inStock: boolean;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isSale?: boolean;
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
  stockCount?: number;
  defaultVariantId?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subcategories?: SubCategory[];
  productCount?: number;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string;
  productCount?: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  addedAt: string;
}

export type SortOption =
  | 'relevance'
  | 'price-low-high'
  | 'price-high-low'
  | 'newest'
  | 'bestselling';

export type ViewMode = 'grid' | 'list';

export interface FilterState {
  categories: string[];
  priceRange?: [number, number];
  sizes?: string[];
  colors?: string[];
  inStockOnly?: boolean;
  onSale?: boolean;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  inStockOnly?: boolean;
  onSale?: boolean;
  sort?: SortOption;
}

// Medusa.js compatible types for variant selection

/**
 * Represents a product option (e.g., Size, Color) in Medusa.js.
 * Contains the available values for this option.
 *
 * Note: This interface has a circular reference with ProductOptionValue.
 * ProductOption contains values array, and ProductOptionValue optionally references back to ProductOption.
 *
 * @see https://docs.medusajs.com/resources/references/product
 */
export interface ProductOption {
  /** Unique identifier for the option */
  id: string;
  /** Display name (e.g., "Size", "Color") */
  title: string;
  /** ID of the parent product */
  product_id?: string;
  /** Available values for this option */
  values: ProductOptionValue[];
  /** Additional custom data */
  metadata?: Record<string, unknown>;
}

/**
 * Represents a specific value for a product option (e.g., "Blue" for Color, "Medium" for Size).
 * Each variant selects one value from each product option.
 *
 * @see https://docs.medusajs.com/resources/references/product
 */
export interface ProductOptionValue {
  /** Unique identifier for the option value */
  id: string;
  /** The actual value (e.g., "Blue", "Medium") */
  value: string;
  /** ID of the parent option */
  option_id?: string;
  /** Reference back to the parent option (circular reference) */
  option?: ProductOption;
  /** Additional custom data */
  metadata?: Record<string, unknown>;
}

/**
 * Represents a specific variant of a product with unique combination of options.
 * For example, a "Blue Medium T-Shirt" would be one variant with specific option values.
 *
 * @see https://docs.medusajs.com/resources/references/product
 */
export interface ProductVariant {
  /** Unique identifier for the variant */
  id: string;
  /** Stock Keeping Unit */
  sku?: string;
  /** Product barcode */
  barcode?: string;
  /** Variant title (e.g., "Small / Blue") - required by Medusa.js */
  title: string;
  /** ID of the parent product */
  product_id?: string;

  // Pricing
  /** Base price for this variant */
  price?: number;
  /** Price after applying calculations (taxes, discounts, etc.) */
  calculated_price?: number;
  /** Original price before discounts */
  original_price?: number;

  // Inventory
  /** Available quantity in stock - required by Medusa.js */
  inventory_quantity: number;
  /** Whether to allow orders when out of stock */
  allow_backorder?: boolean;
  /** Whether inventory is actively managed */
  manage_inventory?: boolean;

  // Selected option values for this variant
  /** Array of option values that define this variant (e.g., [{value: "Blue"}, {value: "Medium"}]) */
  options: ProductOptionValue[];

  // Media
  /** Images specific to this variant */
  images?: ProductImage[];
  /** Thumbnail URL */
  thumbnail?: string;

  // Physical attributes
  /** Weight in grams */
  weight?: number;
  /** Length in millimeters */
  length?: number;
  /** Height in millimeters */
  height?: number;
  /** Width in millimeters */
  width?: number;
  /** Material description */
  material?: string;
  /** Size value (convenience field) */
  size?: string;
  /** Color value (convenience field) */
  color?: string;

  // Metadata
  /** Additional custom data */
  metadata?: Record<string, unknown>;
  /** Display order preference */
  variant_rank?: number;
}

/**
 * Represents an image associated with a product or variant.
 *
 * @see https://docs.medusajs.com/resources/references/product
 */
export interface ProductImage {
  /** Unique identifier for the image */
  id: string;
  /** URL to the image file */
  url: string;
  /** Display order preference */
  rank?: number;
  /** Additional custom data */
  metadata?: Record<string, unknown>;
}
