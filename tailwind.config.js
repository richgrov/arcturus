/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        login:
          "linear-gradient(to bottom, black, transparent), url('background.png')",
      },
      colors: {
        primary: "#ff4141",
        foreground: "#111",
        "foreground-dark": "#eee",
        "secondary-foreground": "#333",
        "secondary-foreground-dark": "#888",
        background: "#eee",
        "background-dark": "#111",
        "secondary-background": "#aaa",
        "secondary-background-dark": "#333",
      },
    },
  },
  plugins: [],
};
