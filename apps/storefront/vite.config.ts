import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3001,
    host: '0.0.0.0',
    strictPort: true,
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          tanstack: [
            '@tanstack/react-router',
            '@tanstack/react-query',
            '@tanstack/react-table',
            '@tanstack/react-virtual',
            '@tanstack/react-form',
          ],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
