import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    title: 'Women',
    sections: [
      {
        title: 'Clothing',
        items: [
          { name: 'Dresses', href: '/category/dresses' },
          { name: 'Tops & Blouses', href: '/category/tops' },
          { name: 'Bottoms', href: '/category/bottoms' },
          { name: 'Outerwear', href: '/category/outerwear' },
          { name: 'Sweaters', href: '/category/sweaters' },
        ]
      },
      {
        title: 'Accessories',
        items: [
          { name: 'Bags & Purses', href: '/category/bags' },
          { name: 'Jewelry', href: '/category/jewelry' },
          { name: 'Shoes', href: '/category/shoes' },
          { name: 'Belts', href: '/category/belts' },
        ]
      },
      {
        title: 'Shop by Occasion',
        items: [
          { name: 'Work & Office', href: '/category/work' },
          { name: 'Weekend Casual', href: '/category/casual' },
          { name: 'Date Night', href: '/category/date-night' },
          { name: 'Travel Essentials', href: '/category/travel' }
        ]
      },
      {
        title: 'Featured',
        items: [
          { name: 'New Arrivals', href: '/collections/new-arrivals' },
          { name: 'Best Sellers', href: '/collections/best-sellers' },
          { name: 'Sale Items', href: '/sale' },
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
    setActiveMegaMenu(menu);
  };

  const handleMegaMenuLeave = () => {
    setActiveMegaMenu(null);
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
                    <Link to="/category/dresses" className="block text-gray-700 dark:text-gray-300">Dresses</Link>
                    <Link to="/category/tops" className="block text-gray-700 dark:text-gray-300">Tops</Link>
                    <Link to="/category/outerwear" className="block text-gray-700 dark:text-gray-300">Outerwear</Link>
                    <Link to="/category/accessories" className="block text-gray-700 dark:text-gray-300">Accessories</Link>
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
            onMouseEnter={() => setActiveMegaMenu('women')}
            onMouseLeave={handleMegaMenuLeave}
          >
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="grid grid-cols-4 gap-8">
                {/* Menu Sections */}
                {megaMenuCategories.women.sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link
                            to={item.href}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
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
