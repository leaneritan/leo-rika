/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#090b18',
        card: '#181c34',
        text: '#e8eaf6',
        muted: '#8b94bd',
        gold: '#FFD700',
        teal: '#4ECDC4',
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
