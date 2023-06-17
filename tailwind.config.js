/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary: "#ff4141",
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
