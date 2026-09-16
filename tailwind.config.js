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
        paper: "#FBF8F4",
        ink: {
          DEFAULT: "#1A1512",
          2: "#544A44",
          3: "#867A72",
        },
        hb: {
          primary: "#EC008C",
          deep: "#C80077",
          tint: "#FAE3EB",
          line: "#EAE3DB",
          dark: "#1A1512",
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-bricolage)', 'Bricolage Grotesque', 'sans-serif'],
        serif: ['var(--font-instrument)', 'Instrument Serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
