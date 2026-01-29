import { useInfiniteQuery } from '@tanstack/react-query';
import { ProductGrid } from '../components/ProductGrid';
import { fetchProducts } from '../api/products';

export function CollectionsPage() {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['products', 'all'],
    queryFn: ({ pageParam = 0 }) => fetchProducts({ pageParam, limit: 12 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            All Collections
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse our complete collection of casual chic essentials
          </p>
        </div>

        <ProductGrid
          products={products}
          isLoading={isLoading}
          isError={isError}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          viewMode="grid"
          columns={4}
          onRetry={() => refetch()}
          emptyStateMessage="No products available"
        />
      </div>
    </div>
  );
}
