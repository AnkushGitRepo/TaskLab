/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B4EFF',
          50: '#F0EDFF',
          100: '#E5DEFF',
          200: '#C8BFFF',
          300: '#A89BFF',
          400: '#8A77FF',
          500: '#6B4EFF',
          600: '#522DE6',
          700: '#3D1FBF',
          800: '#291499',
          900: '#190064',
        },
        secondary: {
          DEFAULT: '#FFD84D',
          50: '#FFFBEB',
          100: '#FFF3C4',
          200: '#FFE87E',
          300: '#FFD84D',
          400: '#F5C400',
          500: '#E9C339',
          600: '#CCA800',
          700: '#A88500',
          800: '#735D00',
          900: '#564500',
        },
        surface: {
          DEFAULT: '#FCF8FF',
          dim: '#DDD8E6',
          bright: '#FCF8FF',
          container: {
            lowest: '#FFFFFF',
            low: '#F7F1FF',
            DEFAULT: '#F1ECFA',
            high: '#EBE6F4',
            highest: '#E5E0EF',
          },
        },
        on: {
          surface: '#1C1A24',
          'surface-variant': '#474556',
          primary: '#FFFFFF',
          secondary: '#FFFFFF',
        },
        outline: {
          DEFAULT: '#787587',
          variant: '#C9C4D9',
        },
        error: {
          DEFAULT: '#BA1A1A',
          container: '#FFDAD6',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['40px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'ui-md': ['14px', { lineHeight: '1.4', fontWeight: '500' }],
        'label': ['12px', { lineHeight: '1', fontWeight: '600', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        'pill': '9999px',
        'card': '16px',
        'md': '12px',
        'sm': '8px',
        'xs': '4px',
      },
      boxShadow: {
        'card': '0px 4px 20px rgba(0, 0, 0, 0.04)',
        'modal': '0px 12px 32px rgba(107, 78, 255, 0.08)',
        'hover': '0px 8px 28px rgba(107, 78, 255, 0.12)',
        'focus': '0 0 0 3px rgba(107, 78, 255, 0.25)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '120': '30rem',
      },
      maxWidth: {
        'container': '1280px',
      },
    },
  },
  plugins: [],
};
