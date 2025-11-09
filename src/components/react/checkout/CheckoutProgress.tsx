/**
 * Checkout Progress Indicator
 * Shows the current step in the checkout process
 */

interface CheckoutProgressProps {
  currentStep: number;
}

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const steps = [
    { id: 1, name: 'Contact', shortName: 'Info' },
    { id: 2, name: 'Shipping', shortName: 'Ship' },
    { id: 3, name: 'Method', shortName: 'Method' },
    { id: 4, name: 'Payment', shortName: 'Pay' },
    { id: 5, name: 'Review', shortName: 'Done' },
  ];

  return (
    <div className="mb-8">
      {/* Mobile Progress Bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-charcoal">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm text-charcoal">
            {steps[currentStep - 1]?.name}
          </span>
        </div>
        <div className="w-full bg-neutral rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  step.id < currentStep
                    ? 'bg-sage text-white'
                    : step.id === currentStep
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-neutral text-charcoal'
                }`}
              >
                {step.id < currentStep ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.id
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs mt-2 font-medium transition-colors ${
                  step.id <= currentStep ? 'text-forest' : 'text-charcoal/50'
                }`}
              >
                {step.name}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 relative top-[-12px]">
                <div
                  className={`h-full transition-all duration-500 ${
                    step.id < currentStep ? 'bg-sage' : 'bg-neutral'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
