import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

// Environment Variables Note: APP_URL and ASSET_URL should be set in your 
// platform environment settings (Laravel Cloud / Hostinger) 
// to avoid hard-coded redirection issues.

export default defineConfig(({ mode }) => ({
    base: '/',
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
}));
