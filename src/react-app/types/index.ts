// Type definitions for Casual Chic Boutique storefront

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
  inStock: boolean;
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
  stockCount?: number;
  colorSwatches?: { name: string; hex: string }[];
  variants?: { id: string; price: number; size?: string; color?: string }[];
  defaultVariantId?: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isSale?: boolean;
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
export interface ProductOption {
  id: string;
  title: string;              // e.g., "Size", "Color"
  product_id?: string;
  values: ProductOptionValue[];
  metadata?: Record<string, unknown>;
}

export interface ProductOptionValue {
  id: string;
  value: string;              // e.g., "Blue", "Medium"
  option_id?: string;
  option?: ProductOption;
  metadata?: Record<string, unknown>;
}

export interface ProductVariant {
  id: string;
  sku?: string;
  barcode?: string;
  title?: string;
  product_id?: string;

  // Pricing
  price?: number;
  calculated_price?: number;
  original_price?: number;

  // Inventory
  inventory_quantity?: number;
  allow_backorder?: boolean;
  manage_inventory?: boolean;

  // Selected option values for this variant
  options: ProductOptionValue[];

  // Media
  images?: ProductImage[];
  thumbnail?: string;

  // Physical attributes
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  material?: string;

  // Metadata
  metadata?: Record<string, unknown>;
  variant_rank?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  rank?: number;
  metadata?: Record<string, unknown>;
}
