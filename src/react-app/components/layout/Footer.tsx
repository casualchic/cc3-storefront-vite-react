import { useState, useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { Facebook, Instagram, Twitter, Send, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const resetTimerRef = useRef<number | null>(null);

  const scheduleReset = () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => setStatus('idle'), 3000);
  };

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      scheduleReset();
      return;
    }

    // Simulate API call
    setStatus('success');
    setEmail('');
    scheduleReset();
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-light-beige dark:bg-gray-950 border-t border-brand-taupe/30 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <img
                src="/images/logo-dark.png"
                alt="Casual Chic Boutique"
                className="h-14 w-auto dark:hidden"
              />
              <img
                src="/images/logo-light.png"
                alt="Casual Chic Boutique"
                className="h-14 w-auto hidden dark:block"
              />
            </Link>
            <p className="text-gray-700 dark:text-gray-400 text-sm mb-4 max-w-md">
              Discover your perfect style with our curated collection of casual and chic fashion essentials.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@casualchic.com" className="hover:text-black dark:hover:text-white transition-colors">
                  hello@casualchic.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <Phone className="w-4 h-4" />
                <a href="tel:+1234567890" className="hover:text-black dark:hover:text-white transition-colors">
                  (123) 456-7890
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>123 Fashion Ave, New York, NY 10001</span>
              </div>
            </div>

            {/* Social Links */}
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
            <h4 className="font-semibold text-black dark:text-white mb-4 uppercase text-xs tracking-wider">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/collections/new-arrivals" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">New Arrivals</Link></li>
              <li><Link to="/collections/best-sellers" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Best Sellers</Link></li>
              <li><Link to="/sale" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Sale</Link></li>
              <li><Link to="/category/$slug" params={{ slug: 'dresses' }} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Dresses</Link></li>
              <li><Link to="/category/$slug" params={{ slug: 'tops' }} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Tops</Link></li>
              <li><Link to="/category/$slug" params={{ slug: 'bottoms' }} className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Bottoms</Link></li>
            </ul>
          </div>

          {/* Customer Service Section */}
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-4 uppercase text-xs tracking-wider">Customer Care</h4>
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
            <h4 className="font-semibold text-black dark:text-white mb-4 uppercase text-xs tracking-wider">About</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Our Story</Link></li>
              <li><Link to="/careers" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Careers</Link></li>
              <li><Link to="/sustainability" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Sustainability</Link></li>
              <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Join Our Style Community</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get exclusive access to new arrivals, special offers, and style tips.
                </p>
              </div>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 font-medium text-sm whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  Subscribe
                </button>
              </form>
              {status === 'success' && (
                <p className="mt-3 text-sm text-center text-green-600 dark:text-green-400">
                  ✓ Thanks for subscribing! Check your inbox.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-3 text-sm text-center text-red-600 dark:text-red-400">
                  Please enter a valid email address.
                </p>
              )}
              <p className="mt-3 text-xs text-center text-gray-500 dark:text-gray-500">
                By subscribing you agree to our <Link to="/privacy" className="underline hover:text-black dark:hover:text-white">Privacy Policy</Link> and consent to receive updates.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © {currentYear} Casual Chic. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                {/* Payment Icons */}
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-10 h-7 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center text-xs font-semibold">
                    VISA
                  </div>
                  <div className="w-10 h-7 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center text-xs font-semibold">
                    MC
                  </div>
                  <div className="w-10 h-7 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center text-xs font-semibold">
                    AMEX
                  </div>
                  <div className="w-10 h-7 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center text-xs font-semibold">
                    PAY
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-500">
              <span className="flex items-center gap-1">
                <span className="text-green-600">✓</span> Secure Checkout
              </span>
              <span className="flex items-center gap-1">
                <span className="text-blue-600">✓</span> Free Shipping Over $75
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
