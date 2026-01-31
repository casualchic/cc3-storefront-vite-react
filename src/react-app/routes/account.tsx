// src/react-app/routes/account.tsx

import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/account')({
	beforeLoad: ({ location }) => {
		// Check if user is authenticated
		const authToken = localStorage.getItem('cc3_auth_token');
		const userStr = localStorage.getItem('cc3_user');

		if (!authToken || !userStr) {
			// Redirect to login with return path
			throw redirect({
				to: '/login',
				search: {
					redirect: location.href,
				},
			});
		}
	},
	pendingComponent: () => <div className="flex items-center justify-center min-h-[400px]"><div className="text-gray-600">Loading...</div></div>,
});
