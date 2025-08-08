/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-light-blue': '#a2d2ff',
        'custom-grey': '#8a9cb1',
        // Add other custom colors from your CSS files if needed
      }
    },
  },
  plugins: [],
}