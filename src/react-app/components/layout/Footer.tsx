import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Facebook, Instagram, Twitter, Send } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    // Simulate API call
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 3000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">Casual Chic</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Discover your perfect style with our curated collection of casual and chic fashion essentials.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/category/$slug" params={{ slug: 'dresses' }} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Dresses</Link></li>
              <li><Link to="/category/$slug" params={{ slug: 'tops' }} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Tops</Link></li>
              <li><Link to="/category/$slug" params={{ slug: 'bottoms' }} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Bottoms</Link></li>
              <li><Link to="/category/$slug" params={{ slug: 'outerwear' }} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Outerwear</Link></li>
              <li><Link to="/category/$slug" params={{ slug: 'accessories' }} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Accessories</Link></li>
            </ul>
          </div>

          {/* Customer Service Section */}
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="/size-guide" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Size Guide</Link></li>
              <li><Link to="/shipping" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">FAQ</Link></li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Careers</Link></li>
              <li><Link to="/press" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Press</Link></li>
              <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Stay in Touch</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </form>
            {status === 'success' && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400">Thanks for subscribing!</p>
            )}
            {status === 'error' && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">Please enter a valid email address.</p>
            )}
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              By subscribing you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} Casual Chic. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400 dark:text-gray-600 text-sm">
                Built with ♥ for fashion lovers
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
