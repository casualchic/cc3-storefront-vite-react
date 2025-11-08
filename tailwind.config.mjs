import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        sage: 'var(--color-sage)',
        slate: 'var(--color-slate)',
        taupe: 'var(--color-taupe)',
        forest: 'var(--color-forest)',
        neutral: 'var(--color-neutral)',
        charcoal: 'var(--color-charcoal)',
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
        button: 'var(--font-button)',
      },
      spacing: {
        'thumb-zone': '44px',
      },
    },
  },
  plugins: [
    typography,
  ],
};
