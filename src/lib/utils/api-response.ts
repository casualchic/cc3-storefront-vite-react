/**
 * Standardized API Response Utilities
 * Provides consistent error and success response formats
 */

export interface APIError {
  error: string;
  message: string;
  statusCode: number;
  timestamp?: string;
  path?: string;
}

export interface APISuccess<T = unknown> {
  data: T;
  meta?: Record<string, unknown>;
}

/**
 * Create a standardized error response
 */
export function errorResponse(
  error: string,
  message: string,
  statusCode: number = 500,
  additionalInfo?: Record<string, unknown>
): Response {
  const errorBody: APIError = {
    error,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    ...additionalInfo,
  };

  // Don't leak internal error details in production
  if (import.meta.env.PROD && statusCode === 500) {
    errorBody.message = 'An internal server error occurred';
  }

  return new Response(JSON.stringify(errorBody), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create a standardized success response
 */
export function successResponse<T>(
  data: T,
  meta?: Record<string, unknown>,
  statusCode: number = 200
): Response {
  const body: APISuccess<T> = { data };
  if (meta) {
    body.meta = meta;
  }

  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Common error responses
 */
export const ErrorResponses = {
  badRequest: (message: string = 'Invalid request parameters') =>
    errorResponse('BAD_REQUEST', message, 400),

  unauthorized: (message: string = 'Authentication required') =>
    errorResponse('UNAUTHORIZED', message, 401),

  forbidden: (message: string = 'Access denied') =>
    errorResponse('FORBIDDEN', message, 403),

  notFound: (message: string = 'Resource not found') =>
    errorResponse('NOT_FOUND', message, 404),

  rateLimitExceeded: (retryAfter: number) =>
    errorResponse(
      'RATE_LIMIT_EXCEEDED',
      `Too many requests. Please try again in ${retryAfter} seconds.`,
      429,
      { retryAfter }
    ),

  internalError: (message: string = 'Internal server error') =>
    errorResponse('INTERNAL_ERROR', message, 500),

  serviceUnavailable: (message: string = 'Service temporarily unavailable') =>
    errorResponse('SERVICE_UNAVAILABLE', message, 503),

  validationError: (message: string, details?: unknown) =>
    errorResponse('VALIDATION_ERROR', message, 400, { details }),
};
