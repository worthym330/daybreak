// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';
// import viteCompression from 'vite-plugin-compression';

// export default defineConfig({
//   plugins: [react(), viteCompression()],
//   resolve: {
//     alias: {
//       '@': '/src',
//     },
//   },
//   optimizeDeps: {
//     include: ['redux-thunk', 'react', 'react-dom'],
//   },
//   build: {
//     minify: 'terser',
//     terserOptions: {
//       compress: {
//         drop_console: true,
//       },
//     },
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           react: ['react', 'react-dom'],
//         },
//       },
//     },
//     cssCodeSplit: true,
//     sourcemap: false,
//     chunkSizeWarningLimit: 500,
//   },
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'brotliCompress', // Use Brotli compression for smaller sizes
      threshold: 10240, // Compress assets larger than 10 KB
    }),
    visualizer({ filename: './dist/stats.html', open: true }), // Generates a bundle analysis file
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
    minify: 'terser', // Minify using Terser for better control over compression
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true, // Remove debugger statements
        ecma: 2020, // Use the latest ECMAScript standards for compression
      },
      format: {
        comments: false, // Remove comments from the build
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Separate each major dependency into its own chunk
            if (id.includes('react')) return 'react';
            if (id.includes('lodash')) return 'lodash';
            return 'vendor';
          }
        },
        chunkFileNames: 'chunks/[name]-[hash].js', // Custom chunk filenames
        entryFileNames: '[name]-[hash].js', // Custom entry filenames
        assetFileNames: 'assets/[name]-[hash].[ext]', // Custom asset filenames
      },
    },
    cssCodeSplit: true, // Split CSS for better page load performance
    sourcemap: false, // Disable source maps in production for smaller builds
    assetsInlineLimit: 4096, // Inline assets under 4 KB as base64 URLs
    chunkSizeWarningLimit: 500, // Show a warning for chunks over 500 KB
  },
});
