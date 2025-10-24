/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // <-- THIS enables dark mode switching
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
