import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [], // Remove 'react' and 'react-dom' or any external modules
    },
  },
});
