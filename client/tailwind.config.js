/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          900: '#2A1426',
          DEFAULT: '#45233F', // Deep plum
          800: '#5A2E52',
          700: '#713B60', // Rich berry
        },
        berry: {
          DEFAULT: '#713B60', // Rich berry
          light: '#8E4D7A',
        },
        rose: {
          muted: '#C98298', // Muted rose
          blush: '#F5E5EA', // Soft blush
        },
        ivory: {
          warm: '#FFFAF6', // Warm ivory
          50: '#FFFDFB',
        },
        champagne: {
          DEFAULT: '#C6A36A', // Champagne accent
          light: '#E0C596',
          dark: '#A68349',
        },
        text: {
          primary: '#29232B',
          secondary: '#756B76',
        },
        status: {
          success: '#287A62',
          warning: '#A86B24',
          emergency: '#B42335',
        },
        border: {
          subtle: '#E9DFE5',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(69, 35, 63, 0.06), 0 2px 6px -1px rgba(69, 35, 63, 0.04)',
        'elevated': '0 12px 32px -4px rgba(69, 35, 63, 0.12), 0 4px 12px -2px rgba(69, 35, 63, 0.06)',
        'sos': '0 0 0 10px rgba(180, 35, 53, 0.15), 0 0 0 20px rgba(180, 35, 53, 0.08)',
        'sos-active': '0 0 0 14px rgba(180, 35, 53, 0.25), 0 0 0 28px rgba(180, 35, 53, 0.12), 0 10px 30px rgba(180, 35, 53, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 2s linear infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
        ripple: {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(180, 35, 53, 0.4)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 24px rgba(180, 35, 53, 0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(180, 35, 53, 0)' },
        }
      }
    },
  },
  plugins: [],
}
