export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f7fce3",
          100: "#eef9cc",
          200: "#d9f099",
          300: "#c4e866",
          400: "#af7f33",
          500: "#98C83C",
          600: "#7db032",
          700: "#629828",
          800: "#47701e",
          900: "#2c4814",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "xs": "4px",
        "sm": "6px",
        "base": "8px",
        "lg": "12px",
      },
    },
  },
  plugins: [],
};