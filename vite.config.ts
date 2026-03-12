import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import preact from '@preact/preset-vite'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'

const shouldAnalyze = process.env.ANALYZE === 'true'
const analyzeTemplate = process.env.ANALYZE_TEMPLATE || 'treemap'
const analyzeFilename = process.env.ANALYZE_OUT || 'reports/stats.html'

export default defineConfig({
  plugins: [...(process.env.VITEST ? [] : [tailwindcss()]), svgr(), preact()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      plugins: shouldAnalyze
        ? [
            visualizer({
              filename: analyzeFilename,
              template: analyzeTemplate,
              gzipSize: true,
              brotliSize: true,
              open: false
            })
          ]
        : [],
      input: {
        popup: resolve(__dirname, 'popup.html'),
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
