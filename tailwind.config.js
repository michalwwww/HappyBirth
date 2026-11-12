/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FDFAF6",
        ink: {
          DEFAULT: "#4A3A5E",
          2: "#6E5C7D",
          3: "#7A6786",
        },
        hb: {
          primary: "#DA0271",
          deep: "#C00265",
          tint: "#F9E6EC",
          line: "#EADFD3",
          dark: "#4A3A5E",
        },
        stage: {
          1: "#867A72",
          2: "#15803d",
          3: "#b45309",
          4: "#0369a1",
          5: "#EC008C",
          6: "#7e22ce",
          7: "#be185d",
          8: "#0e7490",
          9: "#4338ca",
        }
      },
      fontFamily: {
        sans: ['Nunito', 'ui-rounded', 'system-ui', 'sans-serif'],
        display: ['Besley', 'Georgia', 'serif'],
        serif: ['Besley', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
