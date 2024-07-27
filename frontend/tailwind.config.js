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
        'goldColor':"#fe6a06",
        'darkGold':"#3D270C",
        'footerColor':"#13130F",
        'btnColor':"#AD8B3A",
      },
      fontFamily: {
        'LuzuryF1': ["Antic Didone", 'serif'],
        'LuzuryF2': ["Raleway", 'serif'],
        'LuzuryF3': ["Roboto Serif", 'sans-serif'],
        'HKFONT': ["Hanken Grotesk", 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      width: {
        '50vw': '50vw',
        '80vw': '80vw'
      },
      animation: {
        'fade-right': 'fadeRight 0.5s ease-in-out',
        'twice': 'fadeRight 0.5s ease-in-out 0s 1 normal forwards',
      },
      keyframes: {
        fadeRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
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