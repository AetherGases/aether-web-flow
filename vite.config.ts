import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served by the Kong gateway under /dashboard.
  base: '/dashboard/',
  server: {
    proxy: { '/api': 'http://127.0.0.1:3001' },
  },
})
