/**
 * Collection Products API Endpoint
 * GET /api/collections/:handle - Get products in a collection
 */

import type { APIRoute } from 'astro';
import { getCollectionProducts } from '@/lib/api/collections';

export const GET: APIRoute = async ({ params, url, locals }) => {
  try {
    const { handle } = params;

    if (!handle) {
      return new Response(
        JSON.stringify({ error: 'Collection handle required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const env = (locals as any).runtime?.env || locals.env;

    if (!env?.DB) {
      return new Response(
        JSON.stringify({
          error: 'Database not configured',
          collection: null,
          products: []
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse query parameters
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '24');
    const sortBy = (url.searchParams.get('sort') || 'newest') as any;
    const brandId = url.searchParams.get('brand') || undefined;

    const result = await getCollectionProducts({ env }, {
      handle,
      page,
      limit,
      sortBy,
      brandId
    });

    if (!result) {
      return new Response(
        JSON.stringify({ error: 'Collection not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        collection: result.category,
        products: result.products,
        totalProducts: result.totalProducts,
        page,
        limit,
        totalPages: Math.ceil(result.totalProducts / limit)
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300'
        }
      }
    );
  } catch (error) {
    console.error('Collection products API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch collection products',
        products: []
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
