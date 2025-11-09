/**
 * Payment Section
 * Stripe payment collection (placeholder - full Stripe integration in next phase)
 */

import { useState, useEffect } from 'react';
import { useCheckout } from '../../../../lib/medusa/hooks/useCheckout';
import LoadingSpinner from '../ui/LoadingSpinner';

interface PaymentSectionProps {
  isActive: boolean;
  isComplete: boolean;
  onInitialized: () => void;
  onEdit: () => void;
}

export default function PaymentSection({
  isActive,
  isComplete,
  onInitialized,
  onEdit,
}: PaymentSectionProps) {
  const checkout = useCheckout();
  const [initializing, setInitializing] = useState(true);
  const [paymentReady, setPaymentReady] = useState(false);

  useEffect(() => {
    if (isActive) {
      initializePayment();
    }
  }, [isActive]);

  const initializePayment = async () => {
    setInitializing(true);
    try {
      await checkout.initializePaymentSessions();
      await checkout.selectPaymentProvider('stripe');
      setPaymentReady(true);
    } catch (error) {
      console.error('Failed to initialize payment:', error);
    } finally {
      setInitializing(false);
    }
  };

  const handleContinue = () => {
    onInitialized();
  };

  // Completed state
  if (isComplete && !isActive) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Payment</h2>
            <p className="text-gray-600">Payment method selected</p>
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
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>

      {initializing ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Initializing payment...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* TODO: Integrate Stripe Payment Element here */}
          <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">
              Stripe Payment Element will be integrated here
            </p>
            <p className="text-sm text-gray-500">
              For now, payment will be processed on order completion
            </p>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secure SSL encrypted payment</span>
          </div>

          <button
            onClick={handleContinue}
            disabled={!paymentReady}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Review
          </button>
        </div>
      )}
    </div>
  );
}
