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
      '/api': 'https://gateway-production-207f.up.railway.app', // Proxy toutes les requêtes commençant par /api
    },
  },
});

