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
            {cart.shipping_methods?.[0]?.shipping_option_id || 'Standard Shipping'}
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
