const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/renderer/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "1600px",
        "4xl": "1800px",
        "5xl": "2000px",
      },
      colors: {
        "lego-yellow": {
          DEFAULT: "#ffcf00",
        },
        "lego-red": {
          DEFAULT: "#d01012",
        },
        "lego-navy": {
          200: "#797791",
          300: "#4D4A6D",
          DEFAULT: "#201d48",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
