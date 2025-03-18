import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import Pages from 'vite-plugin-pages'
const dotenv = require("dotenv");
dotenv.config();

export default defineConfig({
    plugins: [
        react(),
        Pages({dirs: 'src/pages'}),
    ],
    build: {
        target: 'esnext',
    },
    server: {
        proxy: {
            '/api': "${process.env.PROXY_GATEWAY}",
        },
    },
})

