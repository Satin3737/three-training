import {resolve} from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
    root: 'src/',
    publicDir: '../public/',
    base: './',
    server: {
        host: true
    },
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'src/index.html'),
                basic: resolve(__dirname, 'src/views/basic.html'),
                solar: resolve(__dirname, 'src/views/solar.html')
            },
        },
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true
    }
});