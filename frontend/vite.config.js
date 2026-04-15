import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ckd-ai-clinical-structuring-platform/', // Explicit base path for GitHub Pages
})
