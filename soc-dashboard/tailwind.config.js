/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0f18',
        surface: '#151b23',
        surfaceHover: '#1f2937',
        primary: '#3b82f6', // Action / Blue
        safe: '#10b981', // 0-39 Vert
        suspect: '#f59e0b', // 40-79 Orange
        fraud: '#ef4444', // 80-100 Rouge
        textMain: '#f3f4f6',
        textMuted: '#9ca3af',
        borderLine: '#374151'
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
