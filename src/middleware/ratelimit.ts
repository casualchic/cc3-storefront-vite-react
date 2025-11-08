/**
 * Rate Limiting Middleware
 * Implements per-IP rate limiting to prevent DoS attacks
 * Uses Cloudflare KV for distributed rate limiting
 */

import type { MiddlewareHandler } from 'astro';

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

// Rate limit configurations for different endpoints
const rateLimits: Record<string, RateLimitConfig> = {
  '/api/search': { windowMs: 60000, maxRequests: 30 },  // 30 req/min
  '/api/products': { windowMs: 60000, maxRequests: 60 }, // 60 req/min
  '/api/collections': { windowMs: 60000, maxRequests: 60 }, // 60 req/min
  'default': { windowMs: 60000, maxRequests: 100 }, // 100 req/min default
};

/**
 * Get client IP address from request
 */
function getClientIP(request: Request): string {
  const cfConnectingIP = request.headers.get('CF-Connecting-IP');
  const xForwardedFor = request.headers.get('X-Forwarded-For');
  const xRealIP = request.headers.get('X-Real-IP');

  return cfConnectingIP ||
         (xForwardedFor?.split(',')[0].trim()) ||
         xRealIP ||
         'unknown';
}

/**
 * Get rate limit config for endpoint
 */
function getRateLimitConfig(pathname: string): RateLimitConfig {
  // Find matching rate limit config
  for (const [path, config] of Object.entries(rateLimits)) {
    if (path !== 'default' && pathname.startsWith(path)) {
      return config;
    }
  }
  return rateLimits.default;
}

/**
 * Rate limiting middleware
 */
export const rateLimit: MiddlewareHandler = async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);

  // Skip rate limiting for static assets
  if (url.pathname.startsWith('/_astro/') ||
      url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf)$/)) {
    return next();
  }

  // Skip rate limiting in development
  if (import.meta.env.DEV) {
    return next();
  }

  const clientIP = getClientIP(request);
  const config = getRateLimitConfig(url.pathname);

  // Get runtime env for KV access
  const runtime = (context.locals as any).runtime;
  const env = runtime?.env;

  if (!env?.CACHE) {
    // If KV is not available, allow the request but log warning
    console.warn('Rate limiting KV not available, skipping rate limit check');
    return next();
  }

  const now = Date.now();
  const windowStart = now - config.windowMs;
  const key = `ratelimit:${clientIP}:${url.pathname}`;

  try {
    // Get current request count from KV
    const stored = await env.CACHE.get(key);
    let requestData: { count: number; resetAt: number } = stored
      ? JSON.parse(stored)
      : { count: 0, resetAt: now + config.windowMs };

    // Reset if window has expired
    if (now >= requestData.resetAt) {
      requestData = { count: 1, resetAt: now + config.windowMs };
    } else {
      requestData.count++;
    }

    // Check if rate limit exceeded
    if (requestData.count > config.maxRequests) {
      const retryAfter = Math.ceil((requestData.resetAt - now) / 1000);

      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `Too many requests. Please try again in ${retryAfter} seconds.`,
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': requestData.resetAt.toString(),
          },
        }
      );
    }

    // Store updated request count
    const ttl = Math.ceil((requestData.resetAt - now) / 1000);
    await env.CACHE.put(key, JSON.stringify(requestData), {
      expirationTtl: ttl,
    });

    // Add rate limit headers to response
    const response = await next();
    const remaining = Math.max(0, config.maxRequests - requestData.count);

    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', requestData.resetAt.toString());

    return response;
  } catch (error) {
    // On error, allow the request but log the error
    console.error('Rate limiting error:', error);
    return next();
  }
};
