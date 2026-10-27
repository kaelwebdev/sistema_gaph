import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/schemas/*.test.ts',
      'tests/actions/*.test.ts',
      'tests/lib/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/lib/schemas/**/*.ts', 'src/lib/actions/**/*.ts', 'src/lib/pdf/**/*.ts'],
      exclude: ['src/lib/actions/index.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
