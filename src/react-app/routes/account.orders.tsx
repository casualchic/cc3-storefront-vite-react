// src/react-app/routes/account.orders.tsx

import { createFileRoute } from '@tanstack/react-router';
import { Package } from '@/lib/icons';

export const Route = createFileRoute('/account/orders')({
	component: OrdersPage,
});

function OrdersPage() {
	// Mock orders data
	const orders = [
		{
			id: '1001',
			date: '2026-01-20',
			status: 'Delivered',
			total: '$125.99',
			items: 2,
		},
		{
			id: '1002',
			date: '2026-01-15',
			status: 'In Transit',
			total: '$89.50',
			items: 1,
		},
	];

	return (
		<div>
			<h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

			{orders.length === 0 ? (
				<div className="text-center py-12">
					<Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600">You haven't placed any orders yet.</p>
				</div>
			) : (
				<div className="space-y-4">
					{orders.map((order) => (
						<div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
							<div className="flex justify-between items-start">
								<div>
									<h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
									<p className="text-sm text-gray-600 mt-1">Placed on {order.date}</p>
									<p className="text-sm text-gray-600">{order.items} items</p>
								</div>
								<div className="text-right">
									<p className="font-semibold text-gray-900">{order.total}</p>
									<span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
										order.status === 'Delivered'
											? 'bg-green-100 text-green-800'
											: 'bg-blue-100 text-blue-800'
									}`}>
										{order.status}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
