import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'Altare',
        short_name: 'Altare',
        description: 'A reverent prayer companion for traditional Catholics who attend the Traditional Latin Mass',
        theme_color: '#2C1A0E',
        background_color: '#F5EDDA',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,woff2,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /\/data\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'liturgical-data',
              expiration: { maxEntries: 600, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ],
  base: '/'
})
