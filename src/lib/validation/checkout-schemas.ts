/**
 * Checkout Form Validation Schemas
 * Zod schemas for all checkout forms
 */

import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email is too long'),
});

export type EmailFormData = z.infer<typeof emailSchema>;

/**
 * Shipping address validation schema
 */
export const shippingAddressSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),

  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),

  address_1: z
    .string()
    .min(1, 'Street address is required')
    .max(255, 'Address is too long'),

  address_2: z
    .string()
    .max(255, 'Address line 2 is too long')
    .optional()
    .or(z.literal('')),

  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City name is too long'),

  province: z
    .string()
    .min(1, 'State/Province is required')
    .max(100, 'State/Province is too long'),

  postal_code: z
    .string()
    .min(1, 'ZIP/Postal code is required')
    .max(20, 'Postal code is too long')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Invalid postal code format'),

  country_code: z
    .string()
    .length(2, 'Invalid country code')
    .toUpperCase()
    .default('US'),

  phone: z
    .string()
    .regex(/^[\d\s()+-]+$/, 'Invalid phone number')
    .min(10, 'Phone number is too short')
    .max(20, 'Phone number is too long')
    .optional()
    .or(z.literal('')),

  company: z
    .string()
    .max(100, 'Company name is too long')
    .optional()
    .or(z.literal('')),
});

export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;

/**
 * Billing address validation schema (same as shipping)
 */
export const billingAddressSchema = shippingAddressSchema;

export type BillingAddressFormData = z.infer<typeof billingAddressSchema>;

/**
 * Shipping method selection schema
 */
export const shippingMethodSchema = z.object({
  option_id: z.string().min(1, 'Please select a shipping method'),
});

export type ShippingMethodFormData = z.infer<typeof shippingMethodSchema>;

/**
 * Complete checkout form (for final validation)
 */
export const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  shipping_address: shippingAddressSchema,
  billing_address: billingAddressSchema.optional(),
  same_as_billing: z.boolean().default(true),
  shipping_method: z.string().min(1, 'Shipping method required'),
  payment_provider: z.string().min(1, 'Payment provider required'),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

/**
 * US State codes for validation
 */
export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC', 'AS', 'GU', 'MP', 'PR', 'VI'
] as const;

/**
 * Country codes
 */
export const COUNTRY_CODES = [
  'US', 'CA', 'GB', 'AU', 'NZ', 'FR', 'DE', 'IT', 'ES', 'JP'
] as const;
