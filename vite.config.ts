import { defineConfig } from 'vite';

export default defineConfig({
    publicDir: "public",
    build: {
        outDir: "dist",
    },
    server: {
        port: 3000,
        open: "/index.html",  // auto opens browser
    }
});
