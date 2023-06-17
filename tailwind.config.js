/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary: "#ff4141",
      foreground: "#111",
      "foreground-dark": "#eee",
      background: "#eee",
      "background-dark": "#111",
    },
    extend: {
      backgroundImage: {
        login:
          "linear-gradient(to bottom, black, transparent), url('background.png')",
      },
    },
  },
  plugins: [],
};
