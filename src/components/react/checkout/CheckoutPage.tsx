/**
 * Checkout Page Component
 * Main container for the entire checkout flow
 */

import { useEffect, useState } from 'react';
import { useMedusaCartStore } from '../../../lib/stores/medusa-cart-store';
import { useCheckout } from '../../../lib/medusa/hooks/useCheckout';
import type { AddressInput } from '../../../lib/types/medusa';
import ContactSection from './sections/ContactSection';
import ShippingSection from './sections/ShippingSection';
import ShippingMethodSection from './sections/ShippingMethodSection';
import PaymentSection from './sections/PaymentSection';
import OrderReview from './sections/OrderReview';
import OrderSummary from './OrderSummary';
import CheckoutProgress from './CheckoutProgress';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';

export default function CheckoutPage() {
  const { cart, isLoading: cartLoading, initCart, error: cartError } = useMedusaCartStore();
  const checkout = useCheckout();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<AddressInput | null>(null);
  const [selectedShippingOption, setSelectedShippingOption] = useState<string>('');
  const [sameAsBilling, setSameAsBilling] = useState(true);

  // Initialize cart on mount
  useEffect(() => {
    initCart();
  }, [initCart]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && cart && (!cart.items || cart.items.length === 0)) {
      window.location.href = '/shop';
    }
  }, [cart, cartLoading]);

  // Handle email submission
  const handleEmailSubmit = async (emailValue: string) => {
    await checkout.setEmail(emailValue);
    setEmail(emailValue);
    setCurrentStep(2);
  };

  // Handle shipping address submission
  const handleShippingSubmit = async (address: AddressInput) => {
    await checkout.setShippingAddress(address);

    // Set billing address if same as shipping
    if (sameAsBilling) {
      await checkout.setBillingAddress(address);
    }

    setShippingAddress(address);
    setCurrentStep(3);
  };

  // Handle shipping method selection
  const handleShippingMethodSubmit = async (optionId: string) => {
    await checkout.selectShippingMethod(optionId);
    setSelectedShippingOption(optionId);
    setCurrentStep(4);
  };

  // Handle payment initialization
  const handlePaymentInitialized = () => {
    setCurrentStep(5);
  };

  // Handle final order submission
  const handleOrderSubmit = async () => {
    const result = await checkout.completeCheckout();

    if (result.order) {
      // Success! Redirect to success page
      window.location.href = `/checkout/success?order_id=${result.order.id}`;
    } else if (result.error) {
      // Stay on page, error is displayed by OrderReview component
      console.error('Checkout failed:', result.error);
    }
  };

  // Show loading state while cart initializes
  if (cartLoading || !cart) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Loading checkout...</span>
        </div>
      </div>
    );
  }

  // Show error if cart failed to load
  if (cartError) {
    return (
      <div className="container mx-auto px-4 py-16">
        <ErrorMessage message={cartError} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-7xl py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Checkout</h1>
      <p className="text-charcoal mb-8">Secure checkout - your information is encrypted</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Checkout Form - Left Side */}
        <div className="lg:col-span-7">
          {/* Progress Indicator */}
          <CheckoutProgress currentStep={currentStep} />

          {/* Guest Checkout Info */}
          <div className="bg-neutral/20 p-4 rounded-lg mb-6">
            <p className="text-sm text-charcoal">
              Checking out as guest? No problem - you can create an account after your order.
            </p>
          </div>

          <div className="space-y-6">

          {/* Step 1: Contact Information */}
          <ContactSection
            isActive={currentStep === 1}
            isComplete={currentStep > 1}
            onSubmit={handleEmailSubmit}
            initialEmail={email}
            onEdit={() => setCurrentStep(1)}
          />

          {/* Step 2: Shipping Address */}
          {currentStep >= 2 && (
            <ShippingSection
              isActive={currentStep === 2}
              isComplete={currentStep > 2}
              onSubmit={handleShippingSubmit}
              initialAddress={shippingAddress}
              sameAsBilling={sameAsBilling}
              onSameAsBillingChange={setSameAsBilling}
              onEdit={() => setCurrentStep(2)}
            />
          )}

          {/* Step 3: Shipping Method */}
          {currentStep >= 3 && (
            <ShippingMethodSection
              isActive={currentStep === 3}
              isComplete={currentStep > 3}
              onSubmit={handleShippingMethodSubmit}
              selectedOption={selectedShippingOption}
              onEdit={() => setCurrentStep(3)}
            />
          )}

          {/* Step 4: Payment */}
          {currentStep >= 4 && (
            <PaymentSection
              isActive={currentStep === 4}
              isComplete={currentStep > 4}
              onInitialized={handlePaymentInitialized}
              onEdit={() => setCurrentStep(4)}
            />
          )}

          {/* Step 5: Review & Submit */}
          {currentStep >= 5 && (
            <OrderReview
              isActive={currentStep === 5}
              email={email}
              shippingAddress={shippingAddress}
              cart={cart}
              onSubmit={handleOrderSubmit}
              isProcessing={checkout.isProcessing}
              error={checkout.error}
            />
          )}
          </div>
        </div>

        {/* Order Summary - Right Side */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-8">
            <OrderSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  );
}
