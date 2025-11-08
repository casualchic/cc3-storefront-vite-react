export const BRANDS = {
  'casual-chic': {
    name: 'Casual Chic Boutique',
    domain: 'casualchicboutique.com',
    description: 'Modern, approachable, earth tones',
    colors: {
      primary: '#A3BD84',
      secondary: '#CC8881',
      accent: '#E5C77C',
      sage: '#A6A998',
      slate: '#99ADBD',
      taupe: '#A3BD84',
      forest: '#676B5D',
      neutral: '#FBF0E5',
      charcoal: '#C4BFB9',
      text: '#1A1A1A',
      background: '#FAFAF8',
    },
    fonts: {
      heading: 'Big Caslon, Georgia, serif',
      body: 'Avenir Book, -apple-system, BlinkMacSystemFont, sans-serif',
      button: 'Avenir Book, -apple-system, BlinkMacSystemFont, sans-serif',
    },
    typography: {
      headingWeight: '500',
      bodyWeight: '400',
    }
  },
} as const;

export type BrandId = keyof typeof BRANDS;

export function getBrandFromDomain(domain: string): BrandId {
  const brand = Object.entries(BRANDS).find(
    ([_, config]) => domain.includes(config.domain)
  );
  return (brand?.[0] as BrandId) || 'casual-chic';
}

export function getThemeCSS(brandId: BrandId): string {
  const brand = BRANDS[brandId];
  return `
    :root {
      --color-primary: ${brand.colors.primary};
      --color-secondary: ${brand.colors.secondary};
      --color-accent: ${brand.colors.accent};
      --color-sage: ${brand.colors.sage};
      --color-slate: ${brand.colors.slate};
      --color-taupe: ${brand.colors.taupe};
      --color-forest: ${brand.colors.forest};
      --color-neutral: ${brand.colors.neutral};
      --color-charcoal: ${brand.colors.charcoal};
      --color-text: ${brand.colors.text};
      --color-background: ${brand.colors.background};

      --font-heading: ${brand.fonts.heading};
      --font-body: ${brand.fonts.body};
      --font-button: ${brand.fonts.button};

      --font-weight-heading: ${brand.typography.headingWeight};
      --font-weight-body: ${brand.typography.bodyWeight};
    }
  `;
}
