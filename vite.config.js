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
      '@queries': path.resolve(__dirname, './src/queries'),
    },
  },
  server: {
    port: 5173,
    host: true, // 👈 listen on all interfaces (LAN)
    proxy: {
      '/api': {
        target: 'http://192.168.188.20:8000', // your backend on the Mac
        changeOrigin: true,
      },
    },
    // If HMR doesn't connect on iPhone, add this block:
    // hmr: {
    //  host: '192.168.188.20', // your Mac’s IP
    //   protocol: 'ws',
    //   clientPort: 5173
    // },
  },
});

// // vite.config.js
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     host: true,              // 👈 listen on all interfaces (LAN)
//     // If HMR doesn't connect on iPhone, add this block:
//     // hmr: {
//     //   host: '192.168.188.20', // your Mac’s IP
//     //   protocol: 'ws',
//     //   clientPort: 5173
//     // },
//   },
// })
