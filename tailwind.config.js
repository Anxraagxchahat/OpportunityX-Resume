/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ox: {
          dark: "#05070D",
          card: "#0B0D14",
          "card-hover": "#10131D",
          border: "rgba(148, 163, 184, 0.12)",
          "border-glow": "rgba(249, 115, 22, 0.25)",
          primary: "#F97316",
          "primary-hover": "#EA580C",
          secondary: "#EAB308",
          highlight: "#F59E0B",
          text: "#F8FAFC",
          muted: "#94A3B8",
          green: "#10B981",
          red: "#EF4444",
        },
      },
      fontFamily: {
        sans: ['Satoshi', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "24px",
      },
      boxShadow: {
        glass: "0 16px 40px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.05)",
        glow: "0 0 25px rgba(249, 115, 22, 0.25)",
        "glow-lg": "0 0 50px rgba(249, 115, 22, 0.35)",
        paper: "0 20px 50px rgba(0, 0, 0, 0.5), 0 2px 10px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
