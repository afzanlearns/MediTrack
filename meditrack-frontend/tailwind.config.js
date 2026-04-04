/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        bg: {
          base:     '#0A0E13',
          surface:  '#111720',
          elevated: '#18222E',
          border:   '#1E2D3D',
        },
        accent: {
          DEFAULT: '#00D4AA',
          dim:     '#00A880',
          muted:   '#00D4AA1A',
          glow:    '#00D4AA33',
        },
        status: {
          taken:  '#00D4AA',
          due:    '#F59E0B',
          missed: '#EF4444',
          info:   '#3B82F6',
        },
        text: {
          primary:   '#E8EDF2',
          secondary: '#7A8FA6',
          muted:     '#3D5166',
          inverse:   '#0A0E13',
        },
      },
      maxWidth: {
        app: '480px',
      },
      borderColor: {
        DEFAULT: '#1E2D3D',
      },
    },
  },
  plugins: [],
}
