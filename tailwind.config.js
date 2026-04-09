/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: "#6D28D9",      // purple
        brandDark: "#2e003e"   // ✅ THIS WAS MISSING
      }
    }
  },
  plugins: []
};