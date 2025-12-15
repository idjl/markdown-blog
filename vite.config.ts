import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/markdown-blog/',
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    host: 'localhost',
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@core': resolve(__dirname, 'src/core'),
      '@plugins': resolve(__dirname, 'src/plugins'),
      '@templates': resolve(__dirname, 'src/templates'),
      '@styles': resolve(__dirname, 'src/styles'),
    },
  },
});