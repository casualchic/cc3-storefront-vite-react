/**
 * Collections API
 * Functions for fetching product collections and categories
 */

import type { Product, Category } from '../db/schema';

/**
 * Valid sort options for collections
 */
const VALID_SORT_OPTIONS = ['newest', 'price-asc', 'price-desc', 'name'] as const;
type ValidSortOption = typeof VALID_SORT_OPTIONS[number];

/**
 * Validate and sanitize sort parameter
 */
function validateSortBy(sortBy: string): ValidSortOption {
  if (VALID_SORT_OPTIONS.includes(sortBy as ValidSortOption)) {
    return sortBy as ValidSortOption;
  }
  return 'newest'; // Default fallback
}

export interface Env {
  DB: D1Database;
  CACHE?: KVNamespace;
}

export interface CollectionWithProducts {
  category: Category;
  products: Product[];
  totalProducts: number;
}

export interface GetCollectionParams {
  handle: string;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'name';
  brandId?: string;
}

/**
 * Get all categories/collections
 */
export async function getCategories(
  { env }: { env: Env },
  brandId?: string
): Promise<Category[]> {
  const cacheKey = `categories:${brandId || 'all'}`;

  // Try cache first
  if (env.CACHE) {
    const cached = await env.CACHE.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  // Query database
  let query = 'SELECT * FROM categories';

  if (brandId) {
    // In a real implementation, you might have brand-specific categories
    // For now, we'll return all categories
  }

  query += ' ORDER BY name ASC';

  const result = await env.DB.prepare(query).all();
  const categories = result.results as unknown as Category[];

  // Cache for 1 hour
  if (env.CACHE) {
    await env.CACHE.put(cacheKey, JSON.stringify(categories), {
      expirationTtl: 3600
    });
  }

  return categories;
}

/**
 * Get category by handle
 */
export async function getCategoryByHandle(
  { env }: { env: Env },
  handle: string
): Promise<Category | null> {
  const cacheKey = `category:${handle}`;

  // Try cache first
  if (env.CACHE) {
    const cached = await env.CACHE.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const result = await env.DB.prepare(
    'SELECT * FROM categories WHERE handle = ?'
  )
    .bind(handle)
    .first();

  const category = result as Category | null;

  // Cache for 1 hour
  if (env.CACHE && category) {
    await env.CACHE.put(cacheKey, JSON.stringify(category), {
      expirationTtl: 3600
    });
  }

  return category;
}

/**
 * Get products in a collection/category
 */
export async function getCollectionProducts(
  { env }: { env: Env },
  params: GetCollectionParams
): Promise<CollectionWithProducts | null> {
  const {
    handle,
    page = 1,
    limit = 24,
    sortBy = 'newest',
    brandId
  } = params;

  // Get category
  const category = await getCategoryByHandle({ env }, handle);
  if (!category) {
    return null;
  }

  const offset = (page - 1) * limit;

  // Build query based on sort with whitelist validation
  const validatedSortBy = validateSortBy(sortBy);
  let orderBy = 'created_at DESC';
  switch (validatedSortBy) {
    case 'price-asc':
      orderBy = 'price ASC';
      break;
    case 'price-desc':
      orderBy = 'price DESC';
      break;
    case 'name':
      orderBy = 'title ASC';
      break;
    case 'newest':
      orderBy = 'created_at DESC';
      break;
  }

  // Query products
  // Note: In a real implementation, you'd have a product_categories join table
  // For now, we'll use metadata to filter by category
  let query = `
    SELECT * FROM products
    WHERE json_extract(metadata, '$.category') = ?
  `;
  const queryParams: any[] = [handle];

  if (brandId) {
    query += ' AND brand_id = ?';
    queryParams.push(brandId);
  }

  query += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  const result = await env.DB.prepare(query)
    .bind(...queryParams)
    .all();

  const products = result.results as unknown as Product[];

  // Get total count
  let countQuery = `
    SELECT COUNT(*) as count FROM products
    WHERE json_extract(metadata, '$.category') = ?
  `;
  const countParams: any[] = [handle];

  if (brandId) {
    countQuery += ' AND brand_id = ?';
    countParams.push(brandId);
  }

  const countResult = await env.DB.prepare(countQuery)
    .bind(...countParams)
    .first();

  const totalProducts = (countResult as any)?.count || 0;

  return {
    category,
    products,
    totalProducts
  };
}

/**
 * Get featured collections
 */
export async function getFeaturedCollections(
  { env }: { env: Env },
  brandId?: string,
  limit: number = 3
): Promise<Category[]> {
  const cacheKey = `featured-collections:${brandId || 'all'}`;

  // Try cache first
  if (env.CACHE) {
    const cached = await env.CACHE.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  // Query database - get categories marked as featured or just return first N
  const query = `
    SELECT * FROM categories
    ORDER BY name ASC
    LIMIT ?
  `;

  const result = await env.DB.prepare(query)
    .bind(limit)
    .all();

  const collections = result.results as unknown as Category[];

  // Cache for 1 hour
  if (env.CACHE) {
    await env.CACHE.put(cacheKey, JSON.stringify(collections), {
      expirationTtl: 3600
    });
  }

  return collections;
}
