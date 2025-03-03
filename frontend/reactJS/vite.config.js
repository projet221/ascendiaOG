import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import Pages from 'vite-plugin-pages'

export default defineConfig({
    plugins: [
        react(),
        Pages({dirs: 'src/pages'}),
        tailwindcss(),
    ],
    build: {
        target: 'esnext',
    },
    server: {
        proxy: {
            '/api': "http://localhost:3000",
        },
        https: {
            key: fs.readFileSync("localhost-key.pem"),
            cert: fs.readFileSync("localhost.pem"),
        },
        host: "localhost",
        // Change si besoin

    },
})

