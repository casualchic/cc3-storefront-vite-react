/**
 * Mobile Menu Component
 * Slide-out navigation menu for mobile devices
 */

import { useState, useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    label: 'Shop All',
    href: '/shop',
    children: []
  },
  {
    label: 'Apparel',
    href: '/shop/apparel',
    children: [
      { label: 'Dresses', href: '/shop/dresses' },
      { label: 'Tops', href: '/shop/tops' },
      { label: 'Bottoms', href: '/shop/bottoms' },
      { label: 'Outerwear', href: '/shop/outerwear' },
    ]
  },
  {
    label: 'Accessories',
    href: '/shop/accessories',
    children: [
      { label: 'Bags', href: '/shop/bags' },
      { label: 'Jewelry', href: '/shop/jewelry' },
      { label: 'Scarves', href: '/shop/scarves' },
    ]
  },
  {
    label: 'Collections',
    href: '/collections',
    children: [
      { label: 'New Arrivals', href: '/shop?sort=newest' },
      { label: 'Best Sellers', href: '/shop?featured=true' },
      { label: 'Sale', href: '/shop?onSale=true' },
    ]
  },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Close menu when clicking escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const toggleExpanded = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-forest">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            {menuItems.map((item) => (
              <div key={item.label} className="mb-2">
                {item.children.length > 0 ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.label)}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg transition-colors text-left"
                    >
                      <span className="font-medium text-gray-900">{item.label}</span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${
                          expandedItem === item.label ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedItem === item.label && (
                      <div className="ml-4 mt-2 space-y-1">
                        <a
                          href={item.href}
                          className="block p-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={onClose}
                        >
                          View All {item.label}
                        </a>
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            className="block p-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={onClose}
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="block p-3 font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <a
              href="/account"
              className="block p-3 text-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={onClose}
            >
              My Account
            </a>
            <a
              href="/search"
              className="block p-3 text-center text-primary hover:bg-sage hover:text-white rounded-lg transition-colors font-medium"
              onClick={onClose}
            >
              Search Products
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
