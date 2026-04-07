import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        injectionPoint: 'self.__WB_MANIFEST',
      },
      manifest: {
        name: 'MediTrack',
        short_name: 'MediTrack',
        description: 'Your personal health record',
        theme_color: '#0A0E13',
        background_color: '#0A0E13',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        shortcuts: [
          {
            name: "Today's Doses",
            url: "/doses",
            description: "Log your medication doses for today"
          },
          {
            name: "Log Vitals",
            url: "/vitals",
            description: "Record your blood pressure, sugar, or weight"
          },
          {
            name: "Emergency Info",
            url: "/emergency",
            description: "Show ICE contacts and critical conditions"
          }
        ],
        share_target: {
          action: '/prescriptions',
          method: 'POST',
          enctype: 'multipart/form-data',
          params: {
            title: 'title',
            text: 'text',
            url: 'url',
            files: [
              {
                name: 'prescription',
                accept: ['image/*', 'application/pdf']
              }
            ]
          }
        },
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
  },
})
