// src/react-app/routes/index.tsx

import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: HomePage,
});

function HomePage() {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Casual Chic Boutique</h1>
			<p className="text-lg text-gray-700 mb-8">
				Your premier destination for casual fashion and accessories.
			</p>
			<div className="space-y-4">
				<Link
					to="/login"
					className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
				>
					Login to Your Account
				</Link>
			</div>
		</div>
	);
}
