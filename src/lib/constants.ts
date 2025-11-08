/**
 * Application Constants
 * Central location for all magic numbers and configuration values
 */

/**
 * Pagination Configuration
 */
export const PAGINATION = {
  /** Default number of items per page for product listings */
  DEFAULT_LIMIT: 24,
  /** Maximum allowed items per page (validation limit) */
  MAX_LIMIT: 100,
  /** Maximum page number allowed (validation limit) */
  MAX_PAGE: 1000,
  /** Maximum offset allowed (validation limit) */
  MAX_OFFSET: 10000,
  /** Maximum visible page buttons in pagination */
  MAX_VISIBLE_PAGES: 7,
} as const;

/**
 * Search Configuration
 */
export const SEARCH = {
  /** Minimum query length for search */
  MIN_QUERY_LENGTH: 2,
  /** Maximum query length */
  MAX_QUERY_LENGTH: 200,
  /** Debounce delay for search input (ms) */
  DEBOUNCE_DELAY: 300,
  /** Default number of search suggestions */
  DEFAULT_SUGGESTIONS_LIMIT: 5,
  /** Maximum number of search suggestions */
  MAX_SUGGESTIONS_LIMIT: 20,
} as const;

/**
 * Price Configuration
 */
export const PRICE = {
  /** Maximum price value (validation limit) */
  MAX_PRICE: 1000000,
  /** Cents per dollar for price conversion */
  CENTS_PER_DOLLAR: 100,
} as const;

/**
 * Rate Limiting Configuration
 */
export const RATE_LIMITS = {
  /** Time window in milliseconds */
  WINDOW_MS: 60000, // 1 minute
  /** Default max requests per window */
  DEFAULT_MAX_REQUESTS: 100,
  /** Max requests for search endpoint */
  SEARCH_MAX_REQUESTS: 30,
  /** Max requests for products endpoint */
  PRODUCTS_MAX_REQUESTS: 60,
  /** Max requests for collections endpoint */
  COLLECTIONS_MAX_REQUESTS: 60,
} as const;

/**
 * Cache Configuration
 */
export const CACHE = {
  /** Default cache TTL in seconds */
  DEFAULT_TTL: 3600, // 1 hour
  /** Product cache TTL in seconds */
  PRODUCT_TTL: 1800, // 30 minutes
  /** Collection cache TTL in seconds */
  COLLECTION_TTL: 3600, // 1 hour
  /** Search results cache TTL in seconds */
  SEARCH_TTL: 600, // 10 minutes
} as const;

/**
 * Security Headers Configuration
 */
export const SECURITY = {
  /** HSTS max age in seconds */
  HSTS_MAX_AGE: 31536000, // 1 year
  /** Content Security Policy directives */
  CSP_DIRECTIVES: {
    DEFAULT_SRC: "'self'",
    SCRIPT_SRC: "'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    STYLE_SRC: "'self' 'unsafe-inline'",
    IMG_SRC: "'self' data: https: blob:",
    FONT_SRC: "'self' data:",
    CONNECT_SRC: "'self' https://*.cloudflare.com",
    FRAME_ANCESTORS: "'none'",
    BASE_URI: "'self'",
    FORM_ACTION: "'self'",
  },
} as const;

/**
 * String Length Limits
 */
export const STRING_LIMITS = {
  /** Maximum handle length */
  MAX_HANDLE_LENGTH: 200,
  /** Minimum handle length */
  MIN_HANDLE_LENGTH: 1,
  /** Maximum brand ID length */
  MAX_BRAND_ID_LENGTH: 100,
  /** Minimum brand ID length */
  MIN_BRAND_ID_LENGTH: 1,
} as const;

/**
 * File Size Limits
 */
export const FILE_LIMITS = {
  /** Maximum image file size in bytes (5MB) */
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,
  /** Maximum thumbnail width */
  MAX_THUMBNAIL_WIDTH: 800,
  /** Maximum thumbnail height */
  MAX_THUMBNAIL_HEIGHT: 800,
} as const;

/**
 * UI Configuration
 */
export const UI = {
  /** Maximum characters before truncating text */
  MAX_TRUNCATE_LENGTH: 2000,
  /** Toast notification duration (ms) */
  TOAST_DURATION: 3000,
  /** Animation duration (ms) */
  ANIMATION_DURATION: 300,
} as const;

/**
 * Default Brand ID
 */
export const DEFAULT_BRAND_ID = 'casual-chic';

/**
 * Sort Options
 */
export const SORT_OPTIONS = {
  SEARCH: ['relevance', 'newest', 'price-asc', 'price-desc', 'name'] as const,
  COLLECTION: ['newest', 'price-asc', 'price-desc', 'name'] as const,
} as const;

/**
 * Regular Expression Patterns
 */
export const PATTERNS = {
  /** Handle pattern (lowercase alphanumeric and hyphens) */
  HANDLE: /^[a-z0-9-]+$/,
  /** Brand ID pattern (lowercase alphanumeric and hyphens) */
  BRAND_ID: /^[a-z0-9-]+$/,
  /** Email pattern */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;
