import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'tensorflow': ['@tensorflow/tfjs'],
          'auth': ['@auth0/auth0-react']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['three', '@tensorflow/tfjs']
  }
})