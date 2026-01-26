import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

export default defineConfig({
	plugins: [
		react(),
		TanStackRouterVite({
			routesDirectory: './src/react-app/routes',
			generatedRouteTree: './src/react-app/routeTree.gen.ts',
		}),
		cloudflare(),
	],
});
