import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Macramumu brand palette — Nordic Boho Warm
        cream: {
          50:  '#FDFAF6',
          100: '#FAF5EC',
          200: '#F5ECD8',
          300: '#EDD9BC',
          400: '#E2C49A',
          500: '#D4A96A',
        },
        blush: {
          50:  '#FDF6F4',
          100: '#FAEAE6',
          200: '#F5D0C8',
          300: '#EDB5A8',
          400: '#E09080',
          500: '#CC6B58',
        },
        sand: {
          50:  '#FAFAF8',
          100: '#F5F3EE',
          200: '#EAE6DC',
          300: '#D9D2C2',
          400: '#C4BAA4',
          500: '#A89880',
        },
        bark: {
          100: '#E8DDD0',
          200: '#C9B8A0',
          300: '#A89070',
          400: '#8A6E4E',
          500: '#6B5038',
          600: '#4E3A28',
        },
        sage: {
          100: '#E8EDE6',
          200: '#C8D4C4',
          300: '#A4B89E',
          400: '#7E9876',
          500: '#5C7A54',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
        body:  ['"Lato"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl':  '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft':    '0 2px 20px rgba(180, 150, 110, 0.12)',
        'warm':    '0 4px 30px rgba(180, 150, 110, 0.18)',
        'product': '0 8px 40px rgba(100, 70, 40, 0.10)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '96': '24rem',
        '128': '32rem',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'float':      'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
