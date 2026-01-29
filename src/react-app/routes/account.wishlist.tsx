// src/react-app/routes/account.wishlist.tsx

import { createFileRoute } from '@tanstack/react-router';
import { Heart } from 'lucide-react';

export const Route = createFileRoute('/account/wishlist')({
	component: WishlistPage,
});

function WishlistPage() {
	// Mock wishlist data
	const wishlistItems = [
		{
			id: '1',
			name: 'Casual Summer Dress',
			price: '$49.99',
			image: 'https://via.placeholder.com/150',
			inStock: true,
		},
		{
			id: '2',
			name: 'Leather Crossbody Bag',
			price: '$79.99',
			image: 'https://via.placeholder.com/150',
			inStock: false,
		},
	];

	return (
		<div>
			<h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>

			{wishlistItems.length === 0 ? (
				<div className="text-center py-12">
					<Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600 mb-4">Your wishlist is empty.</p>
					<p className="text-sm text-gray-500">Start adding items you love!</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{wishlistItems.map((item) => (
						<div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
							<div className="aspect-square bg-gray-100 relative">
								<img
									src={item.image}
									alt={item.name}
									className="w-full h-full object-cover"
								/>
								<button type="button" className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50" aria-label="Remove from wishlist">
									<Heart className="w-5 h-5 text-red-500 fill-red-500" />
								</button>
							</div>
							<div className="p-4">
								<h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
								<p className="text-lg font-bold text-gray-900 mb-2">{item.price}</p>
								{item.inStock ? (
									<button type="button" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm">
										Add to Cart
									</button>
								) : (
									<p className="text-sm text-red-600">Out of Stock</p>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
