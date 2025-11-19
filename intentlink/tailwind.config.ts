// tailwind.config.ts
import type { Config } from "tailwindcss"

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Direct access to our design system colors for gradients etc.
      colors: {
        space: {
          900: '#030407',
          800: '#0B0C15',
          700: '#151725',
        },
        cyber: {
          cyan: '#00F0FF',
          purple: '#7000FF',
          pink: '#FF0099',
          yellow: '#FCEE0A',
        },
        defi: {
          success: '#00FF94',
          error: '#FF2A2A',
        },
        glass: {
          stroke: 'rgba(255, 255, 255, 0.1)',
          fill: 'rgba(11, 12, 21, 0.6)',
        },
      },
      fontFamily: {
        display: ["var(--font-rajdhani)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        'cyber-cyan-glow': '0 0 15px rgba(0, 240, 255, 0.1)',
        'cyber-cyan-glow-hover': '0 0 25px rgba(0, 240, 255, 0.5)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config

export default config