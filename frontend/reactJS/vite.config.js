import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Pages from 'vite-plugin-pages';
import * as fs from "node:fs";

import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [
    react(),
    Pages({ dirs: 'src/pages' }),
  ],
  build: {
    target: 'esnext',
  },
  server: {
    proxy: {
      // Proxy toutes les requêtes /api vers l'URL définie dans la variable d'environnement PROXY_GATEWAY
      '/api': {
        target: process.env.PROXY_GATEWAY,
        changeOrigin: true, // Si tu as besoin de changer l'origine de la requête (utile pour les APIs avec CORS)
        rewrite: (path) => path.replace(/^\/api/, ''), // Supprime le préfixe /api pour l'API
      },
      // Redirection spécifique vers Facebook OAuth
      '/api/socialauth/connect/facebook': {
        target: 'https://www.facebook.com/v12.0/dialog/oauth',
        changeOrigin: true,
        rewrite: (path) => path, // Pas besoin de modifier ici, la redirection se fait telle quelle
        ws: false,  // Pas de WebSocket nécessaire pour cette redirection
      },
    },
  },
});
