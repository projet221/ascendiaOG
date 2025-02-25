import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Pages from 'vite-plugin-pages'

export default defineConfig({
  plugins: [
      react(),
    Pages({dirs:'src/pages'})
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3000', // Proxy toutes les requêtes commençant par /api
    },
  },
});

