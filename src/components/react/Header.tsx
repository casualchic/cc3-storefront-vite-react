/**
 * Header Component
 * Main navigation header with logo, search, menu, and cart icon
 */

import { useState } from 'react';
import CartIcon from './CartIcon';
import SearchBar from './SearchBar';

interface HeaderProps {
  brand: string;
}

export default function Header({ brand }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

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
          <nav className="hidden lg:flex items-center space-x-6">
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

          {/* Right side - Search, Cart Icon */}
          <div className="flex items-center gap-2">
            {/* Search Button/Bar */}
            <div className="hidden md:block">
              {showSearch ? (
                <div className="w-64">
                  <SearchBar
                    placeholder="Search..."
                    onSearch={() => setShowSearch(false)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Search"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Mobile Search Link */}
            <a href="/search" className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Search">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </a>

            {/* Mobile menu button - placeholder */}
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Open menu">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}
