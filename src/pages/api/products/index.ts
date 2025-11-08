import type { APIRoute } from 'astro';
import { getProducts } from '@/lib/api/products';
import {
  parseNumericParam,
  getProductsParamsSchema,
  validateData,
} from '@/lib/validation/schemas';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);

    // Validate input parameters
    const validationResult = validateData(getProductsParamsSchema, {
      limit: parseNumericParam(url.searchParams.get('limit'), 20),
      offset: parseNumericParam(url.searchParams.get('offset'), 0),
      brandId: url.searchParams.get('brand') || locals.brand || 'casual-chic',
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

    const { limit, offset, brandId } = validationResult.data;

    // Get env from platformProxy in dev, runtime in production
    const env = (locals as any).runtime?.env;

    // In development without bindings, return mock data
    if (!env || !env.DB) {
      const mockResult = {
        products: [],
        total: 0,
      };
      return new Response(JSON.stringify(mockResult), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
        },
      });
    }

    const result = await getProducts(
      { env },
      { limit, offset, brandId }
    );

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // 5 minutes
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
