/**
 * Vite Configuration
 * 
 * Vite is the build tool and development server for the frontend.
 * This configuration sets up React, proxying to the backend, and testing.
 */

import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // React plugin for JSX/TSX support
  plugins: [react()],

  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Development server configuration
  server: {
    port: 5173,    // Frontend runs on port 5173
    
    // Proxy API requests to the backend server
    // When the frontend makes a request to /api/*, it gets forwarded to the backend
    proxy: {
      '/api': {
        target: 'http://localhost:3001',  // Backend server URL
        changeOrigin: true,                // Changes the origin header to match target
        secure: false,                     // Allow self-signed SSL certificates
      },
    },
  },

  // Testing configuration (for Vitest)
  test: {
    globals: true,           // Use global test functions (describe, it, expect)
    environment: 'jsdom',    // Simulate browser environment
    setupFiles: './src/test/setup.ts',  // Setup file for tests
    css: true,              // Process CSS in tests
  },
});

