import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Heart, Eye, ShoppingCart } from '@/lib/icons';
import { useCart } from '../context/CartContext';
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

function ColorSwatches({ colors }: { colors: { name: string; hex: string }[] }) {
  const displayColors = colors.slice(0, 5);
  const remainingCount = colors.length - 5;

  return (
    <div className="flex items-center gap-1.5">
      {displayColors.map((color) => (
        <div
          key={color.name}
          className="w-5 h-5 rounded-full border-2 border-gray-200 dark:border-gray-700 shadow-sm"
          style={{ backgroundColor: color.hex }}
          title={color.name}
          aria-label={color.name}
        />
      ))}
      {remainingCount > 0 && (
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
          +{remainingCount}
        </span>
      )}
    </div>
  );
}

function getStockStatusConfig(product: Product): {
  badge: { text: string; className: string } | null;
  showQuickAdd: boolean;
} {
  const stockStatus = product.stockStatus || (product.inStock ? 'in-stock' : 'out-of-stock');

  switch (stockStatus) {
    case 'out-of-stock':
      return {
        badge: { text: 'Out of Stock', className: 'bg-gray-500' },
        showQuickAdd: false,
      };
    case 'low-stock':
      return {
        badge: { text: 'Low Stock', className: 'bg-amber-500' },
        showQuickAdd: true,
      };
    case 'in-stock':
    default:
      return {
        badge: product.stockCount && product.stockCount > 100
          ? { text: 'In Stock', className: 'bg-green-500' }
          : null,
        showQuickAdd: true,
      };
  }
}

export function ProductCard({
  product,
  viewMode = 'grid',
  showQuickAdd = true,
  showWishlist = true,
  aspectRatio = '4/5',
  onAddToCart,
  onWishlistToggle,
  badge
}: ProductCardProps) {
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const inWishlist = isInWishlist(product.id);
  const stockConfig = getStockStatusConfig(product);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onWishlistToggle) {
      onWishlistToggle(product.id);
    } else {
      if (inWishlist) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist({
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          inStock: product.inStock,
        });
      }
    }
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!stockConfig.showQuickAdd) return;

    setIsAddingToCart(true);

    try {
      // Get default variant or first available variant
      const variantId = product.defaultVariantId || product.variants?.[0]?.id;
      const variant = product.variants?.find(v => v.id === variantId);

      // Call custom callback if provided
      if (onAddToCart) {
        onAddToCart(variantId || product.id);
      } else {
        // Default behavior: add to cart with first size/color
        addItem({
          productId: product.id,
          name: product.name,
          price: variant?.price || product.price,
          quantity: 1,
          size: variant?.size || product.sizes?.[0] || 'One Size',
          color: variant?.color || product.colors?.[0] || 'Default',
          image: product.image,
        });
      }

      // Success feedback
      setTimeout(() => setIsAddingToCart(false), 1000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setIsAddingToCart(false);
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
        className={`group block ${
          viewMode === 'list'
            ? 'flex gap-4 items-start'
            : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image Container */}
        <div
          className={`relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 transition-transform duration-300 ease-out ${
            viewMode === 'list'
              ? 'w-48 flex-shrink-0 mb-0'
              : 'mb-3 group-hover:scale-[1.02]'
          }`}
          style={{ aspectRatio: viewMode === 'list' ? '3/4' : aspectRatio }}
        >
          {/* Primary Image */}
          <img
            src={product.image}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered && product.images && product.images.length > 0
                ? 'opacity-0'
                : 'opacity-100 group-hover:opacity-90'
            }`}
            loading="lazy"
          />

          {/* Secondary Image (Hover) */}
          {product.images && product.images.length > 0 && (
            <img
              src={product.images[1] ?? product.images[0]}
              alt={`${product.name} - alternate view`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
            />
          )}

          {/* Custom Badge (SALE, NEW, etc.) */}
          {badge && (
            <div className={`absolute top-3 left-3 ${badge.color} text-white px-3 py-1 text-xs font-bold rounded shadow-lg z-10`}>
              {badge.text}
            </div>
          )}

          {/* Stock Status Badge */}
          {stockConfig.badge && (
            <div className={`absolute top-3 ${badge ? 'left-auto right-3' : 'left-3'} ${stockConfig.badge.className} text-white px-3 py-1 text-xs font-bold rounded shadow-lg z-10`}>
              {stockConfig.badge.text}
            </div>
          )}

          {/* Wishlist Heart Icon */}
          {showWishlist && (
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
          )}

          {/* Quick Add Button (replaces Quick View in hover) */}
          {showQuickAdd && stockConfig.showQuickAdd && viewMode === 'grid' && (
            <button
              onClick={handleQuickAdd}
              disabled={isAddingToCart}
              className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isAddingToCart ? 'Adding...' : 'Quick Add'}
            </button>
          )}

          {/* Quick View Button - secondary action */}
          <button
            onClick={handleQuickView}
            className={`absolute bottom-3 right-3 z-20 p-2 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all duration-200 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Product Info */}
        <div className={viewMode === 'list' ? 'flex-1' : ''}>
          <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200 line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Color Swatches or Size & Color Indicators */}
          <div className="mb-2">
            {product.colorSwatches && product.colorSwatches.length > 0 ? (
              <ColorSwatches colors={product.colorSwatches} />
            ) : (
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                {product.colors && product.colors.length > 0 && (
                  <span>{product.colors.length} color{product.colors.length > 1 ? 's' : ''}</span>
                )}
                {product.sizes && product.sizes.length > 0 && (
                  <span>{product.sizes.length} size{product.sizes.length > 1 ? 's' : ''}</span>
                )}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
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
              <span>{product.rating.toFixed(1)}</span>
              <span>({product.reviews})</span>
            </div>
          )}

          {/* Quick Add Button for List View */}
          {viewMode === 'list' && showQuickAdd && stockConfig.showQuickAdd && (
            <button
              onClick={handleQuickAdd}
              disabled={isAddingToCart}
              className="mt-3 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg shadow flex items-center gap-2 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              {isAddingToCart ? 'Adding...' : 'Quick Add'}
            </button>
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
