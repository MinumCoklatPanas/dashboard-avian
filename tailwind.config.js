/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './features/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
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
        secondary: '#475569',
        error: '#dc2626',
        tertiary: '#d97706',
      },
      spacing: {
        'gutter-lg': '24px',
        'card-gap': '20px',
      },
      fontFamily: {
        body: ['Century Gothic', 'CenturyGothic', 'AppleGothic', 'sans-serif'],
      },
      fontSize: {
        'headline-lg': ['36px', { lineHeight: '44px', fontWeight: '600' }],
        'headline-md': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'display-lg': ['56px', { lineHeight: '64px', letterSpacing: '-0.02em', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
};
