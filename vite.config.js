import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  server: {
    port: 5173,
    host: true, // Allow access from network
    strictPort: true, // Throw error if port is in use
    open: true // Automatically open browser
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext' // Use modern JavaScript features
  },
  preview: {
    port: 5173,
    host: true
  }
});
