/**
 * Contact Section
 * Email collection step for checkout
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailSchema, type EmailFormData } from '../../../../lib/validation/checkout-schemas';

interface ContactSectionProps {
  isActive: boolean;
  isComplete: boolean;
  onSubmit: (email: string) => Promise<void>;
  initialEmail?: string;
  onEdit: () => void;
}

export default function ContactSection({
  isActive,
  isComplete,
  onSubmit,
  initialEmail = '',
  onEdit,
}: ContactSectionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: initialEmail },
  });

  const handleFormSubmit = async (data: EmailFormData) => {
    await onSubmit(data.email);
  };

  // Completed state - show summary
  if (isComplete && !isActive) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Contact</h2>
            <p className="text-gray-600">{initialEmail}</p>
          </div>
          <button
            onClick={onEdit}
            className="text-primary hover:text-sage font-medium text-sm"
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  // Active state - show form
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            We'll send your order confirmation here
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="newsletter"
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="newsletter" className="text-sm text-gray-700">
            Email me with news and offers
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Continue to Shipping'}
        </button>
      </form>
    </div>
  );
}
