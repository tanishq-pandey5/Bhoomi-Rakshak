/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: '#071A2B',
        panelBg: '#0B263D',
        tealAccent: '#16B8A6',
        saffronAccent: '#FF9F43',
        textWhite: '#F5F7FA',
        textMuted: '#9FB3C8',
        riskVeryLow: '#22C55E',
        riskLow: '#84CC16',
        riskModerate: '#FACC15',
        riskHigh: '#F97316',
        riskVeryHigh: '#EF4444',
        riskCritical: '#991B1B',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'Plus Jakarta Sans', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
