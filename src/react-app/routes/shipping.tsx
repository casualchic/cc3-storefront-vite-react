import { createFileRoute, Link } from '@tanstack/react-router';
import { Package, Truck, Globe, Clock, MapPin, CreditCard } from '@/lib/icons';

export const Route = createFileRoute('/shipping')({
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Shipping Information
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Fast, reliable delivery to your door. Learn about our shipping options, delivery times, and tracking.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-linear-to-br from-brand-light-beige/30 to-brand-cream dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Free Shipping</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">On orders over $75</p>
          </div>
          <div className="bg-linear-to-br from-brand-light-beige/30 to-brand-cream dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">International</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ship to 50+ countries</p>
          </div>
          <div className="bg-linear-to-br from-brand-light-beige/30 to-brand-cream dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Track Your Order</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Real-time updates</p>
          </div>
        </div>

        {/* Shipping Options */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">Shipping Options</h2>

          <div className="space-y-4">
            {/* Standard Shipping */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-dusty-rose" />
                    Standard Shipping (5-7 Business Days)
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Delivered via USPS, UPS, or FedEx Ground
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">$5.99</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Free over $75</p>
                </div>
              </div>
            </div>

            {/* Express Shipping */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-brand-dusty-rose" />
                    Express Shipping (2-3 Business Days)
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Expedited delivery via UPS or FedEx
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">$14.99</p>
                </div>
              </div>
            </div>

            {/* Overnight Shipping */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Package className="w-5 h-5 text-brand-dusty-rose" />
                    Overnight Shipping (1 Business Day)
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Next-day delivery via FedEx or UPS (order by 12pm EST)
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">$29.99</p>
                </div>
              </div>
            </div>

            {/* International Shipping */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-brand-dusty-rose" />
                    International Shipping (7-14 Business Days)
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Available to 50+ countries. Duties and taxes may apply.
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">Varies</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Calculated at checkout</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Processing Time */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">Order Processing</h2>
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-brand-dusty-rose mt-1">•</span>
                <span>Orders placed before 12pm EST ship the same business day</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-dusty-rose mt-1">•</span>
                <span>Orders placed after 12pm EST ship the next business day</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-dusty-rose mt-1">•</span>
                <span>Processing time is 1-2 business days for all orders</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-dusty-rose mt-1">•</span>
                <span>Weekend and holiday orders ship the next business day</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Order Tracking */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">Track Your Order</h2>
          <div className="bg-linear-to-br from-brand-light-beige/30 to-brand-cream dark:from-gray-800 dark:to-gray-900 rounded-lg p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Once your order ships, you'll receive a tracking number via email. You can track your package at any time:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/track-order"
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-center"
              >
                Track Your Order
              </Link>
              <a
                href="mailto:hello@casualchic.com"
                className="px-6 py-3 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black rounded-lg font-medium transition-colors text-center"
              >
                Contact Support
              </a>
            </div>
          </div>
        </section>

        {/* Shipping Restrictions */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">Important Information</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-dusty-rose mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">PO Boxes & APO/FPO Addresses</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We ship to PO Boxes via USPS only. APO/FPO addresses are supported with standard shipping.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-brand-dusty-rose mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">International Duties & Taxes</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  International customers are responsible for all import duties, taxes, and customs fees. These charges are not included in your order total.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-brand-dusty-rose mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Shipping Delays</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  While rare, delays can occur due to weather, carrier issues, or customs processing. We'll keep you updated via email.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">Shipping FAQ</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">When will my order arrive?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Delivery times vary by shipping method. Standard shipping takes 5-7 business days, express takes 2-3 days, and overnight arrives the next business day.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can I change my shipping address?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes, within 1 hour of placing your order. Contact us immediately at hello@casualchic.com. Once shipped, addresses cannot be changed.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What if my package is lost or damaged?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Contact us immediately and we'll work with the carrier to resolve the issue. We'll send a replacement or issue a refund for lost or damaged packages.
              </p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-linear-to-br from-brand-light-beige/30 to-brand-cream dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
          <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-3">
            Questions about shipping?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our team is here to help with any shipping questions or concerns
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
