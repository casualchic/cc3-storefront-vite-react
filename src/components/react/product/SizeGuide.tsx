/**
 * SizeGuide Component
 * Modal displaying size chart and measurements
 */

import { useState } from 'react';

interface SizeGuideProps {
  category?: 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes';
}

// Size chart data (can be moved to a config file later)
const SIZE_CHARTS = {
  tops: {
    title: 'Tops & Shirts',
    headers: ['Size', 'Bust (in)', 'Waist (in)', 'Length (in)'],
    rows: [
      ['XS', '32-34', '24-26', '24'],
      ['S', '34-36', '26-28', '25'],
      ['M', '36-38', '28-30', '26'],
      ['L', '38-40', '30-32', '27'],
      ['XL', '40-42', '32-34', '28'],
      ['XXL', '42-44', '34-36', '29'],
    ],
  },
  bottoms: {
    title: 'Pants & Jeans',
    headers: ['Size', 'Waist (in)', 'Hips (in)', 'Inseam (in)'],
    rows: [
      ['XS (0-2)', '24-26', '34-36', '30'],
      ['S (4-6)', '26-28', '36-38', '30'],
      ['M (8-10)', '28-30', '38-40', '30'],
      ['L (12-14)', '30-32', '40-42', '30'],
      ['XL (16-18)', '32-34', '42-44', '30'],
      ['XXL (20-22)', '34-36', '44-46', '30'],
    ],
  },
  dresses: {
    title: 'Dresses',
    headers: ['Size', 'Bust (in)', 'Waist (in)', 'Hips (in)', 'Length (in)'],
    rows: [
      ['XS', '32-34', '24-26', '34-36', '36'],
      ['S', '34-36', '26-28', '36-38', '37'],
      ['M', '36-38', '28-30', '38-40', '38'],
      ['L', '38-40', '30-32', '40-42', '39'],
      ['XL', '40-42', '32-34', '42-44', '40'],
      ['XXL', '42-44', '34-36', '44-46', '41'],
    ],
  },
  outerwear: {
    title: 'Jackets & Coats',
    headers: ['Size', 'Chest (in)', 'Shoulder (in)', 'Sleeve (in)'],
    rows: [
      ['XS', '32-34', '14-15', '32'],
      ['S', '34-36', '15-16', '33'],
      ['M', '36-38', '16-17', '34'],
      ['L', '38-40', '17-18', '35'],
      ['XL', '40-42', '18-19', '36'],
      ['XXL', '42-44', '19-20', '37'],
    ],
  },
  shoes: {
    title: 'Footwear',
    headers: ['US Size', 'EU Size', 'UK Size', 'Length (in)'],
    rows: [
      ['6', '36', '3.5', '9.0'],
      ['6.5', '37', '4', '9.2'],
      ['7', '37.5', '4.5', '9.4'],
      ['7.5', '38', '5', '9.6'],
      ['8', '38.5', '5.5', '9.8'],
      ['8.5', '39', '6', '10.0'],
      ['9', '40', '6.5', '10.2'],
      ['9.5', '40.5', '7', '10.4'],
      ['10', '41', '7.5', '10.6'],
    ],
  },
};

export default function SizeGuide({ category = 'tops' }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(category);

  const sizeChart = SIZE_CHARTS[selectedTab];

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-primary hover:text-sage underline font-medium"
      >
        Size Guide
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral">
              <h2 className="text-2xl font-heading font-bold text-forest">
                Size Guide
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-neutral rounded-full transition-colors"
                aria-label="Close size guide"
              >
                <svg className="w-6 h-6 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral overflow-x-auto">
              {Object.keys(SIZE_CHARTS).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedTab(cat as keyof typeof SIZE_CHARTS)}
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                    selectedTab === cat
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-charcoal hover:text-primary hover:bg-neutral'
                  }`}
                >
                  {SIZE_CHARTS[cat as keyof typeof SIZE_CHARTS].title}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Measurement Instructions */}
              <div className="bg-neutral/50 rounded-lg p-4">
                <h3 className="font-heading font-bold text-forest mb-2">
                  How to Measure
                </h3>
                <ul className="space-y-2 text-sm text-charcoal">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Measure over your underwear or a thin layer of clothing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Keep the tape measure parallel to the floor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Don't pull the tape too tight - it should be snug but comfortable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>If you're between sizes, we recommend sizing up for a relaxed fit</span>
                  </li>
                </ul>
              </div>

              {/* Size Chart Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-neutral">
                      {sizeChart.headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-4 py-3 text-left font-heading font-bold text-forest border-b-2 border-primary"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={`${
                          rowIndex % 2 === 0 ? 'bg-white' : 'bg-neutral/30'
                        } hover:bg-sage/10 transition-colors`}
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`px-4 py-3 text-sm ${
                              cellIndex === 0 ? 'font-semibold text-forest' : 'text-charcoal'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Fit Guide */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="font-heading font-bold text-forest mb-2">
                  Fit Guide
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-charcoal">
                  <div>
                    <p className="font-semibold mb-1">Relaxed Fit</p>
                    <p className="text-xs">Loose and comfortable with extra room</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Regular Fit</p>
                    <p className="text-xs">True to size with slight ease</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Slim Fit</p>
                    <p className="text-xs">Closer to body with minimal ease</p>
                  </div>
                </div>
              </div>

              {/* Contact Support */}
              <p className="text-center text-sm text-charcoal">
                Still not sure about sizing?{' '}
                <a href="/contact" className="text-primary hover:text-sage font-medium underline">
                  Contact our support team
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
