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
                solar: resolve(__dirname, 'src/views/solar.html'),
                transform: resolve(__dirname, 'src/views/transform.html'),
                camera: resolve(__dirname, 'src/views/camera.html'),
                geometry: resolve(__dirname, 'src/views/geometry.html'),
                debug: resolve(__dirname, 'src/views/debug.html'),
                textures: resolve(__dirname, 'src/views/textures.html'),
                materials: resolve(__dirname, 'src/views/materials.html'),
                texts: resolve(__dirname, 'src/views/texts.html'),
            },
        },
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true
    }
});