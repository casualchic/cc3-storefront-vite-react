// src/react-app/routes/returns.lazy.tsx

import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { RotateCcw, Package, Check, X, Mail } from '@/lib/icons';

const ReturnsPageComponent = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Returns & Exchanges
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We want you to love your purchase. If you're not completely satisfied, we offer easy returns within 30 days.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-linear-to-br from-brand-light-beige/30 to-brand-cream dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">30-Day Returns</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Free & easy returns</p>
          </div>
          <div className="bg-linear-to-br from-brand-light-beige/30 to-brand-cream dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Free Return Shipping</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Prepaid labels included</p>
          </div>
          <div className="bg-linear-to-br from-brand-light-beige/30 to-brand-cream dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Quick Refunds</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">5-7 business days</p>
          </div>
        </div>

        {/* Return Policy */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">Our Return Policy</h2>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-1 shrink-0" />
                <span>Returns accepted within <strong>30 days</strong> of delivery</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-1 shrink-0" />
                <span>Items must be unworn, unwashed, and in original condition with tags attached</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-1 shrink-0" />
                <span>Free return shipping with prepaid labels (US only)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-1 shrink-0" />
                <span>Refunds processed within 5-7 business days of receipt</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-1 shrink-0" />
                <span>Sale and clearance items are eligible for returns</span>
              </li>
            </ul>
          </div>
        </section>

        {/* What Can't Be Returned */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">Non-Returnable Items</h2>
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-600 dark:text-red-400 mt-1 shrink-0" />
                <span>Items without original tags or packaging</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-600 dark:text-red-400 mt-1 shrink-0" />
                <span>Worn, washed, or altered items</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-600 dark:text-red-400 mt-1 shrink-0" />
                <span>Intimates, swimwear, and earrings (for hygiene reasons)</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-600 dark:text-red-400 mt-1 shrink-0" />
                <span>Final sale items (clearly marked on product pages)</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-600 dark:text-red-400 mt-1 shrink-0" />
                <span>Gift cards and digital products</span>
              </li>
            </ul>
          </div>
        </section>

        {/* How to Return */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">How to Return an Item</h2>
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-dusty-rose rounded-full flex items-center justify-center shrink-0 text-white font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Start Your Return</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Log into your account, go to Order History, and select "Return Items" on the order you'd like to return.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-dusty-rose rounded-full flex items-center justify-center shrink-0 text-white font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Print Your Label</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  You'll receive a prepaid return shipping label via email. Print it and attach it to your package.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-dusty-rose rounded-full flex items-center justify-center shrink-0 text-white font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Ship It Back</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Drop off your package at any USPS, UPS, or FedEx location. Keep your receipt for tracking.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-dusty-rose rounded-full flex items-center justify-center shrink-0 text-white font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Get Your Refund</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Once we receive and inspect your return, we'll process your refund within 5-7 business days to your original payment method.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Exchanges */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">Exchanges</h2>
          <div className="bg-linear-to-br from-brand-light-beige/30 to-brand-cream dark:from-gray-800 dark:to-gray-900 rounded-lg p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Need a different size or color? We've got you covered! When starting your return, select "Exchange" and choose your preferred option.
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm mb-4">
              <li className="flex items-start gap-2">
                <span className="text-brand-dusty-rose mt-1">•</span>
                <span>We'll ship your exchange once we receive your return</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-dusty-rose mt-1">•</span>
                <span>Exchanges ship free with standard shipping</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-dusty-rose mt-1">•</span>
                <span>If the price differs, we'll charge or refund the difference</span>
              </li>
            </ul>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Pro Tip:</strong> For faster service, you can return the original item and place a new order for the item you want.
            </p>
          </div>
        </section>

        {/* International Returns */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">International Returns</h2>
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              International returns are accepted within 30 days. Please note:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-brand-dusty-rose mt-1">•</span>
                <span>Return shipping costs are the customer's responsibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-dusty-rose mt-1">•</span>
                <span>We recommend using a tracked shipping service</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-dusty-rose mt-1">•</span>
                <span>Original shipping fees and duties/taxes are non-refundable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-dusty-rose mt-1">•</span>
                <span>Contact us for a return authorization before shipping</span>
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">Returns FAQ</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">When will I receive my refund?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Refunds are processed within 5-7 business days after we receive your return. Depending on your bank, it may take an additional 3-5 days to appear in your account.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can I return items without a receipt?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes! As long as you purchased through our website and have an account, we can look up your order. Contact us if you need assistance.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What if my item arrived damaged or defective?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We're so sorry! Contact us immediately at hello@casualchic.com with photos. We'll send a replacement or provide a full refund right away.
              </p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <div className="text-center bg-linear-to-br from-brand-light-beige/30 to-brand-cream dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
          <div className="w-16 h-16 bg-brand-dusty-rose/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-brand-dusty-rose" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-3">
            Need Help with a Return?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our customer service team is here to assist you
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="mailto:hello@casualchic.com"
              className="px-8 py-3 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black rounded-lg font-medium transition-colors"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/returns')({
  component: ReturnsPageComponent,
});
