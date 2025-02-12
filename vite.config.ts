import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      "/melhorenvio": {
        target: "https://www.melhorenvio.com.br/api/v2",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/melhorenvio/, ""),
      },
    },
  },
})
