import { createFileRoute, Link } from '@tanstack/react-router';
import { products } from '../mocks/products';

export const Route = createFileRoute('/collections/best-sellers')({
  component: BestSellersPage,
});

function BestSellersPage() {
  // Sort by rating and reviews to show best sellers
  const bestSellers = [...products].sort((a, b) => {
    const aScore = (a.rating || 0) * (a.reviews || 0);
    const bScore = (b.rating || 0) * (b.reviews || 0);
    return bScore - aScore;
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Best Sellers</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Our most-loved pieces, chosen by customers like you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <Link
              key={product.id}
              to="/products/$id"
              params={{ id: product.id }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 aspect-[4/5] mb-3 transition-transform duration-300 ease-out group-hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 group-hover:opacity-90 transition-opacity duration-300"></div>
                <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 text-xs font-bold rounded shadow-lg">
                  BESTSELLER
                </div>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200 line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
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
              {product.rating && product.reviews && (
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-amber-500">★</span>
                  <span>{product.rating}</span>
                  <span>({product.reviews})</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
