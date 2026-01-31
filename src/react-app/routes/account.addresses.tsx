// src/react-app/routes/account.addresses.tsx

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/account/addresses')({
	pendingComponent: () => <div className="flex items-center justify-center min-h-[400px]"><div className="text-gray-600">Loading...</div></div>,
});
