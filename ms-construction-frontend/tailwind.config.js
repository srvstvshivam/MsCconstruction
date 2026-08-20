/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
        sans: ['"Barlow"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        theme: {
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          accent: 'var(--color-accent)',
          bg: 'var(--color-background)',
          text: 'var(--color-text)',
          heading: 'var(--color-heading)',
          button: 'var(--color-button)',
        },
        navy: {
          950: '#0b1220',
          900: '#0f1b2d',
          800: '#16273f',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
}
