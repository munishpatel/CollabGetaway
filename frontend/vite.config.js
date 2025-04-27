import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: '/',
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    proxy: mode === 'development' ? {
      '/api': {
        target: 'http://localhost:1234',
        changeOrigin: true,
        secure: false
      }
    } : undefined
  }
}));
