// src/react-app/routes/account.orders.tsx

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/account/orders')({
	pendingComponent: () => <div className="flex items-center justify-center min-h-[400px]"><div className="text-gray-600">Loading...</div></div>,
});
