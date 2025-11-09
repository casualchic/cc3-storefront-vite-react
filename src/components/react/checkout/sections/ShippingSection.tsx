/**
 * Shipping Section
 * Address collection step
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  shippingAddressSchema,
  type ShippingAddressFormData,
  US_STATES,
} from '../../../../lib/validation/checkout-schemas';
import type { AddressInput } from '../../../../lib/types/medusa';

interface ShippingSectionProps {
  isActive: boolean;
  isComplete: boolean;
  onSubmit: (address: AddressInput) => Promise<void>;
  initialAddress: AddressInput | null;
  sameAsBilling: boolean;
  onSameAsBillingChange: (value: boolean) => void;
  onEdit: () => void;
}

export default function ShippingSection({
  isActive,
  isComplete,
  onSubmit,
  initialAddress,
  sameAsBilling,
  onSameAsBillingChange,
  onEdit,
}: ShippingSectionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddressFormData>({
    resolver: zodResolver(shippingAddressSchema) as any,
    defaultValues: initialAddress || {
      country_code: 'US',
    },
  });

  const handleFormSubmit = async (data: ShippingAddressFormData) => {
    // Ensure country_code is set (should be from default value)
    const addressData: AddressInput = {
      ...data,
      country_code: data.country_code || 'US',
    };
    await onSubmit(addressData);
  };

  // Completed state
  if (isComplete && !isActive) {
    const addr = initialAddress;
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Shipping Address</h2>
            <p className="text-gray-600">
              {addr?.first_name} {addr?.last_name}
              <br />
              {addr?.address_1}
              {addr?.address_2 && (
                <>
                  <br />
                  {addr.address_2}
                </>
              )}
              <br />
              {addr?.city}, {addr?.province} {addr?.postal_code}
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
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('first_name')}
              type="text"
              id="first_name"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.first_name ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="given-name"
            />
            {errors.first_name && (
              <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('last_name')}
              type="text"
              id="last_name"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.last_name ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="family-name"
            />
            {errors.last_name && (
              <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="address_1" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            {...register('address_1')}
            type="text"
            id="address_1"
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.address_1 ? 'border-red-500' : 'border-gray-300'
            }`}
            autoComplete="address-line1"
          />
          {errors.address_1 && (
            <p className="mt-1 text-sm text-red-600">{errors.address_1.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="address_2" className="block text-sm font-medium text-gray-700 mb-1">
            Apartment, suite, etc. (optional)
          </label>
          <input
            {...register('address_2')}
            type="text"
            id="address_2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            autoComplete="address-line2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              {...register('city')}
              type="text"
              id="city"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="address-level2"
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
          </div>

          <div>
            <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select
              {...register('province')}
              id="province"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.province ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="address-level1"
            >
              <option value="">Select state</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              {...register('postal_code')}
              type="text"
              id="postal_code"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.postal_code ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="postal-code"
            />
            {errors.postal_code && (
              <p className="mt-1 text-sm text-red-600">{errors.postal_code.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone (optional)
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="sameAsBilling"
            checked={sameAsBilling}
            onChange={(e) => onSameAsBillingChange(e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="sameAsBilling" className="text-sm text-gray-700">
            Billing address same as shipping
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Continue to Shipping Method'}
        </button>
      </form>
    </div>
  );
}
