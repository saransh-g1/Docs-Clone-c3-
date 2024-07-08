/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        "lato": ['Barlow Semi Condensed','Static'],
        "play":['Playfair Display']
      }
    },
  },
  plugins: [],
}