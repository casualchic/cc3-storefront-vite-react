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

type MenuItemWithSlug = { name: string; slug: string };
type MenuItemWithTo = { name: string; to: string };
type MenuItem = MenuItemWithSlug | MenuItemWithTo;

const isSlugItem = (item: MenuItem): item is MenuItemWithSlug => {
  return 'slug' in item;
};

const megaMenuCategories = {
  women: {
    title: 'Shop',
    sections: [
      {
        title: 'Tops',
        items: [
          { name: 'All Tops', slug: 'tops' },
          { name: 'T-Shirts & Tees', slug: 'tshirts' },
          { name: 'Blouses & Shirts', slug: 'blouses' },
          { name: 'Sweaters & Cardigans', slug: 'sweaters' },
          { name: 'Tank Tops & Camis', slug: 'tanks' },
          { name: 'Hoodies & Sweatshirts', slug: 'hoodies' },
        ]
      },
      {
        title: 'Bottoms',
        items: [
          { name: 'All Bottoms', slug: 'bottoms' },
          { name: 'Jeans', slug: 'jeans' },
          { name: 'Pants & Trousers', slug: 'pants' },
          { name: 'Shorts', slug: 'shorts' },
          { name: 'Skirts', slug: 'skirts' },
          { name: 'Leggings', slug: 'leggings' },
        ]
      },
      {
        title: 'Dresses',
        items: [
          { name: 'All Dresses', slug: 'dresses' },
          { name: 'Casual Dresses', slug: 'casual-dresses' },
          { name: 'Maxi Dresses', slug: 'maxi-dresses' },
          { name: 'Mini Dresses', slug: 'mini-dresses' },
          { name: 'Midi Dresses', slug: 'midi-dresses' },
          { name: 'Evening Dresses', slug: 'evening-dresses' },
        ]
      },
      {
        title: 'Outerwear',
        items: [
          { name: 'All Outerwear', slug: 'outerwear' },
          { name: 'Jackets', slug: 'jackets' },
          { name: 'Coats', slug: 'coats' },
          { name: 'Blazers', slug: 'blazers' },
          { name: 'Denim Jackets', slug: 'denim-jackets' },
          { name: 'Vests', slug: 'vests' },
        ]
      },
      {
        title: 'Accessories',
        items: [
          { name: 'All Accessories', slug: 'accessories' },
          { name: 'Jewelry', slug: 'jewelry' },
          { name: 'Bags & Purses', slug: 'bags' },
          { name: 'Shoes', slug: 'shoes' },
          { name: 'Belts', slug: 'belts' },
          { name: 'Hats & Scarves', slug: 'hats-scarves' },
        ]
      },
      {
        title: 'Featured',
        items: [
          { name: 'New Arrivals', to: '/collections/new-arrivals' },
          { name: 'Best Sellers', to: '/collections/best-sellers' },
          { name: 'Sale', to: '/sale' },
          { name: 'Under $150', to: '/collections/under-50' },
          { name: 'Gift Guide', to: '/collections/gifts' },
          { name: 'Trending Now', to: '/collections/trending' },
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
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuDropdownRef = useRef<HTMLDivElement>(null);

  const { totalItems: cartItemsCount } = useCart();
  const { totalItems: wishlistItemsCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // Close mega menu on scroll
      if (activeMegaMenu) {
        setActiveMegaMenu(null);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideTrigger = megaMenuRef.current?.contains(target);
      const isInsideDropdown = megaMenuDropdownRef.current?.contains(target);

      if (!isInsideTrigger && !isInsideDropdown) {
        setActiveMegaMenu(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMegaMenu(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeMegaMenu]);

  const handleMegaMenuEnter = (menu: string) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setActiveMegaMenu(menu);
  };

  const toggleMegaMenu = (menu: string) => {
    setActiveMegaMenu(prev => (prev === menu ? null : menu));
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
    <header className={`sticky top-0 z-50 bg-brand-cream dark:bg-gray-900 transition-all duration-200 ${
      isScrolled ? 'shadow-lg' : ''
    }`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Bar - Smoothly hide when scrolled */}
          <div className={`border-b border-brand-taupe/30 dark:border-gray-800 transition-all duration-200 overflow-hidden ${
            isScrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
          }`}>
            <div className="flex items-center justify-between h-10 text-xs">
              <div className="text-gray-700 dark:text-gray-400">
                Free shipping on orders over $75
              </div>
              <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-400">
                <Link to="/help" className="hover:text-gray-900 dark:hover:text-gray-100">Help</Link>
                <Link to="/track-order" className="hover:text-gray-900 dark:hover:text-gray-100">Track Order</Link>
              </div>
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="block">
                <img
                  src="/images/logo-dark.png"
                  alt="Casual Chic Boutique"
                  className="h-20 w-auto dark:hidden"
                />
                <img
                  src="/images/logo-light.png"
                  alt="Casual Chic Boutique"
                  className="h-20 w-auto hidden dark:block"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {/* Mega Menu Trigger */}
              <div
                ref={megaMenuRef}
                className="relative"
                onMouseEnter={() => handleMegaMenuEnter('women')}
                onMouseLeave={handleMegaMenuLeave}
              >
                <button
                  type="button"
                  onClick={() => toggleMegaMenu('women')}
                  onFocus={() => handleMegaMenuEnter('women')}
                  onBlur={handleMegaMenuLeave}
                  aria-haspopup="menu"
                  aria-expanded={activeMegaMenu === 'women'}
                  aria-controls="mega-menu-women"
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
                className="text-sm font-medium text-brand-dusty-rose hover:text-brand-dusty-rose/80 transition-colors"
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
            id="mega-menu-women"
            ref={megaMenuDropdownRef}
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
                          {isSlugItem(item) ? (
                            <Link
                              to="/category/$slug"
                              params={{ slug: item.slug }}
                              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 block"
                              onClick={() => setActiveMegaMenu(null)}
                            >
                              {item.name}
                            </Link>
                          ) : (
                            <Link
                              to={item.to}
                              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200 block"
                              onClick={() => setActiveMegaMenu(null)}
                            >
                              {item.name}
                            </Link>
                          )}
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
                    onClick={() => setActiveMegaMenu(null)}
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
                    onClick={() => setActiveMegaMenu(null)}
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
    </header>
  );
}
