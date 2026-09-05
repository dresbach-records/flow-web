import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    var apiTarget = (env.VITE_API_BASE_URL || env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/api\/v1\/?$/, '');
    return {
        plugins: [react()],
        server: {
            host: '0.0.0.0',
            port: 3000,
            allowedHosts: true,
            proxy: {
                // FASE 2: dev usa mesmo-origem /api → backend, sem divergência de env.
                '/api': { target: apiTarget || 'http://localhost:8080', changeOrigin: true },
            },
            watch: {
                ignored: ['**/*.crdownload', '**/*.tmp']
            }
        }
    };
});
