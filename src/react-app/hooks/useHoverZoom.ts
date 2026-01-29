import { useState, useEffect, RefObject } from 'react';

export interface UseHoverZoomResult {
  isZooming: boolean;
  zoomStyle: {
    transform?: string;
    transformOrigin?: string;
  };
}

/**
 * Custom hook for desktop hover zoom functionality
 * Provides magnifier lens effect that follows mouse cursor
 */
export function useHoverZoom(
  imageRef: RefObject<HTMLImageElement>,
  isEnabled: boolean,
  scale: number = 2
): UseHoverZoomResult {
  const [isZooming, setIsZooming] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<{
    transform?: string;
    transformOrigin?: string;
  }>({});

  useEffect(() => {
    const image = imageRef.current;
    if (!isEnabled || !image) return;

    // Check if device supports hover (desktop only)
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    if (!supportsHover) return;

    let animationFrameId: number;

    const handleMouseEnter = () => {
      setIsZooming(true);
    };

    const handleMouseLeave = () => {
      setIsZooming(false);
      setZoomStyle({});
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        const rect = image.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setZoomStyle({
          transform: `scale(${scale})`,
          transformOrigin: `${x}% ${y}%`,
        });
      });
    };

    image.addEventListener('mouseenter', handleMouseEnter);
    image.addEventListener('mouseleave', handleMouseLeave);
    image.addEventListener('mousemove', handleMouseMove);

    return () => {
      image.removeEventListener('mouseenter', handleMouseEnter);
      image.removeEventListener('mouseleave', handleMouseLeave);
      image.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [imageRef, isEnabled, scale]);

  return { isZooming, zoomStyle };
}
