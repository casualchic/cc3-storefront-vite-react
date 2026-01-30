import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Heart, Truck, RotateCcw, Shield, Minus, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { products } from '../mocks/products';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { ProductDescription } from '../components/ProductDescription';
import { ProductReviews } from '../components/ProductReviews';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { ShareButtons } from '../components/ShareButtons';
import { NotifyWhenAvailable } from '../components/NotifyWhenAvailable';
import { ShippingEstimate } from '../components/ShippingEstimate';

export const Route = createFileRoute('/products/$id')({
  component: ProductDetailPage,
  head: ({ params }) => {
    const product = products.find(p => p.id === params.id);
    if (!product) return {};

    return {
      meta: [
        { title: `${product.name} | Casual Chic Boutique` },
        { name: 'description', content: product.description || `Shop ${product.name} at Casual Chic Boutique. Premium quality, free shipping on orders over $75.` },
        { property: 'og:title', content: `${product.name} | Casual Chic Boutique` },
        { property: 'og:description', content: product.description || `Shop ${product.name}` },
        { property: 'og:image', content: product.image },
        { property: 'og:type', content: 'product' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `${product.name} | Casual Chic Boutique` },
        { name: 'twitter:description', content: product.description || `Shop ${product.name}` },
        { name: 'twitter:image', content: product.image },
      ],
    };
  },
});

// Fetch product with caching
const fetchProduct = async (id: string) => {
  // Simulate API call - in production, this would be a real API
  await new Promise(resolve => setTimeout(resolve, 100));
  const product = products.find(p => p.id === id);
  if (!product) throw new Error('Product not found');
  return product;
};

