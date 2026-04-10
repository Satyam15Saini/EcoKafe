/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './Components/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00bfa5',
        'primary-dark': '#00897b',
        'primary-light': '#26c6da',
      },
    },
  },
  plugins: [],
};
