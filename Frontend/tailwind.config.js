/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          // Custom light theme
          primary: "#4f46e5",
          secondary: "#f59e0b",
          accent: "#f472b6",
          neutral: "#1f2937",
          "base-100": "#ffffff",
          info: "#3b82f6",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
      "dark", // Default dark theme
    ],
    darkTheme: "dark", // Explicitly set dark theme
    base: true, // Applies base styles
    styled: true, // Includes component styles
    utils: true, // Includes responsive utilities
    logs: true, // Shows theme info in console
  },
  darkMode: "class", // Required for DaisyUI dark mode
};
