export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description?: string;
  category: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  rating?: number;
  reviews?: number;
  colorSwatches?: { name: string; hex: string }[];
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
  stockCount?: number;
  variants?: ProductVariant[];
  defaultVariantId?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size?: string;
  color?: string;
  sku: string;
  stockCount: number;
  price?: number; // Optional override price
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}
