/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mirror: {
          dark: "#050508",
          card: "rgba(13, 15, 24, 0.7)",
          border: "rgba(255, 255, 255, 0.08)",
          cyan: "#38bdf8",
          indigo: "#6366f1",
          purple: "#a855f7",
          amber: "#f59e0b",
          emerald: "#10b981",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Space Mono", "monospace"],
      },
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        mirrorDark: {
          "primary": "#6366f1",
          "secondary": "#a855f7",
          "accent": "#38bdf8",
          "neutral": "#0d0f18",
          "base-100": "#050508",
          "info": "#38bdf8",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#f43f5e",
        },
      },
    ],
    darkTheme: "mirrorDark",
    base: true,
    styled: true,
    utils: true,
  },
};
