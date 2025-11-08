/**
 * Search API Endpoint
 * GET /api/search?q=query&page=1&limit=24
 */

import type { APIRoute } from 'astro';
import { searchProducts, getSearchSuggestions } from '@/lib/api/search';
import {
  parseNumericParam,
  parseFloatParam,
  searchProductsParamsSchema,
  searchSuggestionsParamsSchema,
  validateData,
} from '@/lib/validation/schemas';

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const env = (locals as any).runtime?.env;

    if (!env?.DB) {
      return new Response(
        JSON.stringify({
          error: 'Database not configured',
          products: [],
          total: 0
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse query parameters safely
    const query = url.searchParams.get('q') || '';
    const getSuggestions = url.searchParams.get('suggestions') === 'true';

    // Get suggestions if requested
    if (getSuggestions && query) {
      const validationResult = validateData(searchSuggestionsParamsSchema, {
        query,
        limit: parseNumericParam(url.searchParams.get('limit'), 5),
      });

      if (!validationResult.success) {
        return new Response(
          JSON.stringify({
            error: 'Invalid parameters',
            message: validationResult.error,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      const suggestions = await getSearchSuggestions({ env }, validationResult.data.query, validationResult.data.limit);
      return new Response(
        JSON.stringify({ suggestions }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300'
          }
        }
      );
    }

    // Validate search parameters
    const validationResult = validateData(searchProductsParamsSchema, {
      query,
      page: parseNumericParam(url.searchParams.get('page'), 1),
      limit: parseNumericParam(url.searchParams.get('limit'), 24),
      sortBy: url.searchParams.get('sort') || 'relevance',
      brandId: url.searchParams.get('brand') || undefined,
      categoryHandle: url.searchParams.get('category') || undefined,
      minPrice: parseFloatParam(url.searchParams.get('minPrice')),
      maxPrice: parseFloatParam(url.searchParams.get('maxPrice')),
    });

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: 'Invalid parameters',
          message: validationResult.error,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Search products with validated params
    const result = await searchProducts({ env }, validationResult.data);

    const { page, limit } = validationResult.data;
    return new Response(
      JSON.stringify({
        ...result,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit)
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60'
        }
      }
    );
  } catch (error) {
    console.error('Search API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Search failed',
        products: [],
        total: 0
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
