import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        secure: false,
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [
    react(),
    {
      name: "tailwindcss",
      enforce: "pre",
      apply: "build",
      async configResolved(config) {
        config.css = config.css || {};
        config.css.postcss = {
          plugins: [
            (await import("tailwindcss")).default,
            (await import("autoprefixer")).default,
          ],
        };
      },
    },
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@utils": "/src/utils",
    },
  },
});
