/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Casual Chic Brand Typography
        heading: ['Libre Baskerville', 'Georgia', 'Times New Roman', 'serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Casual Chic Brand Colors
        brand: {
          cream: '#EFE9E5',
          'light-beige': '#E2D6D1',
          taupe: '#B6A59D',
          'dusty-rose': '#CC8B81',
          'taupe-brown': '#A18D84',
          sage: '#A6AF99',
          mustard: '#D2C76C',
          'soft-blue': '#94A9C9',
          olive: '#8E9B8D',
        },
      },
    },
  },
  plugins: [],
}
