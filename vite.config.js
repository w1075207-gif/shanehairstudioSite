import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Always emit real files under /assets/ — avoids data: URLs blocked for CSS backgrounds / strict CSP.
    assetsInlineLimit: 0,
  },
});