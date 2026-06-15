import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
// Desktop (Tauri) loads assets from the bundle root; GitHub Pages serves under /codeflow/.
const base = process.env.VITE_BASE ?? '/codeflow/'

export default defineConfig({
  base,
  logLevel: 'error', // Suppress warnings, only show errors
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
