import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cloudflare(),
    ViteImageOptimizer({
      exclude: /\.svg$/i,
      png: { quality: 75 },
      jpeg: { quality: 75 },
      jpg: { quality: 75 },
    }),
  ],
})
