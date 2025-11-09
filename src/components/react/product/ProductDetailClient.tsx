/**
 * ProductDetailClient Component
 * Client-side component managing product detail page state
 * Handles variant selection, images, and add-to-cart
 */

import { useState, useEffect } from 'react';
import type { Product, ProductVariant } from '@/lib/types/medusa';
import type { ProductImage } from './ImageGallery';
import ImageGallery from './ImageGallery';
import VariantSelector from './VariantSelector';
import { getVariantPrice, getDefaultVariant } from '@/lib/medusa/products';
import { useMedusaCartStore } from '@/lib/stores/medusa-cart-store';

interface ProductDetailClientProps {
  product: Product;
  images: ProductImage[];
  initialPriceDisplay: string;
}

export default function ProductDetailClient({
  product,
  images,
  initialPriceDisplay,
}: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { addItem } = useMedusaCartStore();

  // Initialize with default variant
  useEffect(() => {
    const defaultVariant = getDefaultVariant(product);
    if (defaultVariant) {
      setSelectedVariant(defaultVariant);
    }
  }, [product]);

  // Calculate current price based on selected variant
  // Note: In v2, pricing requires proper region context. Using initialPriceDisplay as fallback.
  const currentPrice = parseFloat(initialPriceDisplay.replace(/[^0-9.]/g, ''));

  // Check if product is in stock
  const isInStock = selectedVariant
    ? (selectedVariant.inventory_quantity || 0) > 0
    : false;

  const inventoryCount = selectedVariant?.inventory_quantity || 0;

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert('Please select product options');
      return;
    }

    if (!isInStock) {
      alert('This product is out of stock');
      return;
    }

    console.log('[PDP] Starting add to cart:', selectedVariant.id);
    setIsAdding(true);

    try {
      // Add item to cart with timeout protection
      console.log('[PDP] Calling addItem...');
      await Promise.race([
        addItem(selectedVariant.id!, 1),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Add to cart timeout after 5s')), 5000)
        )
      ]);
      console.log('[PDP] addItem completed successfully');

      setShowSuccess(true);

      // Auto-hide success message
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('[PDP] Error adding to cart:', error);
      alert(`Failed to add item to cart: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      console.log('[PDP] Setting isAdding to false');
      setIsAdding(false);
    }
  };

  // Convert Medusa variants to our VariantSelector format
  const variantSelectorData = product.variants || [];

  return (
    <>
      {/* Left Column: Image Gallery */}
      <div>
        <ImageGallery images={images} productName={product.title || 'Product'} />
      </div>

      {/* Right Column: Product Info */}
      <div className="space-y-6 pb-24 lg:pb-0">
        {/* Title */}
        <div>
          <h1 className="font-heading text-4xl font-bold text-forest mb-4">
            {product.title}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-heading text-3xl font-bold text-primary">
              ${currentPrice.toFixed(2)}
            </span>
            {/* TODO: Add price comparison when v2 pricing is properly implemented */}
          </div>

          {/* Short Description */}
          {product.description && product.description.length <= 200 && (
            <p className="font-body text-charcoal leading-relaxed mb-6">
              {product.description}
            </p>
          )}

          {/* Inventory Status */}
          {selectedVariant && (
            <div className="mb-6">
              {isInStock ? (
                <p className="font-body text-sm text-sage flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  In Stock
                  {inventoryCount > 0 && inventoryCount <= 10 && ` (${inventoryCount} available)`}
                </p>
              ) : (
                <p className="font-body text-sm text-secondary flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Out of Stock
                </p>
              )}
            </div>
          )}
        </div>

        {/* Variant Selector */}
        {variantSelectorData.length > 1 && (
          <div className="border-t border-neutral pt-6">
            <VariantSelector
              productId={product.id!}
              variants={variantSelectorData}
              defaultVariantId={selectedVariant?.id}
              onVariantChange={setSelectedVariant}
            />
          </div>
        )}

        {/* Add to Cart Button */}
        <div className="border-t border-neutral pt-6">
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || !isInStock || isAdding}
            className={`w-full py-4 px-6 rounded-lg font-heading font-bold text-lg transition-all ${
              !selectedVariant || !isInStock
                ? 'bg-neutral text-charcoal cursor-not-allowed'
                : isAdding
                ? 'bg-sage text-white cursor-wait'
                : 'bg-primary text-white hover:bg-sage hover:shadow-lg active:scale-95'
            }`}
          >
            {isAdding ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding...
              </span>
            ) : !selectedVariant ? (
              'Select Options'
            ) : !isInStock ? (
              'Out of Stock'
            ) : (
              'Add to Cart'
            )}
          </button>

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-4 p-4 bg-sage/10 border border-sage rounded-lg flex items-center gap-3">
              <svg
                className="w-6 h-6 text-sage flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-medium text-forest">Added to cart!</p>
                <p className="text-sm text-charcoal">Your cart has been updated</p>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-6 space-y-3 text-sm text-charcoal">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free shipping on orders over $75</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>30-day easy returns</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Secure checkout</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        {selectedVariant && (
          <div className="border-t border-neutral pt-6 space-y-4">
            <h2 className="font-heading text-xl font-bold text-forest mb-3">Product Details</h2>
            <dl className="font-body text-sm space-y-2">
              <div className="flex justify-between">
                <dt className="text-charcoal">SKU:</dt>
                <dd className="text-forest font-medium">{selectedVariant.sku || product.id}</dd>
              </div>
              {selectedVariant.barcode && (
                <div className="flex justify-between">
                  <dt className="text-charcoal">Barcode:</dt>
                  <dd className="text-forest font-medium">{selectedVariant.barcode}</dd>
                </div>
              )}
              {selectedVariant.weight && (
                <div className="flex justify-between">
                  <dt className="text-charcoal">Weight:</dt>
                  <dd className="text-forest font-medium">{selectedVariant.weight} g</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-neutral shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-heading text-xl font-bold text-forest">
                ${currentPrice.toFixed(2)}
              </p>
              {selectedVariant && (
                <p className="text-xs text-charcoal">
                  {isInStock ? (
                    <span className="text-sage">In Stock</span>
                  ) : (
                    <span className="text-secondary">Out of Stock</span>
                  )}
                </p>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || !isInStock || isAdding}
              className={`flex-1 py-3 px-6 rounded-lg font-heading font-bold transition-all ${
                !selectedVariant || !isInStock
                  ? 'bg-neutral text-charcoal cursor-not-allowed'
                  : isAdding
                  ? 'bg-sage text-white cursor-wait'
                  : 'bg-primary text-white hover:bg-sage active:scale-95'
              }`}
            >
              {isAdding ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </span>
              ) : !selectedVariant ? (
                'Select Options'
              ) : !isInStock ? (
                'Out of Stock'
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
