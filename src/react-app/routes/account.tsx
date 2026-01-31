// src/react-app/routes/account.tsx

import { lazy } from 'react';
import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router';
import { LogOut, User, MapPin, Package, Heart } from '@/lib/icons';
import { useAuth } from '../context/AuthContext';

const AccountLayoutComponent = () => {
	const { user, logout } = useAuth();

	if (!user) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="text-center text-gray-600">Loading profile...</div>
			</div>
		);
	}

	const navigation = [
		{ name: 'Profile', to: '/account/profile', icon: User },
		{ name: 'Orders', to: '/account/orders', icon: Package },
		{ name: 'Addresses', to: '/account/addresses', icon: MapPin },
		{ name: 'Wishlist', to: '/account/wishlist', icon: Heart },
	];

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="flex flex-col md:flex-row gap-8">
				{/* Sidebar */}
				<aside className="md:w-64 shrink-0">
					<div className="bg-white rounded-lg shadow-xs p-6">
						<div className="mb-6">
							<h2 className="text-lg font-semibold text-gray-900 mb-1">
								Welcome back, {user.firstName}!
							</h2>
							<p className="text-sm text-gray-600">{user.email}</p>
						</div>

						<nav className="space-y-1">
							{navigation.map((item) => {
								const Icon = item.icon;
								return (
									<Link
										key={item.to}
										to={item.to}
										className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition"
										activeProps={{
											className: 'flex items-center px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-md',
										}}
									>
										<Icon className="w-5 h-5 mr-3" />
										{item.name}
									</Link>
								);
							})}
						</nav>

						<div className="mt-6 pt-6 border-t border-gray-200">
							<button
								onClick={logout}
								className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition"
							>
								<LogOut className="w-5 h-5 mr-3" />
								Logout
							</button>
						</div>
					</div>
				</aside>

				{/* Main Content */}
				<main className="flex-1 bg-white rounded-lg shadow-xs p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

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
	component: lazy(() => Promise.resolve({ default: AccountLayoutComponent })),
});
