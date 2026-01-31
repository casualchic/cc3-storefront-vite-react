import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/react-app'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/react-app/test/setup.ts',
  },
});