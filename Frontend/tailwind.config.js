/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple:'#8B5CF6',
        gray : {
          400: '#9CA3AF',
          700: '#4B4B4B',
          800: '#2D2D2D',
          900: '#1E1E1E',
          950: '#121212',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      
    },
  },
  plugins: [],
}
