import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Trigger fresh deploy without wrangler configuration
export default defineConfig({
  plugins: [react()],
})

