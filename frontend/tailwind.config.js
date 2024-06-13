/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 'btnColor': "#57BFCE",
        'fontPrimaryColor': "#B5813F",
        'fontSecondaryColor': "#3D270C",
        // 'footerColor': "#303030",
        'mobileColor': "#193153",
        'goldColor':"#B5813F",
        'darkGold':"#3D270C",
        'footerColor':"#13130F",
        'btnColor':"#AD8B3A",
      },
      fontFamily: {
        'LuzuryF1': ['"Antic Didone"', 'serif'],
        'LuzuryF2': ['"Raleway"', 'serif'],
        'LuzuryF3': ['"Roboto Serif"', 'sans-serif'],
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