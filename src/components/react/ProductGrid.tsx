import { useState } from 'react';
import type { Product } from '@/lib/db/schema';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [displayProducts] = useState(products);

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
  };

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayProducts.map((product) => (
        <a
          key={product.id}
          href={`/products/${product.handle}`}
          className="group block bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          {/* Product Image */}
          <div className="aspect-square bg-neutral overflow-hidden">
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="h-16 w-16 text-charcoal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="font-heading text-lg font-bold text-forest mb-2 line-clamp-2">
              {product.title}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-heading text-xl font-bold text-primary">
                ${formatPrice(product.price)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="font-body text-sm text-charcoal line-through">
                  ${formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>

            {/* Inventory Status */}
            {product.inventory_quantity !== null && (
              <div className="text-sm">
                {product.inventory_quantity > 0 ? (
                  <span className="text-sage font-medium">In Stock</span>
                ) : (
                  <span className="text-secondary font-medium">Out of Stock</span>
                )}
              </div>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
