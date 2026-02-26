/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617',
        surface: '#0F172A',
        card: '#1E293B',
        indigo: '#6366F1',
        cyan: '#06B6D4',
        purple: '#8B5CF6',
        textPrimary: '#E2E8F0',
        textMuted: '#94A3B8',
      },
      boxShadow: {
        glow: '0 0 25px rgba(99,102,241,0.35)',
      },
    },
  },
  plugins: [],
}

