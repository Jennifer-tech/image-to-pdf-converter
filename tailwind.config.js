/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        primaryRegular:['Regular'],
        primaryMedium:['Medium'],
        primaryBold:['Bold'],
        DancingScriptRegular: ['DancingScriptRegular'],
      },
    },
  },
  plugins: [],
};
