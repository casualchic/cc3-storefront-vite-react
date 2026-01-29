import { useEffect, useRef, useState } from 'react';
import { AlertCircle, PackageX, Loader2 } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

export interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  viewMode?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
  onRetry?: () => void;
  emptyStateMessage?: string;
  emptyStateAction?: {
    label: string;
    onClick: () => void;
  };
}

export function ProductGrid({
  products,
  isLoading,
  isError,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  viewMode = 'grid',
  columns = 4,
  onRetry,
  emptyStateMessage = 'No products found',
  emptyStateAction,
}: ProductGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [hasTriggeredLoad, setHasTriggeredLoad] = useState(false);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!fetchNextPage || !hasNextPage || isFetchingNextPage) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasTriggeredLoad) {
          setHasTriggeredLoad(true);
          fetchNextPage();
          // Reset after a delay to allow for next trigger
          setTimeout(() => setHasTriggeredLoad(false), 1000);
        }
      },
      {
        rootMargin: '200px',
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, hasTriggeredLoad]);

  // Loading state - show skeletons
  if (isLoading && products.length === 0) {
    return (
      <div
        className={`grid gap-6 ${
          viewMode === 'grid'
            ? `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`
            : 'grid-cols-1'
        }`}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductSkeleton key={i} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't load the products. Please try again.
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="text-center max-w-md">
          <PackageX className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {emptyStateMessage}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't find any products matching your criteria.
          </p>
          {emptyStateAction && (
            <button
              onClick={emptyStateAction.onClick}
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              {emptyStateAction.label}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Grid view
  if (viewMode === 'grid') {
    return (
      <div>
        <div
          className={`grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
              showQuickAdd={true}
              showWishlist={true}
            />
          ))}
        </div>

        {/* Infinite scroll sentinel */}
        {hasNextPage && <div ref={sentinelRef} className="h-px" />}

        {/* Loading more indicator */}
        {isFetchingNextPage && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={`loading-${i}`} viewMode="grid" />
            ))}
          </div>
        )}

        {/* Manual Load More button */}
        {hasNextPage && fetchNextPage && !isFetchingNextPage && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isFetchingNextPage && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Load More
            </button>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div>
      <div className="space-y-6">
        {products.map((product) => (
          <ProductCardList key={product.id} product={product} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      {hasNextPage && <div ref={sentinelRef} className="h-px" />}

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <div className="space-y-6 mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductSkeleton key={`loading-${i}`} viewMode="list" />
          ))}
        </div>
      )}

      {/* Manual Load More button */}
      {hasNextPage && fetchNextPage && !isFetchingNextPage && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin" />}
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

// List view product card
function ProductCardList({ product }: { product: Product }) {
  return (
    <ProductCard
      product={product}
      viewMode="list"
      showQuickAdd={true}
      showWishlist={true}
    />
  );
}

// Loading skeleton
function ProductSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex gap-6 bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 animate-pulse">
        <div className="w-48 h-64 bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
        <div className="flex-1 py-4 pr-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 mb-4" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg aspect-[4/5] mb-3" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2" />
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-20" />
    </div>
  );
}
