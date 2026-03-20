/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ea580c',
        'primary-light': '#fb923c',
        'primary-dark': '#c2410c',
        accent: '#fdba74',
        warm: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Lora', 'Georgia', 'serif'],
      },
      boxShadow: {
        'warm': '0 4px 14px -2px rgba(234, 88, 12, 0.1), 0 2px 6px -2px rgba(234, 88, 12, 0.06)',
        'warm-lg': '0 10px 25px -5px rgba(234, 88, 12, 0.1), 0 4px 10px -5px rgba(234, 88, 12, 0.04)',
      },
    },
  },
  plugins: [],
};
