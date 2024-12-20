import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(modal|spinner).js"
  ],
  prefix: "",
  theme: {
    fontFamily: {
      'oswald': ['Oswald', "sans-serif"],
    },
    
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        'publications-header':
          'url(https://utfs.io/f/b05fb922-f9a8-47ef-8834-dbed170256c5-1d.png)',
      },
      backgroundPosition: {
        'right-70': 'right 70%',
      },
      backgroundSize: {
        '70': '70%',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  /* plugins: [require(tailwindcss-animate),nextui()], */
} satisfies Config

export default config