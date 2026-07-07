export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#E8C874',
          500: '#C9A24B',
          600: '#A8832F',
        },
        ink: {
          900: '#0B1420',
          800: '#0F1B2B',
          700: '#152438',
        },
      },
      keyframes: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        aurora: 'aurora 6s ease infinite',
      },
    },
  },
  plugins: [],
}
