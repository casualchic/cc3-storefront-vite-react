/**
 * ProductCard Component
 * Displays a product in a grid layout with image, title, price
 * Enhanced with hover effects, wishlist, and quick add
 */

import { useState } from 'react';
import { formatPrice } from '../../lib/utils/format';
import type { Product } from '../../lib/db/schema';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const priceInDollars = product.price / 100;
  const compareAtPriceInDollars = product.compare_at_price
    ? product.compare_at_price / 100
    : null;

  const hasDiscount = compareAtPriceInDollars !== null && compareAtPriceInDollars > priceInDollars;
  const discountPercent = hasDiscount && compareAtPriceInDollars
    ? Math.round(((compareAtPriceInDollars - priceInDollars) / compareAtPriceInDollars) * 100)
    : 0;

  const isOutOfStock = product.inventory_quantity !== null && product.inventory_quantity <= 0;

  // Get second image for hover effect (from product.images array if available)
  const hoverImage = product.images?.[1]?.url || product.images?.[0]?.url;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Integrate with wishlist store
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={`/products/${product.handle}`}
        className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      >
        {/* Product Image with Hover Effect */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Primary Image */}
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isHovered && hoverImage && hoverImage !== product.thumbnail ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Hover Image (second product image) */}
          {hoverImage && hoverImage !== product.thumbnail && (
            <img
              src={hoverImage}
              alt={`${product.title} alternate view`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
            {hasDiscount && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                -{discountPercent}%
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white hover:scale-110 transition-all duration-200 z-10 shadow-md"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                isWishlisted ? 'text-red-500 fill-current' : 'text-gray-700'
              }`}
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Quick Add Button - appears on hover */}
          {!isOutOfStock && (
            <div
              className={`absolute bottom-0 left-0 right-0 p-4 transform transition-all duration-300 ${
                isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // TODO: Integrate with cart store
                  window.location.href = `/products/${product.handle}`;
                }}
                className="w-full bg-white hover:bg-primary hover:text-white text-forest font-semibold py-3 rounded-lg shadow-lg transition-colors duration-200"
              >
                Quick View
              </button>
            </div>
          )}
        </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(priceInDollars)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(compareAtPriceInDollars)}
            </span>
          )}
        </div>

        {/* Inventory Status */}
        {product.inventory_quantity !== null && product.inventory_quantity > 0 && product.inventory_quantity <= 5 && (
          <p className="text-xs text-orange-600 mt-2">
            Only {product.inventory_quantity} left!
          </p>
        )}
      </div>
      </a>
    </div>
  );
}
