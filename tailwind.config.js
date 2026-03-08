/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ThinkSafe-inspired pastel palette
        primary: {
          50: '#fff5f0',
          100: '#ffe8dc',
          200: '#ffd4c3',
          300: '#ffb899',
          400: '#ff9466',
          500: '#ff7043',
          600: '#f55a2c',
          700: '#e04820',
          800: '#b83e1d',
          900: '#96361d',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e5fe',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          50: '#fdf4f3',
          100: '#fce8e5',
          200: '#fad4cf',
          300: '#f6b4ac',
          400: '#ef8679',
          500: '#e36150',
          600: '#cf4637',
          700: '#ad372b',
          800: '#8e2e22',
          900: '#5d2419',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
    },
  },
  plugins: [],
}