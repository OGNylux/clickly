/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      screens: {
        '3xl': '1650px',
        '4xl': '1800px',
      },
    },
  },
  plugins: [],
}

