/**
 * Middleware Entry Point
 * Combines all middleware handlers
 */

import { sequence } from 'astro:middleware';
import { securityHeaders } from './security';

export const onRequest = sequence(
  securityHeaders
);
