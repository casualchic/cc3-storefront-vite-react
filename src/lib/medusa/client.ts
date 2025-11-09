/**
 * Medusa v2 Client
 * Configured SDK instance for communicating with Medusa v2 backend
 */

import Medusa from "@medusajs/js-sdk";

// Initialize Medusa v2 SDK
export const sdk = new Medusa({
  baseUrl: import.meta.env.PUBLIC_MEDUSA_API_URL || "http://localhost:9000",
  debug: import.meta.env.DEV,
  publishableKey: import.meta.env.PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});

/**
 * Get cart ID from localStorage
 */
export function getCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('cart_id');
}

/**
 * Set cart ID in localStorage
 */
export function setCartId(cartId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cart_id', cartId);
}

/**
 * Clear cart ID from localStorage
 */
export function clearCartId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('cart_id');
}
