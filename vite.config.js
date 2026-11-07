import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
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
