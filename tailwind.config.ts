import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0E9F6E',
          dark: '#057A55',
          soft: '#DEF7EC',
        },
        ink: {
          DEFAULT: '#111827',
          muted: '#6B7280',
          faint: '#9CA3AF',
        },
        verdict: {
          good: '#0E9F6E',
          moderate: '#C27803',
          avoid: '#E02424',
        },
      },
      boxShadow: {
        card: '0 4px 16px rgba(11, 31, 51, 0.06)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
