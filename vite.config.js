import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Always emit real files under /assets/ — avoids data: URLs blocked for CSS backgrounds / strict CSP.
    assetsInlineLimit: 0,
  },
});
