/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#F7F1E1',
          100: '#EFE3C6',
          200: '#DFCB9E',
          300: '#C9AC6F',
          400: '#B3954F',
          500: '#A68A46',
          600: '#9E8242',
          700: '#84693A',
          800: '#6B5430',
          900: '#4E3E23',
        },
        terra: {
          50: '#FBEDE5',
          100: '#F4D4C2',
          200: '#E7AE90',
          300: '#D2845E',
          400: '#B85E38',
          500: '#7D3A17',
          600: '#6E3314',
          700: '#5C2B10',
          800: '#47200C',
          900: '#331705',
        },
        cream: '#FBF3E4',
      },
      fontFamily: {
        display: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.92)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s ease-out both',
        'fade-in': 'fade-in 0.35s ease-out both',
        'slide-in': 'slide-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pop': 'pop 0.3s ease-out both',
      },
    },
  },
  plugins: [],
};
