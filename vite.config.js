import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
                basic: resolve(__dirname, 'src/views/basic.html')
            },
        },
    },
})