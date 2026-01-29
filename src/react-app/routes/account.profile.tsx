// src/react-app/routes/account.profile.tsx

import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';

export const Route = createFileRoute('/account/profile')({
	component: ProfilePage,
});

function ProfilePage() {
	const { user } = useAuth();

	if (!user) {
		return (
			<div className="py-12 text-center text-gray-600">
				Loading profile...
			</div>
		);
	}

	return (
		<div>
			<h1 className="text-2xl font-bold text-gray-900 mb-6">Profile & Settings</h1>

			<div className="space-y-6">
				<div className="border-b border-gray-200 pb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								First Name
							</label>
							<p className="text-gray-900">{user.firstName}</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Last Name
							</label>
							<p className="text-gray-900">{user.lastName}</p>
						</div>
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Email Address
							</label>
							<p className="text-gray-900">{user.email}</p>
						</div>
					</div>
				</div>

				<div>
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
					<div className="space-y-2">
						<button type="button" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
							Change Password
						</button>
						<br />
						<button type="button" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
							Update Email
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
