import type { Product } from '@/lib/db/schema';

const CACHE_TTL = 60 * 5; // 5 minutes

export async function getProducts(
  runtime: {
    env: {
      DB: D1Database;
      PRODUCT_CACHE?: KVNamespace;
    };
  },
  options: {
    limit?: number;
    offset?: number;
    brandId?: string;
  } = {}
): Promise<{ products: Product[]; total: number }> {
  const { limit = 20, offset = 0, brandId } = options;
  const cacheKey = `products:${brandId || 'all'}:${limit}:${offset}`;

  // Try cache first (skip if KV not available in dev)
  if (runtime.env.PRODUCT_CACHE) {
    const cached = await runtime.env.PRODUCT_CACHE.get(cacheKey, 'json');
    if (cached) {
      return cached as { products: Product[]; total: number };
    }
  }

  // Query D1
  let query = 'SELECT * FROM products';
  const params: string[] = [];

  if (brandId) {
    query += ' WHERE brand_id = ?';
    params.push(brandId);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(String(limit), String(offset));

  const { results } = await runtime.env.DB.prepare(query)
    .bind(...params)
    .all();

  // Get total count
  let countQuery = 'SELECT COUNT(*) as total FROM products';
  if (brandId) {
    countQuery += ' WHERE brand_id = ?';
  }

  const countResult = await runtime.env.DB.prepare(countQuery)
    .bind(...(brandId ? [brandId] : []))
    .first();

  const result = {
    products: results as unknown as Product[],
    total: (countResult as { total: number })?.total || 0,
  };

  // Cache result (skip if KV not available in dev)
  if (runtime.env.PRODUCT_CACHE) {
    await runtime.env.PRODUCT_CACHE.put(cacheKey, JSON.stringify(result), {
      expirationTtl: CACHE_TTL,
    });
  }

  return result;
}

export async function getProductByHandle(
  runtime: {
    env: {
      DB: D1Database;
      PRODUCT_CACHE?: KVNamespace;
    };
  },
  handle: string
): Promise<Product | null> {
  const cacheKey = `product:${handle}`;

  // Try cache first (skip if KV not available in dev)
  if (runtime.env.PRODUCT_CACHE) {
    const cached = await runtime.env.PRODUCT_CACHE.get(cacheKey, 'json');
    if (cached) {
      return cached as Product;
    }
  }

  // Query D1
  const result = await runtime.env.DB.prepare(
    'SELECT * FROM products WHERE handle = ?'
  )
    .bind(handle)
    .first();

  if (!result) {
    return null;
  }

  const product = result as unknown as Product;

  // Cache result (skip if KV not available in dev)
  if (runtime.env.PRODUCT_CACHE) {
    await runtime.env.PRODUCT_CACHE.put(cacheKey, JSON.stringify(product), {
      expirationTtl: CACHE_TTL,
    });
  }

  return product;
}
