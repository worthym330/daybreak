import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import viteImagemin from 'vite-plugin-imagemin'; // Import the image optimization plugin

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'brotliCompress', // Use Brotli compression for smaller sizes
      threshold: 10240, // Compress assets larger than 10 KB
    }),
    visualizer({ filename: './dist/stats.html', open: true }), // Generates a bundle analysis file
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7, // Optimize GIFs
      },
      optipng: {
        optimizationLevel: 7, // Optimize PNGs
      },
      mozjpeg: {
        quality: 80, // Compress JPEGs with 80% quality
      },
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false }, // Keep viewBox attribute
          { name: 'removeEmptyAttrs', active: true }, // Remove unnecessary SVG attributes
        ],
      },
      webp: {
        quality: 80, // Convert images to WebP for smaller sizes
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['redux-thunk', 'react', 'react-dom'],
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        ecma: 2020,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react';
            if (id.includes('lodash')) return 'lodash';
            return 'vendor';
          }
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    cssCodeSplit: true,
    sourcemap: false,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 500,
  },
});
