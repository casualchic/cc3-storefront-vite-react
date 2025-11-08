/**
 * HTML Sanitization Utilities
 * Provides safe HTML rendering to prevent XSS attacks
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content for safe rendering
 * Allows basic formatting tags but strips dangerous content
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'b', 'i',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'span', 'div',
    ],
    ALLOWED_ATTR: ['href', 'class', 'id'],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SAFE_FOR_TEMPLATES: true,
  });
}

/**
 * Sanitize product description - stricter than general HTML
 * Only allows text formatting, no links or complex structures
 */
export function sanitizeProductDescription(description: string): string {
  return DOMPurify.sanitize(description, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'b', 'i',
      'ul', 'ol', 'li',
    ],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SAFE_FOR_TEMPLATES: true,
  });
}

/**
 * Strip all HTML tags and return plain text
 */
export function stripHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize search query - strips all HTML
 */
export function sanitizeSearchQuery(query: string): string {
  return stripHTML(query).trim();
}
