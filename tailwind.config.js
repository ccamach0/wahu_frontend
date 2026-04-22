/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        wahu: {
          50: '#FFF5F0',
          100: '#FFE8D9',
          200: '#FFD0B5',
          300: '#FFB088',
          400: '#FF8A50',
          500: '#FF6B35',
          600: '#E85020',
          700: '#C43A10',
          800: '#9E2E0D',
          900: '#7A2410',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
