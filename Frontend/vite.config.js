import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'tailwindcss',
      enforce: 'pre',
      apply: 'build',
      async configResolved(config) {
        config.css = config.css || {};
        config.css.postcss = {
          plugins: [
            (await import('tailwindcss')).default,
            (await import('autoprefixer')).default,
          ],
        };
      },
    },
    tailwindcss(),
  ],
})