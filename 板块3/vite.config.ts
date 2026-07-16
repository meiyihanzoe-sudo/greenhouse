import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '绿房子',
        short_name: '绿房子',
        description: '星宝协助软件',
        theme_color: '#4CAF50',
        display: 'standalone',
      },
    }),
    {
      name: 'build-version',
      transformIndexHtml(html) {
        return html.replace('BUILD_PLACEHOLDER', Date.now().toString());
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
  },
});
