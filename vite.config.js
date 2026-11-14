import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import contentMeta from './scripts/contentMetaPlugin.js';

export default defineConfig({
  plugins: [react(), contentMeta()],
  server: {
    host: true,
    port: 3000,
  },
  ssr: {
    noExternal: ['styled-components', 'react-icons'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
