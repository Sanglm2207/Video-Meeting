import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

export default defineConfig(({ mode }) => {
    // Load env vars based on mode
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],
        define: {
            'process.env': env
        },
        server: {
            proxy: {
                '/api': {
                    target: env.VITE_API_URL || 'http://localhost:3000',
                    changeOrigin: true
                },
                '/ws': {
                    target: env.VITE_WS_URL?.replace('wss://', 'ws://') || 'ws://localhost:3000',
                    ws: true,
                    changeOrigin: true
                }
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            }
        },
        build: {
            outDir: '../dist/client',
            emptyOutDir: true
        }
    };
});