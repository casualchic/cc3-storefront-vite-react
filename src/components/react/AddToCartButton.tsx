/**
 * AddToCartButton Component
 * Button that adds a product to the cart
 */

import { useState } from 'react';
import { useCartStore } from '../../lib/stores/cart-store';

interface AddToCartButtonProps {
  productId: string;
  handle: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  brand: string;
  inventoryQuantity: number;
  variantId?: string;
  variantTitle?: string;
}

export default function AddToCartButton({
  productId,
  handle,
  name,
  price,
  compareAtPrice,
  image,
  brand,
  inventoryQuantity,
  variantId,
  variantTitle
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = async () => {
    setIsAdding(true);

    // Convert price from cents to dollars for display
    const priceInDollars = price / 100;
    const compareAtPriceInDollars = compareAtPrice ? compareAtPrice / 100 : undefined;

    addItem({
      productId,
      variantId,
      handle,
      name,
      price: priceInDollars,
      compareAtPrice: compareAtPriceInDollars,
      quantity: 1,
      image,
      variantTitle,
      brand
    });

    // Brief animation delay
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const isOutOfStock = !inventoryQuantity || inventoryQuantity <= 0;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock || isAdding}
      className="w-full bg-primary hover:bg-sage text-white font-button text-lg px-8 py-4 rounded-lg transition-colors duration-200 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isAdding ? (
        <>
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Adding...
        </>
      ) : isOutOfStock ? (
        'Out of Stock'
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Add to Cart
        </>
      )}
    </button>
  );
}
