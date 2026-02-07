export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#197fe6",
        "background-light": "#f6f7f8",
        "background-dark": "#111921",
        "card-dark": "#1a252f",
        "surface-dark": "#1a242f",
        "border-dark": "#243647",
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"],
        "body": ["Manrope", "sans-serif"]
      },
      borderRadius: {
        "xl": "0.75rem",
      }
    },
  },
  plugins: [],
}
