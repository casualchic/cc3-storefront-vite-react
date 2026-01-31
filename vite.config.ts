import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src/react-app'),
		},
	},
	plugins: [
		tailwindcss(),
		tanstackRouter({
			target: 'react',
			routesDirectory: './src/react-app/routes',
			generatedRouteTree: './src/react-app/routeTree.gen.ts',
		}),
		react(),
		cloudflare({
			// Exclude .dev.vars from being copied to dist
			persistState: false,
		}),
		// Bundle analyzer - generates stats.html after build
		visualizer({
			filename: './dist/stats.html',
			gzipSize: true,
			brotliSize: true,
		}),
	],
});
