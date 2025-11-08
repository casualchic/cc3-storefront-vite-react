import type { APIRoute } from 'astro';
import { getProductByHandle } from '@/lib/api/products';

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const { handle } = params;

    if (!handle) {
      return new Response(
        JSON.stringify({ error: 'Product handle is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Get env from platformProxy in dev, runtime in production
    const env = (locals as any).runtime?.env;

    // In development without bindings, return 404
    if (!env || !env.DB) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const product = await getProductByHandle(
      { env },
      handle
    );

    if (!product) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // 5 minutes
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch product',
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
