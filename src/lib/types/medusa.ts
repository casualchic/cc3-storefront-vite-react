/**
 * Medusa v2 Types
 * TypeScript interfaces for Medusa v2 entities
 */

// Import v2 types from @medusajs/types
import type {
  StoreCart,
  StoreCartLineItem,
  StoreCartAddress,
  StoreCartShippingMethod
} from "@medusajs/types/dist/http/cart";
import type { StoreRegion } from "@medusajs/types/dist/http/region";
import type { StoreProduct, StoreProductVariant } from "@medusajs/types/dist/http/product";
import type { StoreOrder } from "@medusajs/types/dist/http/order";
import type { StoreCustomer } from "@medusajs/types/dist/http/customer";

// Re-export v2 types
export type Cart = StoreCart;
export type LineItem = StoreCartLineItem;
export type Order = StoreOrder;
export type ShippingOption = StoreCartShippingMethod;
export type Region = StoreRegion;
export type Product = StoreProduct;
export type ProductVariant = StoreProductVariant;
export type Address = StoreCartAddress;
export type Customer = StoreCustomer;

/**
 * Checkout state for multi-step form
 */
export interface CheckoutState {
  step: CheckoutStep;
  cart: Cart | null;
  email: string;
  shippingAddress: AddressInput | null;
  billingAddress: AddressInput | null;
  sameAsBilling: boolean;
  selectedShippingOption: string | null;
  selectedPaymentProvider: string | null;
  isProcessing: boolean;
  error: string | null;
}

export enum CheckoutStep {
  CONTACT = 'contact',
  SHIPPING = 'shipping',
  SHIPPING_METHOD = 'shipping_method',
  PAYMENT = 'payment',
  REVIEW = 'review',
}

/**
 * Address input for forms
 */
export interface AddressInput {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
  phone?: string;
  company?: string;
}

/**
 * Cart summary for display
 */
export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
}

/**
 * Payment provider option
 */
export interface PaymentProviderOption {
  id: string;
  name: string;
  icon?: string;
}
