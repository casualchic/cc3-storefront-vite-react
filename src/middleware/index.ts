/**
 * Middleware Entry Point
 * Combines all middleware handlers
 */

import { sequence } from 'astro:middleware';
import { securityHeaders } from './security';
import { rateLimit } from './ratelimit';

export const onRequest = sequence(
  rateLimit,
  securityHeaders
);
