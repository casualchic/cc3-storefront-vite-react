/**
 * Medusa v2 Product API
 * Functions for fetching product data from Medusa v2
 */

import { sdk } from './client';
import type { StoreProduct, StoreProductVariant } from "@medusajs/types/dist/http/product";
import { getMockProductByHandle, getMockProductById, searchMockProducts } from './mock-data';

// Type aliases for cleaner code
export type Product = StoreProduct;
export type ProductVariant = StoreProductVariant;

// Check if we should use mock data (when no publishable key is set or in dev mode)
const USE_MOCK_DATA = !import.meta.env.PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
  import.meta.env.PUBLIC_MEDUSA_PUBLISHABLE_KEY === 'your_publishable_key' ||
  import.meta.env.DEV;

/**
 * Fetch product by handle with variants and images
 */
export async function getProductByHandle(handle: string): Promise<Product | null> {
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    console.log('[DEV MODE] Using mock product data for handle:', handle);
    return Promise.resolve(getMockProductByHandle(handle));
  }

  try {
    const { products } = await sdk.store.product.list({
      handle,
      fields: '*variants,*variants.calculated_price,*images',
    });

    if (!products || products.length === 0) {
      return null;
    }

    return products[0];
  } catch (error) {
    console.error('Error fetching product from Medusa v2:', error);
    return null;
  }
}

/**
 * Fetch product by ID with variants and images
 */
export async function getProductById(productId: string): Promise<Product | null> {
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    console.log('[DEV MODE] Using mock product data for ID:', productId);
    return Promise.resolve(getMockProductById(productId));
  }

  try {
    const { product } = await sdk.store.product.retrieve(productId, {
      fields: '*variants,*variants.calculated_price,*images',
    });

    return product;
  } catch (error) {
    console.error('Error fetching product from Medusa v2:', error);
    return null;
  }
}

/**
 * Search products with filters
 */
export async function searchProducts(params: {
  q?: string;
  collection_id?: string[];
  category_id?: string[];
  tags?: string[];
  limit?: number;
  offset?: number;
  order?: string;
}) {
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    console.log('[DEV MODE] Using mock product data for search:', params.q);
    const mockResults = searchMockProducts(params.q);
    const offset = params.offset || 0;
    const limit = params.limit || 20;
    const paginatedResults = mockResults.slice(offset, offset + limit);

    return Promise.resolve({
      products: paginatedResults,
      total: mockResults.length,
      limit,
      offset,
    });
  }

  try {
    const { products, count, limit, offset } = await sdk.store.product.list({
      q: params.q,
      collection_id: params.collection_id,
      category_id: params.category_id,
      tag_id: params.tags,
      limit: params.limit || 20,
      offset: params.offset || 0,
      order: params.order,
      fields: '*variants,*variants.calculated_price,*images',
    });

    return {
      products: products || [],
      total: count || 0,
      limit: limit || 20,
      offset: offset || 0,
    };
  } catch (error) {
    console.error('Error searching products from Medusa v2:', error);
    return {
      products: [],
      total: 0,
      limit: params.limit || 20,
      offset: params.offset || 0,
    };
  }
}

/**
 * Get variant by ID
 */
export async function getVariantById(variantId: string): Promise<ProductVariant | null> {
  try {
    // In v2, we need to fetch through the product
    // This is a simplified version - you may need to adjust based on your needs
    const products = await sdk.store.product.list({
      fields: '*variants,*variants.calculated_price',
    });

    for (const product of products.products || []) {
      const variant = product.variants?.find(v => v.id === variantId);
      if (variant) return variant;
    }

    return null;
  } catch (error) {
    console.error('Error fetching variant from Medusa v2:', error);
    return null;
  }
}

/**
 * Helper to format Medusa product images for ImageGallery component
 */
export function formatProductImages(product: Product) {
  if (!product.images || product.images.length === 0) {
    return [];
  }

  return product.images.map((image: any) => ({
    url: image.url,
    alt: product.title,
    thumbnail: image.url, // Medusa doesn't have separate thumbnails by default
  }));
}

/**
 * Helper to get the default/first variant of a product
 */
export function getDefaultVariant(product: Product): ProductVariant | undefined {
  if (!product.variants || product.variants.length === 0) {
    return undefined;
  }

  // Return the first in-stock variant, or just the first variant
  const inStockVariant = product.variants.find((v: ProductVariant) =>
    v.inventory_quantity && v.inventory_quantity > 0
  );
  return inStockVariant || product.variants[0];
}

/**
 * Helper to get variant price (uses calculated_price from v2)
 */
export function getVariantPrice(variant: ProductVariant): number {
  // In Medusa v2, calculated_price is directly on the variant
  return variant.calculated_price?.calculated_amount || 0;
}

/**
 * Helper to get product price range (min-max)
 */
export function getProductPriceRange(product: Product): {
  min: number;
  max: number;
  currency: string;
} {
  if (!product.variants || product.variants.length === 0) {
    return { min: 0, max: 0, currency: 'usd' };
  }

  const prices = product.variants
    .map((v: ProductVariant) => v.calculated_price?.calculated_amount || 0)
    .filter((p: number) => p > 0);

  if (prices.length === 0) {
    return { min: 0, max: 0, currency: 'usd' };
  }

  const currency = product.variants[0]?.calculated_price?.currency_code || 'usd';

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    currency,
  };
}
