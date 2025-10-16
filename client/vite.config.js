import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      // jab bhi frontend se /api pe request jayegi
      // to ye proxy usko backend (http://localhost:3000) pe forward kar dega
      '/api': {
        target: 'http://localhost:3000', 
        changeOrigin: true, 
        secure: false,
      },
      '/uploads': 'http://localhost:3000'
    },
  },
})
