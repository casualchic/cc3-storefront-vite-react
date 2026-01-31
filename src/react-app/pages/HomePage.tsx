import { products } from '../mocks/products';
import { categories } from '../mocks/categories';

export function HomePage() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-cream via-brand-light-beige to-brand-taupe/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left">
              <div className="inline-block mb-4 px-4 py-1.5 bg-black/5 dark:bg-white/5 rounded-full">
                <span className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">
                  New Season Collection
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Define Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-taupe-brown to-gray-900 dark:from-brand-light-beige dark:to-white">
                  Casual Chic
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-xl leading-relaxed">
                Discover effortlessly elegant pieces that transition seamlessly from day to night, work to weekend.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/collections/new-arrivals"
                  className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg font-medium transition-all transform hover:scale-105 text-center shadow-lg"
                >
                  Shop New Arrivals
                </a>
                <a
                  href="/sale"
                  className="px-8 py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black rounded-lg font-medium transition-all text-center"
                >
                  Explore Sale
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-gray-300 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🚚</div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">Free Shipping</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">On all orders over $75</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-3xl">↩️</div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">Easy Returns</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Free returns within 30 days</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🔒</div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">Secure Checkout</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">100% secure payment</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Featured Image Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <a href="/category/dresses" className="relative overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 aspect-[3/4] group block">
                  <img
                    src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop"
                    alt="Dresses"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <p className="text-white font-semibold text-lg">Dresses</p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10"></div>
                </a>
                <a href="/category/accessories" className="relative overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 aspect-[3/2] group block">
                  <img
                    src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=400&fit=crop"
                    alt="Accessories"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <p className="text-white font-semibold text-lg">Accessories</p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10"></div>
                </a>
              </div>
              <div className="space-y-4 pt-8">
                <a href="/category/tops" className="relative overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 aspect-[3/2] group block">
                  <img
                    src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=400&fit=crop"
                    alt="Tops"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <p className="text-white font-semibold text-lg">Tops</p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10"></div>
                </a>
                <a href="/category/outerwear" className="relative overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 aspect-[3/4] group block">
                  <img
                    src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop"
                    alt="Outerwear"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <p className="text-white font-semibold text-lg">Outerwear</p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our carefully curated collections
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 aspect-square"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <h3 className="text-white text-sm font-semibold">{category.name}</h3>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10"></div>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Handpicked favorites that define casual chic
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <a
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 aspect-[4/5] mb-3 transition-transform duration-300 ease-out group-hover:scale-[1.02]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                  loading="lazy"
                />
                {product.originalPrice && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded shadow-lg z-10">
                    SALE
                  </div>
                )}
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
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/collections"
            className="inline-block px-8 py-3 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 rounded-lg font-medium transition-colors"
          >
            View All Products
          </a>
        </div>
      </section>

      {/* Brand Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            At Casual Chic Boutique, we believe that great style should be effortless. Our carefully curated
            collections blend comfort with sophistication, offering versatile pieces that transition
            seamlessly from day to night, work to weekend.
          </p>
          <a
            href="/about"
            className="inline-block px-8 py-3 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 rounded-lg font-medium transition-colors"
          >
            Learn More About Us
          </a>
        </div>
      </section>
    </div>
  );
}
