/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020b06",
        surface: "#0a1a0f",
        card: "rgba(10, 30, 15, 0.8)",
        primary: "#00ff88",
        secondary: "#00cc6a",
        accent: "#f59e0b",
        text: "#e2f5ea",
        muted: "#6b9e7a",
        danger: "#ff4444",
        warning: "#ffaa00",
        success: "#00ff88",
        border: "rgba(0, 255, 136, 0.15)",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        hindi: ["Noto Sans Devanagari", "sans-serif"],
      },
      animation: {
        'scan': 'scan 2s infinite linear',
        'pulse-glow': 'pulse-glow 2s infinite',
        'float': 'float 6s infinite ease-in-out',
      },
      keyframes: {
        scan: {
          '0%': { top: '0%', opacity: '0.4' },
          '50%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0.4' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 40px rgba(0, 255, 136, 0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.3' },
          '50%': { transform: 'translateY(-20px)', opacity: '0.6' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
