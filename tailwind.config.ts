import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        surface: '#ffffff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f1f5f9',
        'surface-container': '#ffffff',
        'surface-container-high': '#f1f5f9',
        'surface-container-highest': '#e2e8f0',
        'on-surface': '#0f172a',
        'on-surface-variant': '#475569',
        outline: '#cbd5e1',
        'outline-variant': '#e2e8f0',
        primary: '#0f172a',
        'on-primary': '#ffffff',
        'primary-container': '#f1f5f9',
        'on-primary-container': '#0f172a',
        secondary: '#475569',
        'on-secondary': '#ffffff',
        'secondary-container': '#f8fafc',
        'on-secondary-container': '#0f172a',
        tertiary: '#d97706',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#fef3c7',
        'on-tertiary-container': '#78350f',
        error: '#dc2626',
        'on-error': '#ffffff',
        'error-container': '#fee2e2',
        'on-error-container': '#991b1b',
      },
      spacing: {
        'gutter-lg': '24px',
        'card-gap': '20px',
      },
      fontFamily: {
        body: ['Century Gothic', 'CenturyGothic', 'AppleGothic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
