import path from 'path'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'

export default defineConfig({
  build: {
    minify: false,
  },

  plugins: [
    electron({
      main: {
        entry: 'electron/index.ts',
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      renderer: {
        resolve: {
          sqlite3: { type: 'cjs' },
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@geo': path.resolve(__dirname, 'src/geo/'), // Пример алиаса
    }}
})