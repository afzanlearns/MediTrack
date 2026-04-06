/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Display: for headings, hero text, page titles
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        // Body: for all UI text, labels, buttons
        sans: ['"DM Sans"', 'sans-serif'],
        // Mono: for ALL numbers — vitals, doses, times, counts
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        // Surface system — 4 layers of darkness
        surface: {
          0: '#080B0F',   // app background (deepest)
          1: '#0E1318',   // card background
          2: '#141B23',   // input background, hover state
          3: '#1C2530',   // borders, dividers
        },
        // Single accent — DO NOT use any other color for interactive elements
        accent: '#00C896',
        // Text system
        ink: {
          1: '#F0F4F8',   // primary text
          2: '#8A9BAE',   // secondary text, labels
          3: '#3D5166',   // muted text, placeholders
        },
        // Semantic — used ONLY for status communication, never decoration
        ok:   '#00C896',  // same as accent — taken, normal, active
        warn: '#E8A838',  // due soon, elevated readings
        risk: '#D95B5B',  // missed, critical, danger
        info: '#5B8FD9',  // informational only
      },
      maxWidth: {
        app: '440px',
      },
      fontSize: {
        // Strict type scale — use ONLY these
        'xs':   ['0.6875rem', { lineHeight: '1rem' }],     // 11px — timestamps, microlabels
        'sm':   ['0.8125rem', { lineHeight: '1.25rem' }],  // 13px — body small, captions
        'base': ['0.9375rem', { lineHeight: '1.5rem' }],   // 15px — body default
        'lg':   ['1.0625rem', { lineHeight: '1.5rem' }],   // 17px — card titles
        'xl':   ['1.25rem',   { lineHeight: '1.75rem' }],  // 20px — section headers
        '2xl':  ['1.5rem',    { lineHeight: '2rem' }],     // 24px — page titles
        '3xl':  ['2rem',      { lineHeight: '2.25rem' }],  // 32px — hero, vitals
        '4xl':  ['2.75rem',   { lineHeight: '1' }],        // 44px — landing hero
      },
    },
  },
  plugins: [],
}

