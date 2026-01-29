import { Link } from '@tanstack/react-router';
import { products } from '../mocks/products';
import { categories } from '../mocks/categories';
import { ProductCard } from '../components/ProductCard';

export function HomePage() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden bg-linear-to-br from-brand-cream via-brand-light-beige to-brand-taupe/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] bg-size-[4rem_4rem]"></div>
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
                <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-taupe-brown to-gray-900 dark:from-brand-light-beige dark:to-white">
                  Casual Chic
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-xl leading-relaxed">
                Discover effortlessly elegant pieces that transition seamlessly from day to night, work to weekend.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/collections/new-arrivals"
                  className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg font-medium transition-all transform hover:scale-105 text-center shadow-lg"
                >
                  Shop New Arrivals
                </Link>
                <Link
                  to="/sale"
                  className="px-8 py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black rounded-lg font-medium transition-all text-center"
                >
                  Explore Sale
                </Link>
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
                <Link to="/category/$slug" params={{ slug: 'dresses' }} className="relative overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 aspect-3/4 group block">
                  <img
                    src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop"
                    alt="Dresses"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10"></div>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <p className="text-white font-semibold text-lg">Dresses</p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10"></div>
                </Link>
                <Link to="/category/$slug" params={{ slug: 'accessories' }} className="relative overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 aspect-3/2 group block">
                  <img
                    src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=400&fit=crop"
                    alt="Accessories"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10"></div>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <p className="text-white font-semibold text-lg">Accessories</p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10"></div>
                </Link>
              </div>
              <div className="space-y-4 pt-8">
                <Link to="/category/$slug" params={{ slug: 'tops' }} className="relative overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 aspect-3/2 group block">
                  <img
                    src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=400&fit=crop"
                    alt="Tops"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10"></div>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <p className="text-white font-semibold text-lg">Tops</p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10"></div>
                </Link>
                <Link to="/category/$slug" params={{ slug: 'outerwear' }} className="relative overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 aspect-3/4 group block">
                  <img
                    src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop"
                    alt="Outerwear"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10"></div>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <p className="text-white font-semibold text-lg">Outerwear</p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10"></div>
                </Link>
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
            <Link
              key={category.id}
              to="/category/$slug"
              params={{ slug: category.slug }}
              className="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 aspect-square"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent z-10"></div>
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <h3 className="text-white text-sm font-semibold">{category.name}</h3>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10"></div>
            </Link>
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
            <ProductCard
              key={product.id}
              product={product}
              badge={product.originalPrice ? { text: 'SALE', color: 'bg-red-600' } : undefined}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/collections"
            className="inline-block px-8 py-3 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 rounded-lg font-medium transition-colors"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real reviews from real customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-1 mb-4 text-amber-500">
              <span>★★★★★</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              "Absolutely love my new dress! The quality is amazing and it fits perfectly. I've received so many compliments!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-brand-taupe to-brand-dusty-rose rounded-full"></div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Sarah M.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Verified Customer</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-1 mb-4 text-amber-500">
              <span>★★★★★</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              "Fast shipping and beautiful packaging! The pieces are even better in person. Will definitely be shopping here again."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-brand-sage to-brand-mustard rounded-full"></div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Emily R.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Verified Customer</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-1 mb-4 text-amber-500">
              <span>★★★★★</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              "The quality and style are unmatched. These pieces go from work to weekend effortlessly. So happy with my purchase!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-brand-soft-blue to-brand-olive rounded-full"></div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Jessica L.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Verified Customer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ambassador Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-linear-to-br from-brand-light-beige/30 to-brand-cream dark:from-gray-800 dark:to-gray-900">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">Our Style Ambassadors</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Meet the inspiring women who embody the Casual Chic lifestyle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ambassador 1 */}
          <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="aspect-4/5 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=750&fit=crop"
                alt="Emma Thompson"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Emma Thompson</h3>
                  <p className="text-sm text-brand-dusty-rose font-medium">Fashion Influencer</p>
                </div>
                <a
                  href="https://instagram.com/emmathompson"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-dusty-rose hover:text-brand-taupe-brown transition-colors"
                  aria-label="Follow Emma on Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                "Casual Chic pieces are my everyday staples. They're effortlessly elegant and transition seamlessly from coffee meetings to evening events."
              </p>
            </div>
          </div>

          {/* Ambassador 2 */}
          <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="aspect-4/5 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=750&fit=crop"
                alt="Maya Patel"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Maya Patel</h3>
                  <p className="text-sm text-brand-dusty-rose font-medium">Lifestyle Blogger</p>
                </div>
                <a
                  href="https://instagram.com/mayapatel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-dusty-rose hover:text-brand-taupe-brown transition-colors"
                  aria-label="Follow Maya on Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                "I love how these pieces celebrate individual style while maintaining that polished, sophisticated aesthetic I'm known for."
              </p>
            </div>
          </div>

          {/* Ambassador 3 */}
          <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="aspect-4/5 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=750&fit=crop"
                alt="Sophie Chen"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sophie Chen</h3>
                  <p className="text-sm text-brand-dusty-rose font-medium">Style Creator</p>
                </div>
                <a
                  href="https://instagram.com/sophiechen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-dusty-rose hover:text-brand-taupe-brown transition-colors"
                  aria-label="Follow Sophie on Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                "The quality and timeless design make Casual Chic my go-to recommendation for anyone building a versatile wardrobe."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">#CasualChicStyle</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Follow us <a href="https://instagram.com/casualchic" target="_blank" rel="noopener noreferrer" className="text-brand-dusty-rose hover:underline">@casualchic</a> for daily style inspiration
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden group cursor-pointer">
              <img
                src={`https://images.unsplash.com/photo-${1595777457583 + i * 1000}-95e059d581b8?w=400&h=400&fit=crop`}
                alt={`Instagram post ${i}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://instagram.com/casualchic"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Follow Us on Instagram
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
          <Link
            to="/about"
            className="inline-block px-8 py-3 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 rounded-lg font-medium transition-colors"
          >
            Learn More About Us
          </Link>
        </div>
      </section>
    </div>
  );
}
