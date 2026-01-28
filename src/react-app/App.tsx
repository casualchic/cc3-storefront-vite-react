// src/react-app/App.tsx

import { RouterProvider, createRouter } from '@tanstack/react-router';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { routeTree } from './routeTree.gen';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

function App() {
	return (
		<ThemeProvider>
			<AuthProvider>
				<CartProvider>
					<WishlistProvider>
						<RouterProvider router={router} />
					</WishlistProvider>
				</CartProvider>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
