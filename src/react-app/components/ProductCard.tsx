import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Heart, Eye } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { Product } from '../types';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  showQuickAdd?: boolean;
  showWishlist?: boolean;
  aspectRatio?: '1/1' | '3/4' | '4/5'; // Default 4/5
  onAddToCart?: (variantId: string) => void;
  onWishlistToggle?: (productId: string) => void;
  badge?: {
    text: string;
    color: string;
  };
}

export function ProductCard({ product, badge }: ProductCardProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image Container */}
        <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 aspect-[4/5] mb-3 transition-transform duration-300 ease-out group-hover:scale-[1.02]">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
            loading="lazy"
          />

          {/* Badge (SALE, NEW, etc.) */}
          {badge && (
            <div className={`absolute top-3 left-3 ${badge.color} text-white px-3 py-1 text-xs font-bold rounded shadow-lg z-10`}>
              {badge.text}
            </div>
          )}

          {/* Wishlist Heart Icon */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-200 ${
              inWishlist
                ? 'bg-red-500 text-white'
                : 'bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900'
            } ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <Eye className="w-4 h-4" />
            Quick View
          </button>
        </div>

        {/* Product Info */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200 line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Size & Color Indicators */}
          <div className="flex items-center gap-3 mb-2 text-xs text-gray-500 dark:text-gray-400">
            {product.colors && product.colors.length > 0 && (
              <span>{product.colors.length} color{product.colors.length > 1 ? 's' : ''}</span>
            )}
            {product.sizes && product.sizes.length > 0 && (
              <span>{product.sizes.length} size{product.sizes.length > 1 ? 's' : ''}</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${product.price}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
                <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Rating (if available) */}
          {product.rating && product.reviews && (
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-amber-500">★</span>
              <span>{product.rating}</span>
              <span>({product.reviews})</span>
            </div>
          )}
        </div>
      </Link>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
}
