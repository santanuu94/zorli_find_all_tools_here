import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': new URL('.', import.meta.url).pathname,
      },
    },
    build: {
      // Long-term caching + smaller first paint. react-vendor rarely changes so
      // repeat visits (and Cloudflare edge cache) reuse it; route chunks load
      // on demand via React.lazy in App.tsx. Future tool families MUST stay
      // behind dynamic registry loaders so they become their own chunks too —
      // never import a family statically into the home bundle.
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
              return 'react-vendor';
            }
            return undefined;
          },
        },
      },
      // Keep the deploy honest: warn early if the initial bundle regresses.
      chunkSizeWarningLimit: 300,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
