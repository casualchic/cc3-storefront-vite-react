import { Link } from '@tanstack/react-router';
import { Minus, Plus, Trash2, AlertTriangle, Heart } from '@/lib/icons';
import { CartItem as CartItemType } from '../types';
import { SHOP_CONFIG } from '../config/shopConfig';
import { useEffect, useState } from 'react';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  onRemove: (productId: string, size?: string, color?: string) => void;
  onSaveForLater?: (productId: string, size?: string, color?: string) => void;
  compact?: boolean;
}

export function CartItem({ item, onUpdateQuantity, onRemove, onSaveForLater, compact = false }: CartItemProps) {
  const [localQuantity, setLocalQuantity] = useState(item.quantity.toString());

  useEffect(() => {
    setLocalQuantity(item.quantity.toString());
  }, [item.quantity]);

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.quantity - 1, item.size, item.color);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < SHOP_CONFIG.maxQuantityPerItem) {
      onUpdateQuantity(item.productId, item.quantity + 1, item.size, item.color);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuantity(value);
  };

  const handleQuantityBlur = () => {
    const numValue = parseInt(localQuantity, 10);

    if (isNaN(numValue) || numValue < 1) {
      setLocalQuantity(item.quantity.toString());
    } else if (numValue > SHOP_CONFIG.maxQuantityPerItem) {
      setLocalQuantity(SHOP_CONFIG.maxQuantityPerItem.toString());
      onUpdateQuantity(item.productId, SHOP_CONFIG.maxQuantityPerItem, item.size, item.color);
    } else if (numValue !== item.quantity) {
      onUpdateQuantity(item.productId, numValue, item.size, item.color);
    }
  };

  const handleRemove = () => {
    onRemove(item.productId, item.size, item.color);
  };

  const handleSaveForLater = () => {
    if (onSaveForLater) {
      onSaveForLater(item.productId, item.size, item.color);
    }
  };

  const totalPrice = (item.price * item.quantity).toFixed(2);

  // Check if quantity exceeds available inventory
  const hasInventoryWarning = item.availableInventory !== undefined && item.quantity > item.availableInventory;
  const isLowStock = item.availableInventory !== undefined && item.availableInventory > 0 && item.availableInventory <= 5;

  return (
    <div className={`flex gap-4 ${compact ? 'py-2' : 'py-4'}`}>
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-md"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        {/* Product Name */}
        <Link
          to="/products/$id"
          params={{ id: item.productId }}
          className="text-sm font-medium text-gray-900 hover:text-gray-700 line-clamp-2 block mb-1"
        >
          {item.name}
        </Link>

        {/* Size and Color Badges */}
        {(item.size || item.color) && (
          <div className="flex gap-2 mb-2">
            {item.size && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                {item.size}
              </span>
            )}
            {item.color && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                {item.color}
              </span>
            )}
          </div>
        )}

        {/* Inventory Warning */}
        {hasInventoryWarning && (
          <div className="flex items-center gap-1 mb-2 text-amber-600">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            <span className="text-xs font-medium">
              Only {item.availableInventory} left in stock
            </span>
          </div>
        )}

        {/* Low Stock Indicator (not exceeding, but low) */}
        {!hasInventoryWarning && isLowStock && (
          <div className="flex items-center gap-1 mb-2 text-amber-600">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            <span className="text-xs">
              Only {item.availableInventory} left
            </span>
          </div>
        )}

        {/* Save for Later */}
        {onSaveForLater && (
          <button
            onClick={handleSaveForLater}
            className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 mb-2 transition-colors"
          >
            <Heart className="w-3 h-3" />
            <span>Save for later</span>
          </button>
        )}

        {/* Price and Quantity Controls */}
        <div className="flex items-center justify-between mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              className="p-1 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min="1"
              max={SHOP_CONFIG.maxQuantityPerItem}
              value={localQuantity}
              onChange={handleQuantityChange}
              onBlur={handleQuantityBlur}
              className="w-12 text-center text-sm border-x border-gray-300 focus:outline-none"
              aria-label="Quantity"
            />
            <button
              onClick={handleIncrease}
              disabled={item.quantity >= SHOP_CONFIG.maxQuantityPerItem}
              aria-label="Increase quantity"
              className="p-1 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {SHOP_CONFIG.currencySymbol}{totalPrice}
            </div>
            {item.quantity > 1 && (
              <div className="text-xs text-gray-500">
                {SHOP_CONFIG.currencySymbol}{item.price.toFixed(2)} each
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <div className="flex-shrink-0">
        <button
          onClick={handleRemove}
          aria-label="Remove item"
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
