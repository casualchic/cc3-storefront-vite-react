import { useState, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X, Play } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { MediaItem, ProductImageGalleryAllProps } from '../types/media';
import { useHoverZoom } from '../hooks/useHoverZoom';
import { useSwipeGestures } from '../hooks/useSwipeGestures';
import { OptimizedImage } from './OptimizedImage';
import { VideoSchema } from './VideoSchema';
import { formatDurationDisplay } from '../utils/imageOptimization';

export function ProductImageGallery(props: ProductImageGalleryAllProps) {
  // Convert legacy images to MediaItem[] if needed
  const media = useMemo<MediaItem[]>(() => {
    if ('media' in props) {
      return props.media;
    }
    // Legacy images prop - convert to MediaItem[]
    return props.images.map((url) => ({
      type: 'image' as const,
      url,
      alt: props.productName,
    }));
  }, ['media' in props ? props.media : props.images, props.productName]);

  // Extract props with defaults
  const { productName, enableHoverZoom = false, enableSwipe = false, zoomScale = 2 } = props;

  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Refs for hover zoom and swipe gestures
  const mainImageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // If no media provided, use a single placeholder image
  const displayMedia = media.length > 0 ? media : [{ type: 'image' as const, url: '', alt: productName }];

  // Current media item
  const currentMedia = displayMedia[selectedMediaIndex];

  // Hooks
  const { isZooming, zoomStyle } = useHoverZoom(
    mainImageRef,
    enableHoverZoom && currentMedia.type === 'image',
    zoomScale
  );

  const handlePrevious = () => {
    setSelectedMediaIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedMediaIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const handleSwipeLeft = () => {
    handleNext();
  };

  const handleSwipeRight = () => {
    handlePrevious();
  };

  const { isSwiping, swipeOffset } = useSwipeGestures(
    containerRef,
    enableSwipe ? handleSwipeLeft : () => {},
    enableSwipe ? handleSwipeRight : () => {}
  );

  const handleThumbnailClick = (index: number) => {
    setSelectedMediaIndex(index);
  };

  const handleZoomOpen = () => {
    setIsZoomOpen(true);
  };

  const handleZoomClose = () => {
    setIsZoomOpen(false);
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      {/* Main Image */}
      <div className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group" ref={mainImageRef}>
        <img
          src={displayMedia[selectedMediaIndex].url}
          alt={displayMedia[selectedMediaIndex].alt || `${productName} - Image ${selectedMediaIndex + 1}`}
          className="w-full h-full object-cover"
          loading="eager"
        />

        {/* Zoom Button */}
        <button
          onClick={handleZoomOpen}
          className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Zoom image"
        >
          <ZoomIn className="w-5 h-5 text-gray-900 dark:text-white" />
        </button>

        {/* Navigation Arrows (only show if multiple media items) */}
        {displayMedia.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-900 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-900 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-900 dark:text-white" />
            </button>
          </>
        )}

        {/* Media Counter */}
        {displayMedia.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
            {selectedMediaIndex + 1} / {displayMedia.length}
          </div>
        )}
      </div>

      {/* Thumbnails (only show if multiple media items) */}
      {displayMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayMedia.map((item, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                selectedMediaIndex === index
                  ? 'border-gray-900 dark:border-white ring-2 ring-gray-900 dark:ring-white'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-500'
              }`}
              aria-label={`View ${item.type} ${index + 1}`}
            >
              <img
                src={item.thumbnailUrl || item.url}
                alt={item.alt || `${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={handleZoomClose}
        >
          <button
            onClick={handleZoomClose}
            className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close zoom"
          >
            <X className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>

          {/* Navigation in Zoom Mode */}
          {displayMedia.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
              </button>
            </>
          )}

          {/* Zoomed Media */}
          <div
            className="max-w-7xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={displayMedia[selectedMediaIndex].url}
              alt={displayMedia[selectedMediaIndex].alt || `${productName} - Zoomed Image ${selectedMediaIndex + 1}`}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Media Counter in Zoom */}
          {displayMedia.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm rounded-full shadow-lg">
              {selectedMediaIndex + 1} / {displayMedia.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
