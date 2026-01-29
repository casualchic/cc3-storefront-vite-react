import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { VideoSchema } from '../VideoSchema';

describe('VideoSchema', () => {
  const sampleSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'Product Demo',
    description: 'A demo of our product',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    uploadDate: '2025-01-01',
    contentUrl: 'https://example.com/video.mp4',
  };

  it('renders a script tag with application/ld+json type containing the schema', () => {
    render(<VideoSchema schema={sampleSchema} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    expect(script!.textContent).toBe(JSON.stringify(sampleSchema));
  });

  it('renders null when schema is undefined', () => {
    const { container } = render(<VideoSchema schema={undefined} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeInTheDocument();
  });

  it('correctly serializes nested schema properties', () => {
    const nestedSchema = {
      ...sampleSchema,
      author: {
        '@type': 'Person',
        name: 'John Doe',
      },
    };

    render(<VideoSchema schema={nestedSchema} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    const parsed = JSON.parse(script!.textContent!);
    expect(parsed.author).toEqual({ '@type': 'Person', name: 'John Doe' });
  });
});
