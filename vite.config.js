import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// المرجع التفاعلي لنظام العمل السعودي — build config (Vite + React + Tailwind v4)
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
