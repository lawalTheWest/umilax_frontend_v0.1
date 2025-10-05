/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        navy: '#1a2238',
        brown: '#8d5524',
        white: '#ffffff',
      },
    },
  },
  plugins: [],
}

