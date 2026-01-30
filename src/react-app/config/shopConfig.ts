export const SHOP_CONFIG = {
  freeShippingThreshold: 75,
  currency: 'USD',
  currencySymbol: '$',
  maxQuantityPerItem: 10,
} as const;

export type ShopConfig = typeof SHOP_CONFIG;
