import glsl from 'vite-plugin-glsl';
import { resolve } from 'path'
import { defineConfig } from "vite";

export default defineConfig({
    server: {
        host: true,
    },
    plugins: [
        glsl()
    ],
    build: {
    rollupOptions: {
        input: {
            main: resolve(__dirname, 'index.html'),
            page002: resolve(__dirname, '002/index.html'),
            page003: resolve(__dirname, '003/index.html'),
        }
    }
    }
});