import { forwardRef } from 'react';
import { generateSrcSet } from '../utils/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
  style?: React.CSSProperties;
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  function OptimizedImage(
    { src, alt, sizes, loading = 'lazy', className, style },
    ref
  ) {
    const webpSrcSet = generateSrcSet(src, 'webp');
    const jpegSrcSet = generateSrcSet(src, 'jpeg');

    return (
      <picture className={className}>
        <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
        <source type="image/jpeg" srcSet={jpegSrcSet} sizes={sizes} />
        <img ref={ref} src={src} alt={alt} sizes={sizes} loading={loading} style={style} />
      </picture>
    );
  }
);
