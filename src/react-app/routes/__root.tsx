// src/react-app/routes/__root.tsx

import { createRootRoute, Outlet } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

// Lazy load devtools only in development to exclude from production bundle
const TanStackRouterDevtools =
	import.meta.env.PROD
		? () => null
		: lazy(() =>
				import('@tanstack/router-devtools').then((res) => ({
					default: res.TanStackRouterDevtools,
				}))
			);

export const Route = createRootRoute({
	component: () => (
		<div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
			<Header />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
			{import.meta.env.DEV && (
				<Suspense fallback={null}>
					<TanStackRouterDevtools />
				</Suspense>
			)}
		</div>
	),
});
