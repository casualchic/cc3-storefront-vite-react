import { useState, useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';

const megaMenuCategories = {
  women: {
    title: 'Shop',
    sections: [
      {
        title: 'Tops',
        items: [
          { name: 'All Tops', href: '/category/tops' },
          { name: 'T-Shirts & Tees', href: '/category/tshirts' },
          { name: 'Blouses & Shirts', href: '/category/blouses' },
          { name: 'Sweaters & Cardigans', href: '/category/sweaters' },
          { name: 'Tank Tops & Camis', href: '/category/tanks' },
          { name: 'Hoodies & Sweatshirts', href: '/category/hoodies' },
        ]
      },
      {
        title: 'Bottoms',
        items: [
          { name: 'All Bottoms', href: '/category/bottoms' },
          { name: 'Jeans', href: '/category/jeans' },
          { name: 'Pants & Trousers', href: '/category/pants' },
          { name: 'Shorts', href: '/category/shorts' },
          { name: 'Skirts', href: '/category/skirts' },
          { name: 'Leggings', href: '/category/leggings' },
        ]
      },
      {
        title: 'Dresses',
        items: [
          { name: 'All Dresses', href: '/category/dresses' },
          { name: 'Casual Dresses', href: '/category/casual-dresses' },
          { name: 'Maxi Dresses', href: '/category/maxi-dresses' },
          { name: 'Mini Dresses', href: '/category/mini-dresses' },
          { name: 'Midi Dresses', href: '/category/midi-dresses' },
          { name: 'Evening Dresses', href: '/category/evening-dresses' },
        ]
      },
      {
        title: 'Outerwear',
        items: [
          { name: 'All Outerwear', href: '/category/outerwear' },
          { name: 'Jackets', href: '/category/jackets' },
          { name: 'Coats', href: '/category/coats' },
          { name: 'Blazers', href: '/category/blazers' },
          { name: 'Denim Jackets', href: '/category/denim-jackets' },
          { name: 'Vests', href: '/category/vests' },
        ]
      },
      {
        title: 'Accessories',
        items: [
          { name: 'All Accessories', href: '/category/accessories' },
          { name: 'Jewelry', href: '/category/jewelry' },
          { name: 'Bags & Purses', href: '/category/bags' },
          { name: 'Shoes', href: '/category/shoes' },
          { name: 'Belts', href: '/category/belts' },
          { name: 'Hats & Scarves', href: '/category/hats-scarves' },
        ]
      },
      {
        title: 'Featured',
        items: [
          { name: 'New Arrivals', href: '/collections/new-arrivals' },
          { name: 'Best Sellers', href: '/collections/best-sellers' },
          { name: 'Sale', href: '/sale' },
          { name: 'Under $50', href: '/collections/under-50' },
          { name: 'Gift Guide', href: '/collections/gifts' },
          { name: 'Trending Now', href: '/collections/trending' },
        ]
      }
    ],
  }
};

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { totalItems: cartItemsCount } = useCart();
  const { totalItems: wishlistItemsCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMegaMenuEnter = (menu: string) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setActiveMegaMenu(menu);
  };

  const handleMegaMenuLeave = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 300);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white dark:bg-gray-900 shadow-lg'
          : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Bar - Only show when not scrolled */}
          <div className={`transition-all duration-300 overflow-hidden ${
            isScrolled ? 'h-0' : 'h-10'
          }`}>
            <div className="flex items-center justify-between h-10 text-xs">
              <div className="text-gray-600 dark:text-gray-400">
                Free shipping on orders over $75
              </div>
              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                <Link to="/help" className="hover:text-gray-900 dark:hover:text-gray-100">Help</Link>
                <Link to="/track-order" className="hover:text-gray-900 dark:hover:text-gray-100">Track Order</Link>
              </div>
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                CasualChic
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {/* Mega Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => handleMegaMenuEnter('women')}
                onMouseLeave={handleMegaMenuLeave}
              >
                <button
                  className="flex items-center space-x-1 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <span>Shop</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <Link
                to="/collections"
                className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Collections
              </Link>
              <Link
                to="/sale"
                className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors"
              >
                Sale
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account */}
              <button
                className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800">
              <div className="py-4 space-y-4">
                <Link to="/collections" className="block text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300">Collections</Link>
                <Link to="/sale" className="block text-red-600 hover:text-red-500">Sale</Link>
                <Link to="/about" className="block text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300">About</Link>
                <Link to="/contact" className="block text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300">Contact</Link>

                {/* Mobile Categories */}
                <div className="border-t dark:border-gray-800 pt-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Categories</h4>
                  <div className="space-y-2 pl-4">
                    <Link to="/category/$slug" params={{ slug: 'dresses' }} className="block text-gray-700 dark:text-gray-300">Dresses</Link>
                    <Link to="/category/$slug" params={{ slug: 'tops' }} className="block text-gray-700 dark:text-gray-300">Tops</Link>
                    <Link to="/category/$slug" params={{ slug: 'outerwear' }} className="block text-gray-700 dark:text-gray-300">Outerwear</Link>
                    <Link to="/category/$slug" params={{ slug: 'accessories' }} className="block text-gray-700 dark:text-gray-300">Accessories</Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mega Menu */}
        {activeMegaMenu === 'women' && (
          <div
            className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl border-t dark:border-gray-800"
            onMouseEnter={() => handleMegaMenuEnter('women')}
            onMouseLeave={handleMegaMenuLeave}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-x-6 gap-y-8">
                {/* Menu Sections */}
                {megaMenuCategories.women.sections.map((section, index) => (
                  <div key={index} className="lg:col-span-1">
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-widest">{section.title}</h3>
                    <ul className="space-y-2.5">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link
                            to={item.href}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 block"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Featured Visual Sections */}
                <div className="lg:col-span-2 hidden lg:grid grid-rows-2 gap-4">
                  {/* New Arrivals Featured */}
                  <Link
                    to="/collections/new-arrivals"
                    className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-6 flex flex-col justify-end h-full min-h-[180px] transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="relative z-10">
                      <p className="text-xs font-semibold text-white/80 mb-1 uppercase tracking-wider">Just In</p>
                      <h4 className="text-lg font-bold text-white mb-1">New Arrivals</h4>
                      <p className="text-sm text-white/90 group-hover:underline">Shop the latest styles →</p>
                    </div>
                  </Link>

                  {/* Sale Featured */}
                  <Link
                    to="/sale"
                    className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 p-6 flex flex-col justify-end h-full min-h-[180px] transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/40 to-transparent"></div>
                    <div className="relative z-10">
                      <p className="text-xs font-semibold text-red-900 dark:text-red-200 mb-1 uppercase tracking-wider">Limited Time</p>
                      <h4 className="text-lg font-bold text-red-900 dark:text-white mb-1">Sale</h4>
                      <p className="text-sm text-red-800 dark:text-red-100 group-hover:underline">Up to 50% off →</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Header Spacer */}
      <div className={isScrolled ? "h-16" : "h-26"}></div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl mx-4 rounded-lg shadow-2xl">
            <div className="p-4">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="flex-1 outline-none text-gray-900 dark:text-white bg-transparent"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
