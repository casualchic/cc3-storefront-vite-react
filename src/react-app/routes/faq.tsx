import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { JSX } from 'react';

export const Route = createFileRoute('/faq')({
  component: FAQPage,
});

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
  category: string;
}

function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    // Orders & Shipping
    {
      category: 'Orders & Shipping',
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 5-7 business days. Express shipping (2-3 business days) is available at checkout. Free shipping on orders over $75.',
    },
    {
      category: 'Orders & Shipping',
      question: 'Do you ship internationally?',
      answer: 'Yes! We ship to over 50 countries worldwide. International shipping times vary by location (7-14 business days). Duties and taxes may apply based on your country.',
    },
    {
      category: 'Orders & Shipping',
      question: 'How can I track my order?',
      answer: (
        <>
          You'll receive a tracking number via email once your order ships. You can also track your order anytime on our{' '}
          <Link to="/track-order" className="text-brand-dusty-rose hover:underline">Track Order page</Link>.
        </>
      ),
    },
    {
      category: 'Orders & Shipping',
      question: 'Can I change or cancel my order?',
      answer: 'Orders can be modified or cancelled within 1 hour of placement. After that, items are processed for shipment. Contact us immediately at hello@casualchic.com if you need assistance.',
    },
    // Returns & Exchanges
    {
      category: 'Returns & Exchanges',
      question: 'What is your return policy?',
      answer: (
        <>
          We accept returns within 30 days of delivery for unworn, unwashed items with original tags. Returns are free and easy. Learn more on our{' '}
          <Link to="/returns" className="text-brand-dusty-rose hover:underline">Returns page</Link>.
        </>
      ),
    },
    {
      category: 'Returns & Exchanges',
      question: 'How do I start a return or exchange?',
      answer: 'Log into your account, go to Order History, select the order, and click "Return Items." Print the prepaid label and drop off at any carrier location. Refunds are processed within 5-7 business days of receipt.',
    },
    {
      category: 'Returns & Exchanges',
      question: 'Can I exchange items for a different size or color?',
      answer: 'Yes! When initiating your return, select "Exchange" and choose your preferred size or color. We\'ll ship the exchange once we receive your return.',
    },
    {
      category: 'Returns & Exchanges',
      question: 'Are sale items returnable?',
      answer: 'Yes, sale items follow the same 30-day return policy. All items must be unworn with original tags attached.',
    },
    // Sizing & Fit
    {
      category: 'Sizing & Fit',
      question: 'How do I find my size?',
      answer: (
        <>
          Check our detailed{' '}
          <Link to="/size-guide" className="text-brand-dusty-rose hover:underline">Size Guide</Link>{' '}
          with measurements for each category. We recommend measuring yourself and comparing to our charts for the best fit.
        </>
      ),
    },
    {
      category: 'Sizing & Fit',
      question: 'Do your sizes run true to size?',
      answer: 'Yes, our pieces are designed to fit true to size. Each product page includes specific fit notes (e.g., \'relaxed fit,\' \'runs small\'). Check customer reviews for additional fit feedback.',
    },
    {
      category: 'Sizing & Fit',
      question: 'What if I\'m between sizes?',
      answer: 'If you\'re between sizes, we recommend sizing up for a more relaxed fit or sizing down for a closer fit. Check the product description for specific recommendations.',
    },
    // Product & Care
    {
      category: 'Product & Care',
      question: 'How do I care for my items?',
      answer: 'Care instructions are on each garment\'s label. Generally, we recommend cold wash, gentle cycle, and air dry for longevity. Delicate items may require hand washing.',
    },
    {
      category: 'Product & Care',
      question: 'Are your products sustainable?',
      answer: (
        <>
          Yes! We're committed to sustainable fashion. Learn about our eco-friendly materials and ethical production on our{' '}
          <Link to="/sustainability" className="text-brand-dusty-rose hover:underline">Sustainability page</Link>.
        </>
      ),
    },
    {
      category: 'Product & Care',
      question: 'When will items be back in stock?',
      answer: 'Sign up for restock notifications on any out-of-stock product page. You\'ll receive an email as soon as the item is available again.',
    },
    // Payment & Security
    {
      category: 'Payment & Security',
      question: 'What payment methods do you accept?',
      answer: 'We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, and Google Pay. All transactions are secured with SSL encryption.',
    },
    {
      category: 'Payment & Security',
      question: 'Is my payment information secure?',
      answer: 'Absolutely. We use industry-standard SSL encryption and never store your full credit card information. All transactions are processed securely through trusted payment providers.',
    },
    {
      category: 'Payment & Security',
      question: 'Do you offer gift cards?',
      answer: 'Yes! Digital gift cards are available in amounts from $25 to $500. They never expire and can be used on any purchase.',
    },
    // Account & Membership
    {
      category: 'Account & Membership',
      question: 'Do I need an account to shop?',
      answer: 'No, you can checkout as a guest. However, creating an account lets you track orders, save favorites, and checkout faster.',
    },
    {
      category: 'Account & Membership',
      question: 'How do I reset my password?',
      answer: 'Click "Sign In" and then "Forgot Password." Enter your email and we\'ll send you a reset link.',
    },
    {
      category: 'Account & Membership',
      question: 'Do you have a loyalty program?',
      answer: 'Yes! Join our Style Rewards program to earn points on every purchase, get birthday perks, and access exclusive sales. Sign up at checkout or in your account settings.',
    },
  ];

  const categories = Array.from(new Set(faqData.map(item => item.category)));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about ordering, shipping, returns, and more. Can't find what you're looking for?{' '}
            <Link to="/contact" className="text-brand-dusty-rose hover:underline">Contact us</Link>.
          </p>
        </div>

        {/* FAQ by Category */}
        {categories.map((category, categoryIndex) => (
          <div key={category} className={categoryIndex > 0 ? 'mt-12' : ''}>
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
              {category}
            </h2>
            <div className="space-y-4">
              {faqData
                .filter(item => item.category === category)
                .map((item) => {
                  const globalIndex = faqData.indexOf(item);
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div
                      key={globalIndex}
                      className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full px-6 py-4 text-left flex items-start justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      >
                        <span className="font-medium text-gray-900 dark:text-white pr-4">
                          {item.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-gradient-to-br from-brand-light-beige/30 to-brand-cream dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
          <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-3">
            Still have questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our customer service team is here to help
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
}
