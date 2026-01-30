// Mock product recommendations for CartDrawer cross-sell
// In future: replace with Medusa.js recommendation engine

import { CartItem } from '../types';

/**
 * Mapping of product IDs to recommended product IDs
 * Key: product ID in cart
 * Value: array of recommended product IDs
 */
const RECOMMENDATION_MAP: Record<string, string[]> = {
  // Women's Tops recommendations
  'prod-001': ['prod-007', 'prod-016', 'prod-017'], // White Blouse -> Jeans, Tote, Earrings
  'prod-002': ['prod-007', 'prod-017', 'prod-019'], // Silk Camisole -> Jeans, Earrings, Scarf
  'prod-003': ['prod-008', 'prod-016', 'prod-018'], // Linen Shirt -> Trousers, Tote, Hat

  // Women's Dresses recommendations
  'prod-004': ['prod-016', 'prod-017', 'prod-009'], // Floral Maxi -> Tote, Earrings, Jacket
  'prod-005': ['prod-017', 'prod-009', 'prod-016'], // LBD -> Earrings, Jacket, Tote
  'prod-006': ['prod-009', 'prod-019', 'prod-017'], // Wrap Dress -> Jacket, Scarf, Earrings

  // Women's Bottoms recommendations
  'prod-007': ['prod-001', 'prod-003', 'prod-016'], // Jeans -> Blouse, Linen Shirt, Tote
  'prod-008': ['prod-001', 'prod-002', 'prod-009'], // Trousers -> Blouse, Camisole, Jacket

  // Women's Outerwear recommendations
  'prod-009': ['prod-005', 'prod-007', 'prod-019'], // Leather Jacket -> LBD, Jeans, Scarf
  'prod-010': ['prod-006', 'prod-007', 'prod-019'], // Trench Coat -> Wrap Dress, Jeans, Scarf

  // Men's Shirts recommendations
  'prod-011': ['prod-014', 'prod-016'], // Oxford Shirt -> Chinos, Tote
  'prod-012': ['prod-015', 'prod-018'], // Linen Shirt -> Jeans, Hat
  'prod-013': ['prod-014', 'prod-015'], // Chambray Shirt -> Chinos, Jeans

  // Men's Pants recommendations
  'prod-014': ['prod-011', 'prod-013', 'prod-016'], // Chinos -> Oxford, Chambray, Tote
  'prod-015': ['prod-011', 'prod-012', 'prod-018'], // Jeans -> Oxford, Linen, Hat

  // Accessories recommendations
  'prod-016': ['prod-001', 'prod-004', 'prod-011'], // Tote -> Blouse, Dress, Oxford
  'prod-017': ['prod-002', 'prod-005', 'prod-019'], // Earrings -> Camisole, LBD, Scarf
  'prod-018': ['prod-003', 'prod-012', 'prod-015'], // Hat -> Linen Shirt, Linen Shirt, Jeans
  'prod-019': ['prod-006', 'prod-009', 'prod-010'], // Scarf -> Wrap Dress, Jacket, Trench
  'prod-020': ['prod-001', 'prod-005', 'prod-017'], // Crossbody -> Blouse, LBD, Earrings
};

/**
 * Gets product recommendations based on items in cart
 * Aggregates recommendations from all cart items, deduplicates,
 * excludes items already in cart, and limits to specified count
 *
 * @param cartItems - Array of cart items
 * @param limit - Maximum number of recommendations to return (default: 8)
 * @returns Array of recommended product IDs
 */
export const getRecommendations = (
  cartItems: CartItem[],
  limit: number = 8
): string[] => {
  if (cartItems.length === 0) {
    return [];
  }

  // Get product IDs currently in cart
  const cartProductIds = new Set(cartItems.map((item) => item.productId));

  // Aggregate all recommendations from cart items
  const allRecommendations = cartItems.flatMap(
    (item) => RECOMMENDATION_MAP[item.productId] || []
  );

  // Deduplicate and filter out items already in cart
  const uniqueRecommendations = Array.from(new Set(allRecommendations)).filter(
    (productId) => !cartProductIds.has(productId)
  );

  // Limit to specified count
  return uniqueRecommendations.slice(0, limit);
};

/**
 * Gets recommendations for a single product
 * @param productId - The product ID
 * @returns Array of recommended product IDs
 */
export const getRecommendationsForProduct = (productId: string): string[] => {
  return RECOMMENDATION_MAP[productId] || [];
};
