import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

const base = process.env.VITE_BASE ?? '/'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)))

export default defineConfig({
  base,
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  logLevel: 'warn',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return /node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)
              ? 'vendor'
              : undefined
          }
          if (/\/src\/content\/(projects\.generated|categories|schema)\./.test(id)) {
            return undefined
          }
          if (id.includes('/src/content/curriculum/')) {
            const m = id.match(/module-(\d+)/)
            return m ? `curriculum-module-${m[1]}` : 'curriculum'
          }
          if (id.includes('/src/content/competitive/')) {
            return 'curriculum-competitive'
          }
          if (id.includes('/src/content/')) {
            return 'curriculum'
          }
        },
      },
    },
  },
})
