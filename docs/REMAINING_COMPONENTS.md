# Remaining Checkout Components

This document contains the code for all remaining checkout components. Copy each section into the appropriate file.

## 1. ShippingSection.tsx

**File**: `src/components/react/checkout/sections/ShippingSection.tsx`

```tsx
/**
 * Shipping Section
 * Address collection step
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  shippingAddressSchema,
  type ShippingAddressFormData,
  US_STATES,
} from '../../../../lib/validation/checkout-schemas';
import type { AddressInput } from '../../../../lib/types/medusa';

interface ShippingSectionProps {
  isActive: boolean;
  isComplete: boolean;
  onSubmit: (address: AddressInput) => Promise<void>;
  initialAddress: AddressInput | null;
  sameAsBilling: boolean;
  onSameAsBillingChange: (value: boolean) => void;
  onEdit: () => void;
}

export default function ShippingSection({
  isActive,
  isComplete,
  onSubmit,
  initialAddress,
  sameAsBilling,
  onSameAsBillingChange,
  onEdit,
}: ShippingSectionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: initialAddress || {
      country_code: 'US',
    },
  });

  const handleFormSubmit = async (data: ShippingAddressFormData) => {
    await onSubmit(data);
  };

  // Completed state
  if (isComplete && !isActive) {
    const addr = initialAddress;
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Shipping Address</h2>
            <p className="text-gray-600">
              {addr?.first_name} {addr?.last_name}
              <br />
              {addr?.address_1}
              {addr?.address_2 && (
                <>
                  <br />
                  {addr.address_2}
                </>
              )}
              <br />
              {addr?.city}, {addr?.province} {addr?.postal_code}
            </p>
          </div>
          <button onClick={onEdit} className="text-primary hover:text-sage font-medium text-sm">
            Edit
          </button>
        </div>
      </div>
    );
  }

  // Active state
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('first_name')}
              type="text"
              id="first_name"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.first_name ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="given-name"
            />
            {errors.first_name && (
              <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('last_name')}
              type="text"
              id="last_name"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.last_name ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="family-name"
            />
            {errors.last_name && (
              <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="address_1" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            {...register('address_1')}
            type="text"
            id="address_1"
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.address_1 ? 'border-red-500' : 'border-gray-300'
            }`}
            autoComplete="address-line1"
          />
          {errors.address_1 && (
            <p className="mt-1 text-sm text-red-600">{errors.address_1.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="address_2" className="block text-sm font-medium text-gray-700 mb-1">
            Apartment, suite, etc. (optional)
          </label>
          <input
            {...register('address_2')}
            type="text"
            id="address_2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            autoComplete="address-line2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              {...register('city')}
              type="text"
              id="city"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="address-level2"
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
          </div>

          <div>
            <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select
              {...register('province')}
              id="province"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.province ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="address-level1"
            >
              <option value="">Select state</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              {...register('postal_code')}
              type="text"
              id="postal_code"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.postal_code ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="postal-code"
            />
            {errors.postal_code && (
              <p className="mt-1 text-sm text-red-600">{errors.postal_code.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone (optional)
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="sameAsBilling"
            checked={sameAsBilling}
            onChange={(e) => onSameAsBillingChange(e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="sameAsBilling" className="text-sm text-gray-700">
            Billing address same as shipping
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Continue to Shipping Method'}
        </button>
      </form>
    </div>
  );
}
```

---

## 2. ShippingMethodSection.tsx

**File**: `src/components/react/checkout/sections/ShippingMethodSection.tsx`

```tsx
/**
 * Shipping Method Section
 * Select shipping speed/carrier
 */

import { useState, useEffect } from 'react';
import { useCheckout } from '../../../../lib/medusa/hooks/useCheckout';
import type { ShippingOption } from '../../../../lib/types/medusa';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ShippingMethodSectionProps {
  isActive: boolean;
  isComplete: boolean;
  onSubmit: (optionId: string) => Promise<void>;
  selectedOption: string;
  onEdit: () => void;
}

export default function ShippingMethodSection({
  isActive,
  isComplete,
  onSubmit,
  selectedOption,
  onEdit,
}: ShippingMethodSectionProps) {
  const checkout = useCheckout();
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(selectedOption);

  useEffect(() => {
    if (isActive) {
      loadShippingOptions();
    }
  }, [isActive]);

  const loadShippingOptions = async () => {
    setLoading(true);
    const shippingOptions = await checkout.getShippingOptions();
    setOptions(shippingOptions);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      await onSubmit(selected);
    }
  };

  const formatPrice = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'Free';
    return `$${(amount / 100).toFixed(2)}`;
  };

  // Completed state
  if (isComplete && !isActive) {
    const selectedOptionData = options.find((opt) => opt.id === selectedOption);
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Shipping Method</h2>
            <p className="text-gray-600">
              {selectedOptionData?.name} - {formatPrice(selectedOptionData?.amount)}
            </p>
          </div>
          <button onClick={onEdit} className="text-primary hover:text-sage font-medium text-sm">
            Edit
          </button>
        </div>
      </div>
    );
  }

  // Active state
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Method</h2>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Loading shipping options...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {options.map((option) => (
            <label
              key={option.id}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                selected === option.id
                  ? 'border-primary bg-primary bg-opacity-5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="shipping_method"
                  value={option.id}
                  checked={selected === option.id}
                  onChange={(e) => setSelected(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{option.name}</p>
                  {option.data?.description && (
                    <p className="text-sm text-gray-500">{option.data.description as string}</p>
                  )}
                </div>
              </div>
              <span className="font-semibold text-gray-900">{formatPrice(option.amount)}</span>
            </label>
          ))}

          <button
            type="submit"
            disabled={!selected || checkout.isProcessing}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {checkout.isProcessing ? 'Processing...' : 'Continue to Payment'}
          </button>
        </form>
      )}
    </div>
  );
}
```

---

## 3. PaymentSection.tsx

**File**: `src/components/react/checkout/sections/PaymentSection.tsx`

```tsx
/**
 * Payment Section
 * Stripe payment collection (placeholder - full Stripe integration in next phase)
 */

import { useState, useEffect } from 'react';
import { useCheckout } from '../../../../lib/medusa/hooks/useCheckout';
import LoadingSpinner from '../ui/LoadingSpinner';

interface PaymentSectionProps {
  isActive: boolean;
  isComplete: boolean;
  onInitialized: () => void;
  onEdit: () => void;
}

export default function PaymentSection({
  isActive,
  isComplete,
  onInitialized,
  onEdit,
}: PaymentSectionProps) {
  const checkout = useCheckout();
  const [initializing, setInitializing] = useState(true);
  const [paymentReady, setPaymentReady] = useState(false);

  useEffect(() => {
    if (isActive) {
      initializePayment();
    }
  }, [isActive]);

  const initializePayment = async () => {
    setInitializing(true);
    try {
      await checkout.initializePaymentSessions();
      await checkout.selectPaymentProvider('stripe');
      setPaymentReady(true);
    } catch (error) {
      console.error('Failed to initialize payment:', error);
    } finally {
      setInitializing(false);
    }
  };

  const handleContinue = () => {
    onInitialized();
  };

  // Completed state
  if (isComplete && !isActive) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Payment</h2>
            <p className="text-gray-600">Payment method selected</p>
          </div>
          <button onClick={onEdit} className="text-primary hover:text-sage font-medium text-sm">
            Edit
          </button>
        </div>
      </div>
    );
  }

  // Active state
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>

      {initializing ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Initializing payment...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* TODO: Integrate Stripe Payment Element here */}
          <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">
              Stripe Payment Element will be integrated here
            </p>
            <p className="text-sm text-gray-500">
              For now, payment will be processed on order completion
            </p>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secure SSL encrypted payment</span>
          </div>

          <button
            onClick={handleContinue}
            disabled={!paymentReady}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Review
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 4. OrderReview.tsx

**File**: `src/components/react/checkout/sections/OrderReview.tsx`

```tsx
/**
 * Order Review Section
 * Final review and place order
 */

import type { Cart, AddressInput } from '../../../../lib/types/medusa';
import ErrorMessage from '../ui/ErrorMessage';

interface OrderReviewProps {
  isActive: boolean;
  email: string;
  shippingAddress: AddressInput | null;
  cart: Cart;
  onSubmit: () => Promise<void>;
  isProcessing: boolean;
  error: string | null;
}

export default function OrderReview({
  isActive,
  email,
  shippingAddress,
  cart,
  onSubmit,
  isProcessing,
  error,
}: OrderReviewProps) {
  if (!isActive) return null;

  const formatPrice = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '$0.00';
    return `$${(amount / 100).toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Order</h2>

      {error && <ErrorMessage message={error} className="mb-4" />}

      <div className="space-y-4 mb-6">
        <div>
          <h3 className="font-medium text-gray-900 mb-1">Contact</h3>
          <p className="text-gray-600">{email}</p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-1">Ship to</h3>
          <p className="text-gray-600">
            {shippingAddress?.first_name} {shippingAddress?.last_name}
            <br />
            {shippingAddress?.address_1}
            {shippingAddress?.address_2 && (
              <>
                <br />
                {shippingAddress.address_2}
              </>
            )}
            <br />
            {shippingAddress?.city}, {shippingAddress?.province} {shippingAddress?.postal_code}
          </p>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-1">Shipping method</h3>
          <p className="text-gray-600">
            {cart.shipping_methods?.[0]?.shipping_option?.name || 'Standard Shipping'}
          </p>
        </div>
      </div>

      <div className="border-t pt-4 space-y-2 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(cart.subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{formatPrice(cart.shipping_total)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>{formatPrice(cart.tax_total)}</span>
        </div>
        {cart.discount_total && cart.discount_total > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(cart.discount_total)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
          <span>Total</span>
          <span>{formatPrice(cart.total)}</span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isProcessing}
        className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {isProcessing ? 'Processing...' : `Place Order · ${formatPrice(cart.total)}`}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        By placing your order, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
```

---

## 5. OrderSummary.tsx

**File**: `src/components/react/checkout/OrderSummary.tsx`

```tsx
/**
 * Order Summary
 * Cart summary sidebar
 */

import type { Cart } from '../../../lib/types/medusa';

interface OrderSummaryProps {
  cart: Cart;
}

export default function OrderSummary({ cart }: OrderSummaryProps) {
  const formatPrice = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '$0.00';
    return `$${(amount / 100).toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

      {/* Line Items */}
      <div className="space-y-4 mb-6">
        {cart.items?.map((item) => (
          <div key={item.id} className="flex space-x-4">
            {item.thumbnail && (
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              {item.variant?.title && (
                <p className="text-sm text-gray-500">{item.variant.title}</p>
              )}
              <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{formatPrice(item.total)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(cart.subtotal)}</span>
        </div>
        {cart.shipping_total !== null && cart.shipping_total !== undefined && (
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{formatPrice(cart.shipping_total)}</span>
          </div>
        )}
        {cart.tax_total !== null && cart.tax_total !== undefined && (
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>{formatPrice(cart.tax_total)}</span>
          </div>
        )}
        {cart.discount_total && cart.discount_total > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(cart.discount_total)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
          <span>Total</span>
          <span>{formatPrice(cart.total)}</span>
        </div>
      </div>
    </div>
  );
}
```

---

## 6. Success Page

**File**: `src/pages/checkout/success.astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';

const url = new URL(Astro.request.url);
const orderId = url.searchParams.get('order_id');
---

<BaseLayout title="Order Confirmed - Casual Chic Boutique">
  <main class="min-h-screen bg-neutral-50 py-16">
    <div class="container mx-auto px-4 max-w-2xl text-center">
      <div class="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <!-- Success Icon -->
        <div class="mb-6">
          <svg
            class="w-16 h-16 text-green-600 mx-auto"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Thank You for Your Order!
        </h1>

        <p class="text-gray-600 mb-6">
          We've received your order and will send you a confirmation email shortly.
        </p>

        {orderId && (
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <p class="text-sm text-gray-500 mb-1">Order Number</p>
            <p class="text-lg font-mono font-semibold text-gray-900">{orderId}</p>
          </div>
        )}

        <div class="space-y-3">
          <a
            href="/shop"
            class="block w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-sage transition-colors"
          >
            Continue Shopping
          </a>
          <a
            href="/"
            class="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Return to Home
          </a>
        </div>

        <div class="mt-8 pt-8 border-t">
          <h2 class="font-semibold text-gray-900 mb-2">What's Next?</h2>
          <ul class="text-sm text-gray-600 space-y-2 text-left max-w-md mx-auto">
            <li class="flex items-start">
              <svg class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Check your email for order confirmation
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              We'll email you when your order ships
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Track your shipment with the tracking link
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</BaseLayout>
```

---

## 7. Failed Page

**File**: `src/pages/checkout/failed.astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';

const url = new URL(Astro.request.url);
const error = url.searchParams.get('error') || 'Payment processing failed';
---

<BaseLayout title="Payment Failed - Casual Chic Boutique">
  <main class="min-h-screen bg-neutral-50 py-16">
    <div class="container mx-auto px-4 max-w-2xl text-center">
      <div class="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        <!-- Error Icon -->
        <div class="mb-6">
          <svg
            class="w-16 h-16 text-red-600 mx-auto"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Payment Failed
        </h1>

        <p class="text-gray-600 mb-2">
          We were unable to process your payment.
        </p>

        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-sm text-red-800">{error}</p>
        </div>

        <div class="space-y-3">
          <a
            href="/checkout"
            class="block w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-sage transition-colors"
          >
            Try Again
          </a>
          <a
            href="/shop"
            class="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </a>
        </div>

        <div class="mt-8 pt-8 border-t">
          <h2 class="font-semibold text-gray-900 mb-4">Need Help?</h2>
          <p class="text-sm text-gray-600 mb-4">
            If you continue to experience issues, please contact our support team.
          </p>
          <a
            href="/contact"
            class="text-primary hover:text-sage font-medium text-sm"
          >
            Contact Support →
          </a>
        </div>
      </div>
    </div>
  </main>
</BaseLayout>
```

---

## Implementation Instructions

1. Create each file in the specified location
2. Copy the code from this document
3. Ensure all imports are correct
4. Add environment variables to `.env` file
5. Configure Medusa backend as per `docs/medusa-backend-setup.md`
6. Test the complete flow

## Testing Checklist

- [ ] Cart loads on `/checkout`
- [ ] Email validation works
- [ ] Address form validation works
- [ ] Shipping options load
- [ ] Payment section initializes
- [ ] Order review displays all info
- [ ] Place order completes successfully
- [ ] Redirects to success page
- [ ] Cart clears after order

**Estimated Time**: 30-60 minutes to create all files and test basic flow
