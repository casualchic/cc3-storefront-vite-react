/**
 * Security Headers Middleware
 * Adds security headers to all responses
 */

import type { MiddlewareHandler } from 'astro';
import { SECURITY } from '@/lib/constants';

export const securityHeaders: MiddlewareHandler = async (_context, next) => {
  const response = await next();

  // Content Security Policy
  const csp = [
    `default-src ${SECURITY.CSP_DIRECTIVES.DEFAULT_SRC}`,
    `script-src ${SECURITY.CSP_DIRECTIVES.SCRIPT_SRC}`,
    `style-src ${SECURITY.CSP_DIRECTIVES.STYLE_SRC}`,
    `img-src ${SECURITY.CSP_DIRECTIVES.IMG_SRC}`,
    `font-src ${SECURITY.CSP_DIRECTIVES.FONT_SRC}`,
    `connect-src ${SECURITY.CSP_DIRECTIVES.CONNECT_SRC}`,
    `frame-ancestors ${SECURITY.CSP_DIRECTIVES.FRAME_ANCESTORS}`,
    `base-uri ${SECURITY.CSP_DIRECTIVES.BASE_URI}`,
    `form-action ${SECURITY.CSP_DIRECTIVES.FORM_ACTION}`,
  ].join('; ');

  // Set security headers
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // HTTPS enforcement (in production)
  if (import.meta.env.PROD) {
    response.headers.set('Strict-Transport-Security', `max-age=${SECURITY.HSTS_MAX_AGE}; includeSubDomains; preload`);
  }

  return response;
};
