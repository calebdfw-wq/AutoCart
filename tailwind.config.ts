import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
      },
      colors: {
        // Surface layers (dark theme)
        surface: {
          950: '#04050A',
          900: '#07080C',
          800: '#0C0D12',
          700: '#121418',
          600: '#191B22',
          500: '#21242D',
          400: '#2A2E3A',
        },
        // Brand green
        brand: {
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        // Accent orange
        accent: {
          300: '#fcd34d',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-green': 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(74,222,128,0.09) 0%, transparent 60%)',
        'mesh-orange': 'radial-gradient(ellipse 60% 60% at 80% 80%, rgba(249,115,22,0.06) 0%, transparent 60%)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
        'shimmer': 'shimmer 2.2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(74,222,128,0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(74,222,128,0.3), 0 0 80px rgba(74,222,128,0.1)' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(74,222,128,0.15)',
        'glow-md': '0 0 30px rgba(74,222,128,0.2), 0 0 60px rgba(74,222,128,0.08)',
        'glow-lg': '0 0 60px rgba(74,222,128,0.25), 0 0 100px rgba(74,222,128,0.1)',
        'card': '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,222,128,0.15)',
      },
    },
  },
  plugins: [],
}

export default config
