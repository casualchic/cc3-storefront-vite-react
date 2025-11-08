/**
 * Zod validation schemas for API endpoints
 * Provides runtime type validation and sanitization
 */

import { z } from 'zod';

/**
 * Common validation schemas
 */

// Pagination parameters
export const paginationSchema = z.object({
  page: z.number().int().positive().max(1000).default(1),
  limit: z.number().int().positive().max(100).default(24),
  offset: z.number().int().nonnegative().max(10000).default(0),
});

// Sort options
export const searchSortSchema = z.enum(['relevance', 'newest', 'price-asc', 'price-desc', 'name']).default('relevance');
export const collectionSortSchema = z.enum(['newest', 'price-asc', 'price-desc', 'name']).default('newest');

// Price range
export const priceRangeSchema = z.object({
  minPrice: z.number().nonnegative().max(1000000).optional(),
  maxPrice: z.number().nonnegative().max(1000000).optional(),
}).refine(
  (data) => !data.minPrice || !data.maxPrice || data.minPrice <= data.maxPrice,
  { message: 'minPrice must be less than or equal to maxPrice' }
);

// Search query
export const searchQuerySchema = z.string().trim().min(1).max(200);

// Product handle
export const handleSchema = z.string().trim().min(1).max(200).regex(/^[a-z0-9-]+$/);

// Brand ID
export const brandIdSchema = z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/);

/**
 * API endpoint validation schemas
 */

// Search products
export const searchProductsParamsSchema = z.object({
  query: searchQuerySchema,
  page: z.number().int().positive().max(1000),
  limit: z.number().int().positive().max(100),
  sortBy: searchSortSchema,
  brandId: brandIdSchema.optional(),
  categoryHandle: handleSchema.optional(),
  minPrice: z.number().nonnegative().max(1000000).optional(),
  maxPrice: z.number().nonnegative().max(1000000).optional(),
}).refine(
  (data) => !data.minPrice || !data.maxPrice || data.minPrice <= data.maxPrice,
  { message: 'minPrice must be less than or equal to maxPrice' }
);

// Get products
export const getProductsParamsSchema = z.object({
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().max(10000).default(0),
  brandId: brandIdSchema.optional(),
});

// Get collection products
export const getCollectionProductsParamsSchema = z.object({
  handle: handleSchema,
  page: z.number().int().positive().max(1000),
  limit: z.number().int().positive().max(100),
  sortBy: collectionSortSchema,
  brandId: brandIdSchema.optional(),
});

// Search suggestions
export const searchSuggestionsParamsSchema = z.object({
  query: searchQuerySchema,
  limit: z.number().int().positive().max(20).default(5),
});

/**
 * Helper function to safely parse URL search params as numbers
 */
export function parseNumericParam(value: string | null, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Helper function to safely parse URL search params as floats
 */
export function parseFloatParam(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Validation result type
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; details?: z.ZodError };

/**
 * Safe validation wrapper that returns a result object
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: `${firstError.path.join('.')}: ${firstError.message}`,
        details: error,
      };
    }
    return {
      success: false,
      error: 'Validation failed',
    };
  }
}
