import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Heart, Truck, RotateCcw, Shield, Minus, Plus } from 'lucide-react';
import { products } from '../mocks/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';

export const Route = createFileRoute('/products/$id')({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = Route.useParams();
  const product = products.find(p => p.id === id);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist();

  const inWishlist = product ? isInWishlist(product.id) : false;

  const relatedProducts = products.filter(p => p.id !== id && p.category === product?.category).slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h1>
          <Link to="/" className="text-brand-dusty-rose hover:underline">Return to home</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/" className="hover:text-gray-900 dark:hover:text-white">Home</Link>
          <span>/</span>
          <Link to="/collections" className="hover:text-gray-900 dark:hover:text-white">Shop</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>

            {/* Rating */}
            {product.rating && product.reviews && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 text-amber-500">
                  <span>★★★★★</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-sm font-semibold rounded">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Elevate your wardrobe with this timeless piece. Crafted from premium materials for exceptional comfort and durability. Perfect for any occasion, from casual outings to more formal events.
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Color: {selectedColor || 'Select a color'}
                </label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-2 rounded-lg border-2 transition-all ${
                        selectedColor === color
                          ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                          : 'border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Size: {selectedSize || 'Select a size'}
                  </label>
                  <Link to="/size-guide" className="text-sm text-brand-dusty-rose hover:underline">
                    Size Guide
                  </Link>
                </div>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2 rounded-lg border-2 transition-all ${
                        selectedSize === size
                          ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                          : 'border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`px-6 py-4 rounded-lg border-2 transition-all ${
                  inWishlist
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white'
                }`}
              >
                <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Product Features */}
            <div className="border-t dark:border-gray-800 pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Truck className="w-5 h-5" />
                <span>Free shipping on orders over $75</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <RotateCcw className="w-5 h-5" />
                <span>Free returns within 30 days</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="w-5 h-5" />
                <span>Secure checkout with SSL encryption</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  badge={relatedProduct.originalPrice ? { text: 'SALE', color: 'bg-red-600' } : undefined}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
