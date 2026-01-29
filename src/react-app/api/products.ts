import { Product } from '../types';
import { products as allProducts } from '../mocks/products';

export interface ProductsResponse {
  products: Product[];
  nextCursor: number | null;
  hasMore: boolean;
  total: number;
}

export interface FetchProductsParams {
  pageParam?: number;
  category?: string;
  limit?: number;
  onSale?: boolean;
}

/**
 * Simulates fetching paginated products from an API
 * In production, this would be replaced with actual API calls
 */
export async function fetchProducts({
  pageParam = 0,
  category,
  limit = 12,
  onSale = false,
}: FetchProductsParams): Promise<ProductsResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Filter products based on criteria
  let filteredProducts = [...allProducts];

  if (category) {
    filteredProducts = filteredProducts.filter((p) => p.category === category);
  }

  if (onSale) {
    filteredProducts = filteredProducts.filter((p) => p.originalPrice);
  }

  // Calculate pagination
  const start = pageParam * limit;
  const end = start + limit;
  const paginatedProducts = filteredProducts.slice(start, end);
  const hasMore = end < filteredProducts.length;
  const nextCursor = hasMore ? pageParam + 1 : null;

  return {
    products: paginatedProducts,
    nextCursor,
    hasMore,
    total: filteredProducts.length,
  };
}

/**
 * Fetches all products (for testing or initial load)
 */
export async function fetchAllProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return allProducts;
}
