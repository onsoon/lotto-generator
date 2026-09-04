/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lotto: {
          yellow: '#FBC400',
          blue: '#69C8F2',
          red: '#FF7272',
          gray: '#AAAAAA',
          green: '#B0D840',
        },
      },
      boxShadow: {
        'ball': 'inset -4px -4px 9px rgba(0, 0, 0, 0.35), inset 4px 4px 9px rgba(255, 255, 255, 0.6), 0 6px 12px rgba(0, 0, 0, 0.15)',
        'ball-sm': 'inset -2px -2px 5px rgba(0, 0, 0, 0.3), inset 2px 2px 5px rgba(255, 255, 255, 0.5), 0 3px 6px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
