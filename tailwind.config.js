/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lol-blue': '#0F2027',
        'lol-gold': '#C89B3C',
        'lol-light-blue': '#1E2328',
        'team-blue': '#0596BE',
        'team-red': '#E74C3C',
      },
      fontFamily: {
        'riot': ['Beaufort for LOL', 'serif'],
      }
    },
  },
  plugins: [],
}