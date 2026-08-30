/** @type {import('tailwindcss').Config} */
// Every value here comes straight from design.md. If a colour or a font size
// is not in this file, it should not appear in the app.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#12140F',
        surface: '#1A1D16',
        border: '#2A2D25',
        text: '#E8EAE2',
        muted: '#6E7466',
        accent: '#F2A93C',
        'accent-dim': '#7A5A1E',
        ready: '#86C34A',
        danger: '#D9553F',
      },
      fontFamily: {
        // Inter for language, JetBrains Mono for anything that is a number or an id.
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        label: ['11px', { lineHeight: '14px', letterSpacing: '0.08em' }],
        price: ['13px', { lineHeight: '18px' }],
        body: ['14px', { lineHeight: '20px' }],
        heading: ['20px', { lineHeight: '26px' }],
        metric: ['20px', { lineHeight: '26px' }],
        hero: ['38px', { lineHeight: '44px' }],
      },
      maxWidth: {
        content: '420px',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
};
