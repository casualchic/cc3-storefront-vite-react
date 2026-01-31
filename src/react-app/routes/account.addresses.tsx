// src/react-app/routes/account.addresses.tsx

import { lazy } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { MapPin, Plus } from '@/lib/icons';

const AddressesPageComponent = () => {
	// Mock addresses data
	const addresses = [
		{
			id: '1',
			label: 'Home',
			name: 'Demo User',
			street: '123 Main Street',
			city: 'San Francisco',
			state: 'CA',
			zip: '94102',
			isDefault: true,
		},
	];

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
				<button type="button" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
					<Plus className="w-4 h-4 mr-2" />
					Add Address
				</button>
			</div>

			{addresses.length === 0 ? (
				<div className="text-center py-12">
					<MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600 mb-4">You haven't added any addresses yet.</p>
					<button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
						Add Your First Address
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{addresses.map((address) => (
						<div key={address.id} className="border border-gray-200 rounded-lg p-4">
							<div className="flex justify-between items-start mb-2">
								<h3 className="font-semibold text-gray-900">{address.label}</h3>
								{address.isDefault && (
									<span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-sm">
										Default
									</span>
								)}
							</div>
							<div className="text-sm text-gray-600 space-y-1">
								<p>{address.name}</p>
								<p>{address.street}</p>
								<p>{address.city}, {address.state} {address.zip}</p>
							</div>
							<div className="mt-4 flex space-x-2">
								<button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
									Edit
								</button>
								<button type="button" className="text-sm text-red-600 hover:text-red-700 font-medium">
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export const Route = createFileRoute('/account/addresses')({
	component: lazy(() => Promise.resolve({ default: AddressesPageComponent })),
});
