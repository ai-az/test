import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// المرجع التفاعلي لنظام العمل السعودي — build config (Vite + React + Tailwind v4 + PWA)
export default defineConfig({
  // معاينة قابلة للوصول عبر نفق عام مؤقّت (السماح بكل المضيفات)
  preview: { host: true, allowedHosts: true },
  server: { host: true, allowedHosts: true },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png'],
      manifest: {
        name: 'نظام العمل السعودي — المرجع التفاعلي',
        short_name: 'نظام العمل',
        description:
          'مرجع تفاعلي يبسّط مواد نظام العمل السعودي عبر شرح مختصر ومثال عملي لكل مادة.',
        lang: 'ar',
        dir: 'rtl',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#faf9f7',
        theme_color: '#126837',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // الخطوط مستضافة محلياً (public/fonts) فتُسبَّق للتخزين مع بقية الأصول.
        globPatterns: ['**/*.{js,css,html,woff2,png,svg}'],
        navigateFallback: '/index.html',
      },
    }),
  ],
})
