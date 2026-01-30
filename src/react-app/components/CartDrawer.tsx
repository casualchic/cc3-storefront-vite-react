import { useEffect, useMemo } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartItem } from './CartItem';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, getCartItemCount, updateQuantity, removeFromCart } = useCart();
  const itemCount = useMemo(() => getCartItemCount(), [getCartItemCount]);

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

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col animate-slide-in"
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
            <div className="py-4 space-y-0">
              {cart.map((item) => (
                <CartItem
                  key={`${item.productId}-${item.size}-${item.color}`}
                  item={item}
                  onUpdateQuantity={(quantity) =>
                    updateQuantity(item.productId, quantity, item.size, item.color)
                  }
                  onRemove={() =>
                    removeFromCart(item.productId, item.size, item.color)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer (to be implemented) */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <p>Footer will be implemented next</p>
          </div>
        )}
      </div>
    </>
  );
}
