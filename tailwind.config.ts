import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
        },
        ink: {
          DEFAULT: '#0a0a0f',
          light: '#12121a',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.08), 0 4px 16px -2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.12), 0 12px 32px -4px rgba(0,0,0,0.10)',
        glow: '0 0 24px rgba(45,212,191,0.35)',
        'dark-card': '0 8px 32px rgba(0,0,0,0.4)',
        'gold-glow': '0 8px 40px rgba(201,168,76,0.25)',
        'gold-glow-hover': '0 0 40px rgba(201,168,76,0.5), 0 8px 40px rgba(201,168,76,0.3)',
        'silver-glow-hover': '0 0 40px rgba(176,184,193,0.4), 0 8px 40px rgba(176,184,193,0.25)',
        'phone-glow': '0 4px 24px rgba(20,184,166,0.5)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #0a0a0f 55%, #063b38 100%)',
        'silver-gradient': 'linear-gradient(135deg, #8d9caa, #b0b8c1, #8d9caa)',
        'gold-gradient': 'linear-gradient(135deg, #c9a84c, #f0d080)',
        'gold-bar-gradient': 'linear-gradient(90deg, #c9a84c, #f0d080, #c9a84c)',
      },
    },
  },
  plugins: [],
}

export default config
