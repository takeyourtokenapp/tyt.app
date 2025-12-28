/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-bg-primary) / <alpha-value>)',
          text: 'rgb(var(--color-text-primary) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
          text: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        },
        tertiary: {
          DEFAULT: 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
          text: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
        },
        'card-bg': 'rgb(var(--color-bg-card) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--color-accent-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-accent-secondary) / <alpha-value>)',
          active: 'rgb(var(--color-accent-tertiary) / <alpha-value>)',
        },
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',

        gold: {
          DEFAULT: 'rgb(var(--color-gold) / <alpha-value>)',
          50: '#FFF9E6',
          100: '#FFF1CC',
          200: '#FFE299',
          300: '#FFD466',
          400: '#FFC533',
          500: '#D2A44C',
          600: '#B8923F',
          700: '#9E7F32',
          800: '#846D25',
          900: '#6A5A18',
        },
        owl: {
          dark: '#0A1122',
          navy: '#1A2744',
          slate: '#2A3F66',
        },
        neon: {
          cyan: '#00FFFF',
          magenta: '#FF00FF',
          amber: '#FFBF00',
          lime: '#CCFF00',
        },
        knight: {
          steel: '#B0BEC5',
          iron: '#78909C',
          bronze: '#D4A574',
        },
      },
      backgroundImage: {
        'owl-gradient': 'linear-gradient(135deg, #D2A44C 0%, #B8923F 50%, #9E7F32 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #0A1122 0%, #1A2744 50%, #2A3F66 100%)',
        'shield-gradient': 'radial-gradient(ellipse at center, #D2A44C 0%, #846D25 100%)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow-md)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'gold-glow': '0 0 20px rgba(210, 164, 76, 0.5)',
        'neon-cyan': '0 0 15px rgba(0, 255, 255, 0.5)',
        'neon-magenta': '0 0 15px rgba(255, 0, 255, 0.5)',
        'owl-shadow': '0 10px 40px rgba(210, 164, 76, 0.3)',
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: 'rgb(var(--color-border-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-border-secondary) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
