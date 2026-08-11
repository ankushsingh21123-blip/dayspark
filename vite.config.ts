import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
    manifest: {
      name: 'DaySpark — Life in Motion', short_name: 'DaySpark', description: 'A private, rewarding planner for tasks, goals and progress.',
      theme_color: '#172033', background_color: '#F7F9FC', display: 'standalone', start_url: '/', scope: '/', orientation: 'any',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: { navigateFallbackDenylist: [/^\/api\//] },
  })],
  server: { proxy: { '/api': 'http://127.0.0.1:8080' } },
});
