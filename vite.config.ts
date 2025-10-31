import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
// Configure base path for GitHub Pages deployments.
// If GH_PAGES_BASE is provided (e.g. "/your-repo/"), use it in production builds.
// Otherwise default to '/'. Dev always stays '/'.
const GH_BASE = process.env.GH_PAGES_BASE && process.env.GH_PAGES_BASE.startsWith('/')
  ? process.env.GH_PAGES_BASE
  : '/'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? GH_BASE : '/',
  plugins: [
    vue(),
    // Avoid enabling Vue DevTools and Tailwind plugin in test mode to prevent side-effects
    ...(mode === 'test' ? [] : [vueDevTools(), tailwindcss()]),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
