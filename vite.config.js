// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@data': path.resolve(__dirname, './src/data'),
      '@images': path.resolve(__dirname, './src/images'),
    },
  },
  server: {
    port: 5173,
    host: 'localhost',
    // Uncomment this block ONLY if you want to call the server via /api in dev,
    // instead of using VITE_API in axios.
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8000', // your Express dev server
    //     changeOrigin: true,
    //   },
    // },
  },
});
