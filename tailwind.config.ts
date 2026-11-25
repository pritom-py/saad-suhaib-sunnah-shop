import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#063D2B",
          dark: "#03271D",
          light: "#12563D",
          50: "#F0F7F4",
          100: "#D8EBE2",
          200: "#B2D8C6",
          800: "#063D2B",
          900: "#03271D",
        },
        maroon: {
          DEFAULT: "#780E15",
          dark: "#52080D",
          light: "#9A1821",
        },
        gold: {
          DEFAULT: "#D4A43B",
          light: "#F3D58A",
          dark: "#A87815",
        },
        ivory: {
          DEFAULT: "#FBF7EC",
          50: "#FCF9F2",
          100: "#FBF7EC",
          200: "#F5EFDF",
        },
        cream: "#F5EFDF",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7F5EE",
          border: "#E5D9BD",
        },
        text: {
          primary: "#18231D",
          secondary: "#667069",
          muted: "#8F9A93",
        },
      },
      fontFamily: {
        bengali: ["var(--font-hind)", "var(--font-noto)", "sans-serif"],
        sans: ["var(--font-inter)", "var(--font-noto)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px -1px rgba(6, 61, 43, 0.08), 0 1px 3px -1px rgba(6, 61, 43, 0.04)",
        "card-hover": "0 10px 25px -3px rgba(6, 61, 43, 0.12), 0 4px 6px -2px rgba(6, 61, 43, 0.05)",
        gold: "0 0 15px rgba(212, 164, 59, 0.35)",
        deep: "0 10px 30px rgba(3, 39, 29, 0.2)",
      },
      screens: {
        xs: "375px",
        sm: "430px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
