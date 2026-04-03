/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        sidebar: '#F3F7F4',
        'sidebar-hover': '#ECF3ED',
        'sidebar-active': '#E2F0E3',
        'sidebar-text': '#4B5563',
        'sidebar-text-active': '#1F2937',
        'page-bg': '#F8FAF9',
        'card': {
          DEFAULT: '#FFFFFF',
          foreground: 'hsl(var(--card-foreground))',
        },
        'border': {
          DEFAULT: '#E5E7EB',
        },
        'background': 'hsl(var(--background))',
        'foreground': 'hsl(var(--foreground))',
        'primary': {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        'secondary': {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        'muted': {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        'popover': {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        'destructive': {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        'ring': 'hsl(var(--ring))',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        'accent': '#7FBF7F',
        'accent-light': '#EAF5EA',
        'accent-hover': '#6AAE6A',
        'success': '#2F9E44',
        'success-light': '#EDF8EF',
        'warning': '#C07A2C',
        'warning-light': '#FDF5EA',
        'danger': '#D94A4A',
        'danger-light': '#FCEEEE',
        'navy': '#1F2937',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}
