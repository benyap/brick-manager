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
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