function ProductDetailPage() {
  const { id } = Route.useParams();

  // Use TanStack Query for data fetching with caching
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string>('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist();

  // Track product view for analytics
  useEffect(() => {
    if (product) {
      // In production, send to analytics service
      console.log('Product viewed:', {
        productId: product.id,
        productName: product.name,
        timestamp: new Date().toISOString(),
      });
    }
  }, [product]);

  // Reset state when product changes
  useEffect(() => {
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
    setError('');
  }, [id]);

  // Track recently viewed products
  useEffect(() => {
    if (product) {
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const filtered = recentlyViewed.filter((pid: string) => pid !== product.id);
      const updated = [product.id, ...filtered].slice(0, 6);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 dark:border-gray-700 dark:border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h1>
          <Link to="/" className="text-brand-dusty-rose hover:underline">Return to home</Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const relatedProducts = products.filter(p => p.id !== id && p.category === product.category).slice(0, 4);

  // Get recently viewed products
  const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  const recentlyViewedProducts = recentlyViewedIds
    .filter((pid: string) => pid !== id)
    .map((pid: string) => products.find(p => p.id === pid))
    .filter((p: Product | undefined): p is Product => Boolean(p))
    .slice(0, 4);

  // Check if all required selections are made
  const isAddToCartDisabled =
    !product.inStock ||
    (product.sizes && product.sizes.length > 0 && !selectedSize) ||
    (product.colors && product.colors.length > 0 && !selectedColor);

  // Handle add to cart with optimistic UI
  const handleAddToCart = async () => {
    // Validate required selections
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setError('Please select a size');
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setError('Please select a color');
      return;
    }

    setError('');
    setIsAddingToCart(true);

    try {
      // Optimistically update UI
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });

      // In production, sync with backend
      // await syncCartWithBackend(cartItem);

      // Track analytics
      console.log('Added to cart:', {
        productId: product.id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });

      // Show success feedback (could use a toast notification)
      setTimeout(() => setIsAddingToCart(false), 500);
    } catch {
      // Rollback on error
      setError('Failed to add to cart. Please try again.');
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
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
  };

  // Generate JSON-LD structured data for SEO
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images || [product.image],
    description: product.description || `${product.name} at Casual Chic Boutique`,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Casual Chic Boutique',
    },
    offers: {
      '@type': 'Offer',
      url: typeof window !== 'undefined' ? window.location.href : '',
      priceCurrency: 'USD',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.rating && product.reviews && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviews,
      },
    }),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

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
            <ProductImageGallery
              images={product.images || [product.image]}
              productName={product.name}
            />

            {/* Product Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">{product.name}</h1>
                <ShareButtons productName={product.name} />
              </div>

              {/* Stock Status */}
              {product.stockStatus && (
                <div className="mb-4">
                  {product.stockStatus === 'in-stock' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      In Stock
                    </span>
                  )}
                  {product.stockStatus === 'low-stock' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                      Only {product.stockCount} left!
                    </span>
                  )}
                  {product.stockStatus === 'out-of-stock' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                      Out of Stock
                    </span>
                  )}
                </div>
              )}

              {/* Rating */}
              {product.rating && product.reviews && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= Math.floor(product.rating!) ? '★' : '☆'}
                      </span>
                    ))}
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

              {/* Description Preview */}
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Elevate your wardrobe with this timeless piece. Crafted from premium materials for exceptional comfort and durability. Perfect for any occasion, from casual outings to more formal events.
              </p>

              {/* Color Selection */}
              {product.colorSwatches && product.colorSwatches.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Color: {selectedColor || 'Select a color'}
                  </label>
                  <div className="flex gap-3">
                    {product.colorSwatches.map((swatch) => (
                      <button
                        key={swatch.name}
                        onClick={() => setSelectedColor(swatch.name)}
                        className={`group relative flex flex-col items-center gap-2`}
                        title={swatch.name}
                      >
                        <div
                          className={`w-12 h-12 rounded-full border-2 transition-all ${
                            selectedColor === swatch.name
                              ? 'border-gray-900 dark:border-white ring-2 ring-gray-900 dark:ring-white ring-offset-2 dark:ring-offset-gray-900'
                              : 'border-gray-300 dark:border-gray-700 hover:border-gray-500'
                          }`}
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {swatch.name}
                        </span>
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
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-sm text-brand-dusty-rose hover:underline"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="flex gap-3 flex-wrap">
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
              {product.inStock && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mb-8">
                {product.inStock ? (
                  <div className="flex gap-4 mb-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={isAddToCartDisabled || isAddingToCart}
                      className={`flex-1 px-8 py-4 rounded-lg font-medium transition-all ${
                        isAddToCartDisabled || isAddingToCart
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
                      }`}
                    >
                      {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={handleWishlistToggle}
                      className={`px-6 py-4 rounded-lg border-2 transition-all ${
                        inWishlist
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white'
                      }`}
                      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                ) : (
                  <NotifyWhenAvailable
                    productId={product.id}
                    productName={product.name}
                    selectedSize={selectedSize}
                    selectedColor={selectedColor}
                  />
                )}
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    {error}
                  </p>
                )}
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

              {/* Shipping Estimate */}
              <ShippingEstimate productName={product.name} />
            </div>
          </div>

          {/* Product Details Sections */}
          <div className="mt-16 max-w-4xl">
            <ProductDescription
              description={product.description || `Elevate your wardrobe with the ${product.name}. This carefully crafted piece combines style and comfort, made from premium materials that ensure both durability and a luxurious feel.\n\nFeatures:\n• Premium quality materials\n• Expert craftsmanship\n• Versatile design for any occasion\n• Easy care and maintenance\n• Timeless style that never goes out of fashion\n\nWhether you're dressing up for a special occasion or keeping it casual, the ${product.name} is the perfect addition to your wardrobe.`}
            />
            {product.rating && product.reviews && (
              <ProductReviews
                productId={product.id}
                averageRating={product.rating}
                totalReviews={product.reviews}
              />
            )}
          </div>

          {/* Complete the Look */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8">
                Complete the Look
              </h2>
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

          {/* Recently Viewed */}
          {recentlyViewedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8">
                Recently Viewed
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentlyViewedProducts.map((viewedProduct: Product) => (
                  <ProductCard
                    key={viewedProduct.id}
                    product={viewedProduct}
                    badge={viewedProduct.originalPrice ? { text: 'SALE', color: 'bg-red-600' } : undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        category={product.category}
      />
    </>
  );
}
