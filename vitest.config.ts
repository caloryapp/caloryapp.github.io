import { defineConfig } from 'vitest/config'
import preact from '@preact/preset-vite'
import svgr from 'vite-plugin-svgr'
import { resolve } from 'path'

export default defineConfig({
  plugins: [svgr(), preact()],
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
      react: resolve(__dirname, 'node_modules/preact/compat'),
      'react-dom': resolve(__dirname, 'node_modules/preact/compat'),
      'react/jsx-runtime': resolve(__dirname, 'node_modules/preact/jsx-runtime'),
      'react/jsx-dev-runtime': resolve(
        __dirname,
        'node_modules/preact/jsx-dev-runtime'
      )
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    alias: {
      react: resolve(__dirname, 'node_modules/preact/compat'),
      'react-dom': resolve(__dirname, 'node_modules/preact/compat'),
      'react/jsx-runtime': resolve(__dirname, 'node_modules/preact/jsx-runtime'),
      'react/jsx-dev-runtime': resolve(
        __dirname,
        'node_modules/preact/jsx-dev-runtime'
      )
    },
    server: {
      deps: {
        inline: ['dexie-react-hooks', 'react-i18next', 'use-debounce']
      }
    }
  }
})
