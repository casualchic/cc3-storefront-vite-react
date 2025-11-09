/**
 * Header Component
 * Main navigation header with logo, search, menu, and cart icon
 */

import { useState } from 'react';
import CartIcon from './CartIcon';
import SearchBar from './SearchBar';
import MobileMenu from './MobileMenu';
import MegaMenu from './MegaMenu';

interface HeaderProps {
  brand: string;
}

export default function Header({ brand }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandName = brand === 'casual-chic' ? 'Casual Chic' :
                    brand === 'urban-edge' ? 'Urban Edge' :
                    'Eco Threads';

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <img src="/casual-chic-logo.png" alt={brandName} className="h-10 w-auto" />
              </a>
            </div>

            {/* Desktop Navigation with Mega Menus */}
            <nav className="hidden lg:flex items-center space-x-6">
              <a href="/shop" className="text-gray-700 hover:text-primary font-medium transition-colors">
                Shop All
              </a>

              <MegaMenu
                label="Apparel"
                sections={[
                  {
                    title: 'Clothing',
                    items: [
                      { label: 'Dresses', href: '/shop/dresses', description: 'Elegant & casual styles' },
                      { label: 'Tops', href: '/shop/tops', description: 'Versatile everyday pieces' },
                      { label: 'Bottoms', href: '/shop/bottoms', description: 'Comfortable & chic' },
                      { label: 'Outerwear', href: '/shop/outerwear', description: 'Jackets & coats' },
                    ],
                  },
                  {
                    title: 'Shop by Style',
                    items: [
                      { label: 'Casual', href: '/shop?style=casual' },
                      { label: 'Workwear', href: '/shop?style=workwear' },
                      { label: 'Evening', href: '/shop?style=evening' },
                      { label: 'Athleisure', href: '/shop?style=athleisure' },
                    ],
                  },
                  {
                    title: 'Featured',
                    items: [
                      { label: 'New Arrivals', href: '/shop?sort=newest' },
                      { label: 'Best Sellers', href: '/shop?featured=true' },
                      { label: 'Sale', href: '/shop?onSale=true' },
                    ],
                  },
                ]}
              />

              <MegaMenu
                label="Accessories"
                sections={[
                  {
                    title: 'Accessories',
                    items: [
                      { label: 'Bags', href: '/shop/bags', description: 'Handbags & totes' },
                      { label: 'Jewelry', href: '/shop/jewelry', description: 'Necklaces & earrings' },
                      { label: 'Scarves', href: '/shop/scarves', description: 'Silk & cotton' },
                      { label: 'Belts', href: '/shop/belts', description: 'Leather & fabric' },
                    ],
                  },
                  {
                    title: 'Shop by Occasion',
                    items: [
                      { label: 'Everyday', href: '/shop?occasion=everyday' },
                      { label: 'Special Events', href: '/shop?occasion=special' },
                      { label: 'Travel', href: '/shop?occasion=travel' },
                    ],
                  },
                  {
                    title: 'Trending',
                    items: [
                      { label: 'Statement Pieces', href: '/shop?trending=statement' },
                      { label: 'Minimalist', href: '/shop?trending=minimal' },
                    ],
                  },
                ]}
              />

              <a href="/collections" className="text-gray-700 hover:text-primary font-medium transition-colors">
                Collections
              </a>
            </nav>

            {/* Right side - Search, Cart Icon, Mobile Menu */}
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

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <CartIcon />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
