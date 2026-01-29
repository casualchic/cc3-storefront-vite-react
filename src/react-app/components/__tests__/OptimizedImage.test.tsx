import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OptimizedImage } from '../OptimizedImage';

describe('OptimizedImage', () => {
  const defaultProps = {
    src: '/images/product.jpg',
    alt: 'A product image',
  };

  it('renders a <picture> element with WebP and JPEG sources', () => {
    render(<OptimizedImage {...defaultProps} />);

    const picture = document.querySelector('picture');
    expect(picture).toBeInTheDocument();

    const sources = picture!.querySelectorAll('source');
    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute('type', 'image/webp');
    expect(sources[1]).toHaveAttribute('type', 'image/jpeg');
  });

  it('generates correct srcSet for each source', () => {
    render(<OptimizedImage {...defaultProps} />);

    const sources = document.querySelectorAll('source');
    const webpSrcSet = sources[0].getAttribute('srcset')!;
    const jpegSrcSet = sources[1].getAttribute('srcset')!;

    // WebP source should contain format=webp params
    expect(webpSrcSet).toContain('fm=webp');
    expect(webpSrcSet).toContain('320w');
    expect(webpSrcSet).toContain('1920w');

    // JPEG source should contain format=jpeg params
    expect(jpegSrcSet).toContain('fm=jpeg');
    expect(jpegSrcSet).toContain('320w');
    expect(jpegSrcSet).toContain('1920w');
  });

  it('renders a fallback <img> with correct src and alt', () => {
    render(<OptimizedImage {...defaultProps} />);

    const img = screen.getByRole('img', { name: 'A product image' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/product.jpg');
    expect(img).toHaveAttribute('alt', 'A product image');
  });

  it('applies sizes attribute to sources and img', () => {
    const sizes = '(min-width: 1024px) 600px, 100vw';
    render(<OptimizedImage {...defaultProps} sizes={sizes} />);

    const sources = document.querySelectorAll('source');
    expect(sources[0]).toHaveAttribute('sizes', sizes);
    expect(sources[1]).toHaveAttribute('sizes', sizes);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('sizes', sizes);
  });

  it('supports loading="lazy" and loading="eager"', () => {
    const { rerender } = render(<OptimizedImage {...defaultProps} loading="lazy" />);
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');

    rerender(<OptimizedImage {...defaultProps} loading="eager" />);
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'eager');
  });

  it('passes className to the picture element', () => {
    render(<OptimizedImage {...defaultProps} className="custom-class" />);

    const picture = document.querySelector('picture');
    expect(picture).toHaveClass('custom-class');
  });
});
