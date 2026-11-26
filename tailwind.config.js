/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        magenta: '#E5198D',
        magentaDark: '#C41279',
        magentaText: '#B01277',
        turquesa: '#2FCFBE',
        turquesaDark: '#0E8F82',
        rosaCard: '#F8D6E4',
        rosaPill: '#FBDEEC',
        turqCard: '#D2F1EC',
        bg: '#FCF3F7',
        bgTint: '#FBE7F0',
        carbon: '#3A2336',
        gris: '#9B8A95',
        coach: '#7B6772',
        yellow: '#FBD24E',
        yellowSoft: '#FFF1C7',
        gold: '#A8821F',
      },
      fontFamily: {
        display: ['Fredoka', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 22px rgba(58, 35, 54, 0.07)',
        cta: '0 8px 20px rgba(229, 25, 141, 0.28)',
      },
    },
  },
  plugins: [],
};
