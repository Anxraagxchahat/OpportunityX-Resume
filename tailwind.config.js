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
          dark: "var(--ox-bg)",
          card: "var(--ox-card-bg)",
          "card-hover": "var(--ox-card-hover)",
          border: "var(--ox-border)",
          "border-glow": "var(--ox-border-highlight)",
          primary: "#F97316",
          "primary-hover": "#EA580C",
          secondary: "#EAB308",
          highlight: "#F59E0B",
          text: "var(--ox-text-primary)",
          muted: "var(--ox-text-secondary)",
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
