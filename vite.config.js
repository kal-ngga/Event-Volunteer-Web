import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // <-- 1. Tambahkan import ini

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'], // <-- 2. Pastikan app.css ada di sini
            refresh: true,
        }),
        react(),
        tailwindcss(), // <-- 3. Tambahkan plugin tailwind di sini
    ],
});