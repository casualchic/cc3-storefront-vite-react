/**
 * ProductCard Component
 * Displays a product in a grid layout with image, title, price
 */

import { formatPrice } from '../../lib/utils/format';
import type { Product } from '../../lib/db/schema';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const priceInDollars = product.price / 100;
  const compareAtPriceInDollars = product.compare_at_price
    ? product.compare_at_price / 100
    : null;

  const hasDiscount = compareAtPriceInDollars !== null && compareAtPriceInDollars > priceInDollars;
  const discountPercent = hasDiscount && compareAtPriceInDollars
    ? Math.round(((compareAtPriceInDollars - priceInDollars) / compareAtPriceInDollars) * 100)
    : 0;

  const isOutOfStock = product.inventory_quantity !== null && product.inventory_quantity <= 0;

  return (
    <a
      href={`/products/${product.handle}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
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

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discountPercent}%
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
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
  );
}
