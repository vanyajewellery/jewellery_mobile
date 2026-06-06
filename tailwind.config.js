/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#C5A880',
          cream: '#FDFBF7',
          charcoal: '#1A1A1A',
        }
      }
    },
  },
  plugins: [],
}
