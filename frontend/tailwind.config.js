/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        obsidian: {
          bg: "#09090B",
          surface: "rgba(255, 255, 255, 0.03)",
          border: "rgba(255, 255, 255, 0.05)",
        },
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(99, 102, 241, 0.35)",
        "glow-sm": "0 0 24px -8px rgba(99, 102, 241, 0.28)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
