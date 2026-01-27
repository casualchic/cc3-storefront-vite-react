// src/react-app/routes/__root.tsx

import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
	component: () => (
		<div className="min-h-screen bg-gray-50">
			<nav className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center space-x-8">
							<Link to="/" className="text-xl font-bold text-gray-900">
								Casual Chic Boutique
							</Link>
							<Link
								to="/"
								className="text-gray-700 hover:text-gray-900"
								activeProps={{ className: 'text-blue-600 font-medium' }}
							>
								Home
							</Link>
							<Link
								to="/account/profile"
								className="text-gray-700 hover:text-gray-900"
								activeProps={{ className: 'text-blue-600 font-medium' }}
							>
								Account
							</Link>
						</div>
					</div>
				</div>
			</nav>
			<main>
				<Outlet />
			</main>
			{import.meta.env.DEV && <TanStackRouterDevtools />}
		</div>
	),
});
