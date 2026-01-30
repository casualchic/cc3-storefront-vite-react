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
