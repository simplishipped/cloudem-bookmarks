/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryDark: '#141414',
        secondaryDark: '#121212',
        textDark: 'rgb(255, 255, 255);',
        // textDark: 'rgb(203 213 225)',
        primaryLight: '#FEF3C7',
        secondaryLight: 'rgb(254 252 232)',
        textLight: '#404040',
        primaryButtonLight: 'rgb(196 181 253)',
        secondaryButtonLight: 'rgb(221 214 254)',
        secondaryButtonDark: 'rgb(79 70 229)',
        primaryButtonDark: 'rgb(99 102 241)',
        thirdButton: 'rgb(94 234 212)'
        // ...
      }
    },

  },
  plugins: [],
}
//'rgb(49 46 129)'