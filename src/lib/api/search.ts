/**
 * Search API
 * Functions for searching products with full-text search
 */

import type { Product } from '../db/schema';

export interface Env {
  DB: D1Database;
  CACHE?: KVNamespace;
}

export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
  brandId?: string;
  categoryHandle?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'relevance' | 'newest' | 'price-asc' | 'price-desc' | 'name';
}

export interface SearchResult {
  products: Product[];
  total: number;
  query: string;
  suggestions?: string[];
}

/**
 * Search products by query
 */
export async function searchProducts(
  { env }: { env: Env },
  params: SearchParams
): Promise<SearchResult> {
  const {
    query,
    page = 1,
    limit = 24,
    brandId,
    categoryHandle,
    minPrice,
    maxPrice,
    sortBy = 'relevance'
  } = params;

  const offset = (page - 1) * limit;

  // Build WHERE clause
  const conditions: string[] = [];
  const queryParams: any[] = [];

  // Full-text search on title and description
  if (query && query.trim()) {
    conditions.push(
      `(title LIKE ? OR description LIKE ?)`
    );
    const searchPattern = `%${query.trim()}%`;
    queryParams.push(searchPattern, searchPattern);
  }

  // Brand filter
  if (brandId) {
    conditions.push('brand_id = ?');
    queryParams.push(brandId);
  }

  // Category filter
  if (categoryHandle) {
    conditions.push(`json_extract(metadata, '$.category') = ?`);
    queryParams.push(categoryHandle);
  }

  // Price range filter
  if (minPrice !== undefined) {
    conditions.push('price >= ?');
    queryParams.push(minPrice * 100); // Convert to cents
  }

  if (maxPrice !== undefined) {
    conditions.push('price <= ?');
    queryParams.push(maxPrice * 100); // Convert to cents
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  // Determine sort order
  let orderBy = 'created_at DESC';
  switch (sortBy) {
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
    case 'relevance':
      // For relevance, we could implement a scoring system
      // For now, just use title match priority
      orderBy = 'title ASC';
      break;
  }

  // Query products
  const searchQuery = `
    SELECT * FROM products
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  const result = await env.DB.prepare(searchQuery)
    .bind(...queryParams, limit, offset)
    .all();

  const products = result.results as Product[];

  // Get total count
  const countQuery = `
    SELECT COUNT(*) as count FROM products
    ${whereClause}
  `;

  const countResult = await env.DB.prepare(countQuery)
    .bind(...queryParams)
    .first();

  const total = (countResult as any)?.count || 0;

  return {
    products,
    total,
    query: query || ''
  };
}

/**
 * Get search suggestions based on query
 */
export async function getSearchSuggestions(
  { env }: { env: Env },
  query: string,
  limit: number = 5
): Promise<string[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchPattern = `${query.trim()}%`;

  const result = await env.DB.prepare(`
    SELECT DISTINCT title FROM products
    WHERE title LIKE ?
    ORDER BY title ASC
    LIMIT ?
  `)
    .bind(searchPattern, limit)
    .all();

  return (result.results as any[]).map(r => r.title);
}

/**
 * Get popular search terms
 * In a real implementation, this would track search analytics
 */
export async function getPopularSearches(
  { env }: { env: Env },
  limit: number = 10
): Promise<string[]> {
  // For now, return some common categories/product types
  // In production, this would query a search analytics table
  return [
    'dresses',
    'tops',
    'jeans',
    'accessories',
    'shoes',
    'jackets',
    'sweaters',
    'skirts'
  ].slice(0, limit);
}
