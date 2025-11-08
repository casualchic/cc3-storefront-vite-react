/**
 * Search API Endpoint
 * GET /api/search?q=query&page=1&limit=24
 */

import type { APIRoute } from 'astro';
import { searchProducts, getSearchSuggestions } from '@/lib/api/search';

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

    // Parse query parameters
    const query = url.searchParams.get('q') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '24');
    const sortBy = (url.searchParams.get('sort') || 'relevance') as any;
    const brandId = url.searchParams.get('brand') || undefined;
    const category = url.searchParams.get('category') || undefined;
    const minPrice = url.searchParams.get('minPrice')
      ? parseFloat(url.searchParams.get('minPrice')!)
      : undefined;
    const maxPrice = url.searchParams.get('maxPrice')
      ? parseFloat(url.searchParams.get('maxPrice')!)
      : undefined;
    const getSuggestions = url.searchParams.get('suggestions') === 'true';

    // Get suggestions if requested
    if (getSuggestions && query) {
      const suggestions = await getSearchSuggestions({ env }, query);
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

    // Search products
    const result = await searchProducts({ env }, {
      query,
      page,
      limit,
      sortBy,
      brandId,
      categoryHandle: category,
      minPrice,
      maxPrice
    });

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
