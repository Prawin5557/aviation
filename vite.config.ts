import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, splitVendorChunkPlugin} from 'vite';

export default defineConfig(({mode}) => {
  return {
    plugins: [react(), tailwindcss(), splitVendorChunkPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/recharts')) {
              return 'vendor-recharts';
            }
            if (id.includes('node_modules/axios')) {
              return 'vendor-axios';
            }
          },
        },
      },
    },
    server: {
      port: 5500,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: false,
    },
  };
});
