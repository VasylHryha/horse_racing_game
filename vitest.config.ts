import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    root: fileURLToPath(new URL('./', import.meta.url)),
    coverage: {
      reporter: ['text', 'lcov'],
      provider: 'v8',
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        '**/*.d.ts',
        'src/**/__tests__/**',
        'tests/**',
        // App shell and routing not covered by unit tests
        'src/main.ts',
        'src/App.vue',
        'src/router/**',
        // Demo/primitive UI wrappers not asserted directly
        'src/components/ui/**',
        // Example pages are exercised in E2E, not unit
        'src/pages/**',
      ],
      all: false,
      thresholds: { lines: 85, functions: 85, branches: 80, statements: 85 },
    },
  },
})
