// src/react-app/components/ProductRecommendations.tsx
import { Link } from '@tanstack/react-router';
import { Product } from '../types';
import { SHOP_CONFIG } from '../config/shopConfig';
import { useCart } from '../context/CartContext';

interface ProductRecommendationsProps {
  products: Product[];
}

export function ProductRecommendations({ products }: ProductRecommendationsProps) {
  const { addToCart } = useCart();

  if (products.length === 0) return null;

  const handleQuickAdd = (product: Product) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">You might also like</h3>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-36 bg-gray-50 rounded-lg overflow-hidden"
          >
            <Link to={`/product/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-36 object-cover"
              />
            </Link>

            <div className="p-2">
              <Link
                to={`/product/${product.id}`}
                className="text-xs font-medium text-gray-900 hover:text-gray-700 line-clamp-2 mb-1"
              >
                {product.name}
              </Link>

              <div className="text-sm font-bold text-gray-900 mb-2">
                {SHOP_CONFIG.currencySymbol}
                {product.price.toFixed(2)}
              </div>

              <button
                onClick={() => handleQuickAdd(product)}
                className="w-full px-2 py-1 text-xs bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Quick Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
