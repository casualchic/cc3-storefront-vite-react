/**
 * Header Component
 * Main navigation header with logo, menu, and cart icon
 */

import CartIcon from './CartIcon';

interface HeaderProps {
  brand: string;
}

export default function Header({ brand }: HeaderProps) {
  const brandName = brand === 'casual-chic' ? 'Casual Chic' :
                    brand === 'urban-edge' ? 'Urban Edge' :
                    'Eco Threads';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
              {brandName}
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/shop" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Shop All
            </a>
            <a href="/shop/women" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Women
            </a>
            <a href="/shop/men" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Men
            </a>
            <a href="/shop/accessories" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Accessories
            </a>
            <a href="/collections" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Collections
            </a>
          </nav>

          {/* Right side - Cart Icon */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button - placeholder for future implementation */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Open menu">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <CartIcon client:load />
          </div>
        </div>
      </div>
    </header>
  );
}
