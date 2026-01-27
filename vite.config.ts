import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
	plugins: [
		TanStackRouterVite({
			routesDirectory: "./src/react-app/routes",
			generatedRouteTree: "./src/react-app/routeTree.gen.ts",
		}),
		react(),
		cloudflare(),
	],
});
