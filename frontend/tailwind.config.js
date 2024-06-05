/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primaryBg': "#f9f9f9",
        'lightBg': "#dcbb9f",
        'secondaryBg': "#191919",
        'btnColor': "#57BFCE",
        'fontPrimaryColor': "#2e2e2e",
        'fontPrimaryColor1': "#1c192a",
        'fontSecondaryColor': "#828282",
        'footerColor': "#303030",
        'pColor': "#777577"
      },
      fontFamily: {
        'poetsen-one': ['Poetsen One', 'sans-serif'],
      },
      width: {
        '50vw': '50vw',
      },
    },
    container: {
      padding: {
        md: "10rem",
      },
    },
    
  },
  plugins: [],
};