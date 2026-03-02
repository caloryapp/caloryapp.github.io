import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import svgr from 'vite-plugin-svgr'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    // Prevent Ladle from injecting @vitejs/plugin-react-swc alongside Preact,
    // which causes duplicate React Refresh globals.
    { name: 'vite:react-swc' },
    svgr(),
    preact()
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, 'src')
    }
  }
})
