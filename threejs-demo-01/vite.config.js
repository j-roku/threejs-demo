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
            nested: resolve(__dirname, '002/index.html')
        }
    }
    }
});