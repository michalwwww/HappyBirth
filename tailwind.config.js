/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta robocza HAPPYBIRTH (papier i atrament)
        paper: {
          DEFAULT: "#FBF8F4",
          2: "#F6F2EC",
        },
        ink: {
          DEFAULT: "#1A1512",
          2: "#544A44",
          3: "#766A62",
        },
        line: "#EAE3DB",
        accent: {
          DEFAULT: "#FCD705",
          hover: "#F3CE00",
        },
        alarm: "#B32218",
        caution: "#A8802F",
        safe: "#2F6B4F",
        // Czyste kolory dziewięciu etapów (wyłącznie plama i symbol, nigdy tekst)
        stage: {
          zanim: "#8F8D8D",
          dwiekreski: "#54BF39",
          lepiej: "#FCD705",
          torba: "#F57B14",
          boli: "#ED1C24",
          planb: "#952999",
          pierwszanoc: "#EC008C",
          karmienie: "#00ADEF",
          niespi: "#3B46A4",
        },
        // Zachowane dla Strefy kursantki
        hb: {
          primary: "#EC008C",
          deep: "#C80077",
          tint: "#FAE3EB",
          line: "#EAE3DB",
          dark: "#1A1512",
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-bricolage)', 'Bricolage Grotesque', 'sans-serif'],
        serif: ['var(--font-instrument-serif)', 'Instrument Serif', 'Georgia', 'serif'],
      },
      borderRadius: {
        hb: "14px",
        "hb-lg": "22px",
      },
      maxWidth: {
        wrap: "1200px",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [],
}
