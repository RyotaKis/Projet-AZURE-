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
        'surface-hover': '#1f2937',
        primary: '#3b82f6', // Action / Blue
        safe: '#10b981', // 0-39 Vert
        suspect: '#f59e0b', // 40-79 Orange
        fraud: '#ef4444', // 80-100 Rouge
        'text-main': '#f3f4f6',
        'text-muted': '#9ca3af',
        'border-line': '#374151'
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
