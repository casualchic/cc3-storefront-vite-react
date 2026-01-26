import { Link } from 'react-router-dom';
import { products } from '../mocks/products';

export function CollectionsPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">All Collections</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse our complete collection of casual chic essentials
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 aspect-[3/4] mb-3">
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700"></div>
                {product.originalPrice && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded">
                    SALE
                  </div>
                )}
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-900 dark:text-white font-semibold">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-500 dark:text-gray-400 line-through text-sm">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
