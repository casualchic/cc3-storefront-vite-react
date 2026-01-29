import { useState } from 'react';
import { Truck, MapPin } from 'lucide-react';

interface ShippingEstimateProps {
  productName: string;
}

export function ShippingEstimate({ productName }: ShippingEstimateProps) {
  const [zipCode, setZipCode] = useState('');
  const [estimate, setEstimate] = useState<{
    standard: string;
    express: string;
  } | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!zipCode || zipCode.length < 5) {
      setError('Please enter a valid ZIP code');
      return;
    }

    // Simulate shipping estimate calculation
    // In production, this would call a shipping API
    const today = new Date();
    const standardDays = 5;
    const expressDays = 2;

    const standardDate = new Date(today);
    standardDate.setDate(today.getDate() + standardDays);

    const expressDate = new Date(today);
    expressDate.setDate(today.getDate() + expressDays);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    };

    setEstimate({
      standard: formatDate(standardDate),
      express: formatDate(expressDate),
    });
  };

  return (
    <div className="border-t dark:border-gray-800 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Shipping Estimate
        </h3>
      </div>

      <form onSubmit={handleCalculate} className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter ZIP code"
              maxLength={10}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
          >
            Calculate
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </form>

      {estimate && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Standard Shipping</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Arrives by {estimate.standard}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Express Shipping</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Arrives by {estimate.express}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t dark:border-gray-800">
            * Delivery dates are estimates and may vary based on order processing time
          </p>
        </div>
      )}
    </div>
  );
}
