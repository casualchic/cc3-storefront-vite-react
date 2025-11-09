/**
 * Shipping Method Section
 * Select shipping speed/carrier
 */

import { useState, useEffect } from 'react';
import { useCheckout } from '../../../../lib/medusa/hooks/useCheckout';
import type { ShippingOption } from '../../../../lib/types/medusa';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ShippingMethodSectionProps {
  isActive: boolean;
  isComplete: boolean;
  onSubmit: (optionId: string) => Promise<void>;
  selectedOption: string;
  onEdit: () => void;
}

export default function ShippingMethodSection({
  isActive,
  isComplete,
  onSubmit,
  selectedOption,
  onEdit,
}: ShippingMethodSectionProps) {
  const checkout = useCheckout();
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(selectedOption);

  useEffect(() => {
    if (isActive) {
      loadShippingOptions();
    }
  }, [isActive]);

  const loadShippingOptions = async () => {
    setLoading(true);
    const shippingOptions = await checkout.getShippingOptions();
    setOptions(shippingOptions);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      await onSubmit(selected);
    }
  };

  const formatPrice = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'Free';
    return `$${(amount / 100).toFixed(2)}`;
  };

  // Completed state
  if (isComplete && !isActive) {
    const selectedOptionData = options.find((opt) => opt.id === selectedOption);
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Shipping Method</h2>
            <p className="text-gray-600">
              {selectedOptionData?.name} - {formatPrice(selectedOptionData?.amount)}
            </p>
          </div>
          <button onClick={onEdit} className="text-primary hover:text-sage font-medium text-sm">
            Edit
          </button>
        </div>
      </div>
    );
  }

  // Active state
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Method</h2>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Loading shipping options...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {options.map((option) => (
            <label
              key={option.id}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                selected === option.id
                  ? 'border-primary bg-primary bg-opacity-5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="shipping_method"
                  value={option.id}
                  checked={selected === option.id}
                  onChange={(e) => setSelected(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{option.name}</p>
                  {option.data && typeof option.data === 'object' && 'description' in option.data && (
                    <p className="text-sm text-gray-500">{String(option.data.description)}</p>
                  )}
                </div>
              </div>
              <span className="font-semibold text-gray-900">{formatPrice(option.amount)}</span>
            </label>
          ))}

          <button
            type="submit"
            disabled={!selected || checkout.isProcessing}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {checkout.isProcessing ? 'Processing...' : 'Continue to Payment'}
          </button>
        </form>
      )}
    </div>
  );
}
