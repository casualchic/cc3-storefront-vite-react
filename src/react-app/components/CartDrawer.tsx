import { useEffect, useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { X, ShoppingBag, Tag } from 'lucide-react';
import FocusTrap from 'focus-trap-react';
import { useCart } from '../context/CartContext';
import { CartItem } from './CartItem';
import { SHOP_CONFIG } from '../config/shopConfig';
import { ProductRecommendations } from './ProductRecommendations';
import { getRecommendations } from '../data/mockRecommendations';
import { Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const threshold = SHOP_CONFIG.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, (subtotal / threshold) * 100);
  const qualified = subtotal >= threshold;

  return (
    <div className="mb-4">
      {qualified ? (
        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
          <span>✓</span>
          <span>You qualify for FREE shipping! 🎉</span>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-600 mb-2">
            Add{' '}
            <span className="font-semibold text-orange-600">
              {SHOP_CONFIG.currencySymbol}
              {remaining.toFixed(2)}
            </span>{' '}
            more for <strong>FREE shipping!</strong>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-orange-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}

interface DiscountCodeInputProps {
  appliedDiscount: { code: string; amount: number; description: string } | null;
  onApply: (code: string) => { success: boolean; error?: string };
  onRemove: () => void;
}

function DiscountCodeInput({
  appliedDiscount,
  onApply,
  onRemove,
}: DiscountCodeInputProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleApply = () => {
    setError('');
    const result = onApply(code);

    if (result.success) {
      setCode('');
    } else {
      setError(result.error || 'Invalid discount code');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  return (
    <div className="space-y-2">
      {appliedDiscount ? (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-green-600" />
            <div>
              <div className="text-sm font-medium text-green-900">
                {appliedDiscount.code}
              </div>
              <div className="text-xs text-green-700">
                {appliedDiscount.description}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-green-900">
              -{SHOP_CONFIG.currencySymbol}{appliedDiscount.amount.toFixed(2)}
            </span>
            <button
              onClick={onRemove}
              className="p-1 hover:bg-green-100 rounded"
              aria-label="Remove discount"
            >
              <X className="w-4 h-4 text-green-700" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter discount code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={handleApply}
              disabled={!code.trim()}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Apply
            </button>
          </div>
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}
        </>
      )}
    </div>
  );
}

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  onContinueShopping: () => void;
}

function CartSummary({ subtotal, discount, total, onContinueShopping }: CartSummaryProps) {
  return (
    <div className="space-y-3">
      {/* Subtotal */}
      <div className="flex justify-between text-gray-600">
        <span>Subtotal:</span>
        <span>
          {SHOP_CONFIG.currencySymbol}
          {subtotal.toFixed(2)}
        </span>
      </div>

      {/* Discount */}
      {discount > 0 && (
        <div className="flex justify-between text-green-600 font-medium">
          <span>Discount:</span>
          <span>
            -{SHOP_CONFIG.currencySymbol}
            {discount.toFixed(2)}
          </span>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Total */}
      <div className="flex justify-between text-lg font-bold">
        <span>Total:</span>
        <span>
          {SHOP_CONFIG.currencySymbol}
          {total.toFixed(2)}
        </span>
      </div>

      {/* Checkout Button */}
      <Link
        to="/checkout"
        className="block w-full py-3 bg-black text-white text-center rounded-lg font-medium hover:bg-gray-800 transition-colors"
      >
        Proceed to Checkout
      </Link>

      {/* Continue Shopping */}
      <button
        onClick={onContinueShopping}
        className="block w-full text-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  );
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    cart,
    getCartItemCount,
    getCartTotal,
    updateQuantity,
    removeFromCart,
    appliedDiscount,
    applyDiscount,
    removeDiscount,
  } = useCart();
  const itemCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);

  // Get recommended products
  const recommendedProductIds = useMemo(() => {
    return getRecommendations(cart);
  }, [cart]);

  // TODO: Fetch actual products by IDs
  // For now, we'll create mock products from IDs
  const recommendedProducts: Product[] = useMemo(() => {
    return recommendedProductIds.map((id) => ({
      id,
      name: `Product ${id}`,
      price: 29.99,
      image: '/placeholder.jpg',
      category: 'women',
      inStock: true,
    }));
  }, [recommendedProductIds]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        data-testid="drawer-backdrop"
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer with Focus Trap */}
      <FocusTrap
        active={isOpen}
        focusTrapOptions={{
          initialFocus: false,
          allowOutsideClick: true,
          escapeDeactivates: false, // We handle Escape ourselves
          fallbackFocus: () => document.body,
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          className="fixed md:top-0 bottom-0 md:bottom-auto right-0 md:h-full h-[90vh] w-full md:w-[420px] bg-white md:shadow-xl shadow-2xl z-50 flex flex-col md:animate-slide-in animate-slide-up md:rounded-none rounded-t-2xl"
        >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="cart-drawer-title" className="text-lg font-semibold">
            Shopping Cart
            {itemCount > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-600">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-6">
          {cart.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Add items to get started
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            // Cart Items List
            <div className="py-4">
              {cart.map((item) => (
                <CartItem
                  key={`${item.productId}-${item.size}-${item.color}`}
                  item={item}
                  onUpdateQuantity={(productId, quantity) =>
                    updateQuantity(productId, quantity, item.size, item.color)
                  }
                  onRemove={(productId) =>
                    removeFromCart(productId, item.size, item.color)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 space-y-4">
            <FreeShippingProgress subtotal={getCartTotal()} />

            <DiscountCodeInput
              appliedDiscount={appliedDiscount}
              onApply={applyDiscount}
              onRemove={removeDiscount}
            />

            <ProductRecommendations products={recommendedProducts} />

            <CartSummary
              subtotal={getCartTotal()}
              discount={appliedDiscount?.amount || 0}
              total={getCartTotal() - (appliedDiscount?.amount || 0)}
              onContinueShopping={onClose}
            />
          </div>
        )}
        </div>
      </FocusTrap>
    </>
  );
}
