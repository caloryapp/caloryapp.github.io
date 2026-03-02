import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'

const shouldAnalyze = process.env.ANALYZE === 'true'
const analyzeTemplate = process.env.ANALYZE_TEMPLATE || 'treemap'
const analyzeFilename = process.env.ANALYZE_OUT || 'reports/stats.html'

export default defineConfig({
  plugins: [svgr(), preact()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/libs/index.ts'),
      name: 'CaloryApp',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs')
    },
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
      external: ['preact', 'preact/hooks'],
      output: {
        globals: {
          preact: 'preact'
        }
      }
    }
  }
})
