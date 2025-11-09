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
