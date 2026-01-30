// Mock discount codes for CartDrawer
// In future: replace with Medusa.js discount service

export interface DiscountCode {
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  active: boolean;
}

const DISCOUNT_CODES: DiscountCode[] = [
  {
    code: 'SAVE10',
    description: '10% off your order',
    type: 'percentage',
    value: 10,
    active: true,
  },
  {
    code: 'WELCOME20',
    description: '20% off for new customers',
    type: 'percentage',
    value: 20,
    minPurchase: 50,
    active: true,
  },
  {
    code: 'FLASH15',
    description: '15% off flash sale',
    type: 'percentage',
    value: 15,
    maxDiscount: 30,
    active: true,
  },
];

export interface DiscountValidationResult {
  valid: boolean;
  error?: string;
  discount?: DiscountCode;
}

/**
 * Validates a discount code
 * @param code - The discount code to validate
 * @returns Validation result with discount details if valid
 */
export const validateDiscountCode = (code: string): DiscountValidationResult => {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return {
      valid: false,
      error: 'Please enter a discount code',
    };
  }

  const discount = DISCOUNT_CODES.find(
    (d) => d.code === normalizedCode && d.active
  );

  if (!discount) {
    return {
      valid: false,
      error: 'Invalid discount code',
    };
  }

  return {
    valid: true,
    discount,
  };
};

/**
 * Calculates the discount amount for a given subtotal
 * @param discount - The discount code to apply
 * @param subtotal - The cart subtotal
 * @returns The discount amount (positive number to subtract from subtotal)
 */
export const calculateDiscount = (
  discount: DiscountCode,
  subtotal: number
): number => {
  // Check minimum purchase requirement
  if (discount.minPurchase && subtotal < discount.minPurchase) {
    return 0;
  }

  let discountAmount = 0;

  if (discount.type === 'percentage') {
    discountAmount = (subtotal * discount.value) / 100;
  } else {
    discountAmount = discount.value;
  }

  // Apply maximum discount cap if specified
  if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
    discountAmount = discount.maxDiscount;
  }

  // Ensure discount doesn't exceed subtotal
  return Math.min(discountAmount, subtotal);
};

/**
 * Gets a discount code by its code string
 * @param code - The discount code string
 * @returns The discount code object or undefined
 */
export const getDiscountByCode = (code: string): DiscountCode | undefined => {
  const normalizedCode = code.trim().toUpperCase();
  return DISCOUNT_CODES.find(
    (d) => d.code === normalizedCode && d.active
  );
};
