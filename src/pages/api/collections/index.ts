/**
 * Collections API Endpoint
 * GET /api/collections - List all collections/categories
 */

import type { APIRoute } from 'astro';
import { getCategories } from '@/lib/api/collections';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const env = (locals as any).runtime?.env || locals.env;

    if (!env?.DB) {
      return new Response(
        JSON.stringify({
          error: 'Database not configured',
          collections: []
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const categories = await getCategories({ env });

    return new Response(
      JSON.stringify({
        collections: categories,
        count: categories.length
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        }
      }
    );
  } catch (error) {
    console.error('Collections API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch collections',
        collections: []
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
