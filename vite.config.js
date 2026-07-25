import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo_FLO.png'],
      manifest: {
        name: 'Flo',
        short_name: 'Flo',
        description: 'Diario a Flusso di Coscienza Zen',
        theme_color: '#FFFFFF',
        background_color: '#FFFFFF',
        display: 'standalone',
        icons: [
          {
            src: 'logo_FLO.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo_FLO.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})