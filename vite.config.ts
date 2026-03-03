import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import preact from '@preact/preset-vite'
import svgr from 'vite-plugin-svgr'
import { resolve } from 'path'

export default defineConfig({
  plugins: [tailwindcss(), svgr(), preact()],
  resolve: {
    alias: {
      src: resolve(__dirname, 'src')
    }
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
})
