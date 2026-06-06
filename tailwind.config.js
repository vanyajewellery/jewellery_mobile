/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#D4AF37',
          cream: '#F9F9F9',
          charcoal: '#1A1A1A',
        }
      }
    },
  },
  plugins: [],
}
