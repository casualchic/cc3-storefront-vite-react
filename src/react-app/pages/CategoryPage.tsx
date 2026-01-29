import { Link, useParams } from '@tanstack/react-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { categories } from '../mocks/categories';
import { ProductGrid } from '../components/ProductGrid';
import { fetchProducts } from '../api/products';

export function CategoryPage() {
  const { slug } = useParams({ from: '/category/$slug' });
  const category = categories.find((c) => c.slug === slug);

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['products', 'category', slug],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({ pageParam, category: slug, limit: 12 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    enabled: !!category, // Only fetch if category exists
  });

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Category not found
          </h1>
          <Link to="/" className="text-blue-600 hover:text-blue-500">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {category.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {category.description}
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
          emptyStateMessage="No products found in this category"
        />
      </div>
    </div>
  );
}
