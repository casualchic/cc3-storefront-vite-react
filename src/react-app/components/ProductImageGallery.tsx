import { useState, useRef, useMemo, useEffect } from 'react';
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
  const hasMedia = 'media' in props;
  const media = useMemo<MediaItem[]>(() => {
    if (hasMedia) {
      return props.media;
    }
    // Legacy images prop - convert to MediaItem[]
    return props.images.map((url) => ({
      type: 'image' as const,
      url,
      alt: props.productName,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMedia, props.productName, hasMedia ? props.media : props.images]);

  // Extract props with defaults
  const { productName, enableHoverZoom = false, enableSwipe = false, zoomScale = 2 } = props;

  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Refs for hover zoom and swipe gestures
  const mainImageRef = useRef<HTMLImageElement>(null);
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
    setSelectedMediaIndex((prev) => (prev === 0 ? displayMedia.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedMediaIndex((prev) => (prev === displayMedia.length - 1 ? 0 : prev + 1));
  };

  // Clamp selectedMediaIndex when media changes
  useEffect(() => {
    setSelectedMediaIndex((prev) => Math.min(prev, displayMedia.length - 1));
  }, [displayMedia.length]);

  const handleSwipeLeft = () => {
    handleNext();
  };

  const handleSwipeRight = () => {
    handlePrevious();
  };

  const { isSwiping, swipeOffset } = useSwipeGestures(
    containerRef,
    handleSwipeLeft,
    handleSwipeRight,
    enableSwipe
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
    <div className="space-y-4">
      {/* Video Schema for SEO */}
      {currentMedia.type === 'video' && currentMedia.schema && (
        <VideoSchema schema={currentMedia.schema} />
      )}

      {/* Main Media */}
      <div
        ref={containerRef}
        className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group touch-pan-y"
        style={{
          transform: isSwiping ? `translateX(${swipeOffset}px)` : undefined,
          transition: isSwiping ? 'none' : 'transform 300ms ease-out',
        }}
      >
        {currentMedia.type === 'image' ? (
          <div className="relative w-full h-full">
            <OptimizedImage
              ref={mainImageRef}
              src={currentMedia.url}
              alt={currentMedia.alt || `${productName} - Image ${selectedMediaIndex + 1}`}
              sizes="(min-width: 1024px) 600px, 100vw"
              loading="eager"
              className={`w-full h-full object-cover transition-transform duration-150 ${
                isZooming ? 'cursor-zoom-in' : ''
              }`}
              style={isZooming ? zoomStyle : undefined}
            />

            {/* Hover zoom hint */}
            {isZooming && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full animate-fade-in">
                Click to open fullscreen
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={currentMedia.thumbnailUrl || currentMedia.poster || currentMedia.url}
              alt={currentMedia.alt || `${productName} - Video ${selectedMediaIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Play icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handleZoomOpen}
                className="p-4 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-all hover:scale-110"
                aria-label="Play video"
              >
                <Play className="w-8 h-8 text-gray-900 dark:text-white" fill="currentColor" />
              </button>
            </div>

            {/* Duration badge */}
            {currentMedia.duration && (
              <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/70 text-white text-sm rounded">
                {formatDurationDisplay(currentMedia.duration)}
              </div>
            )}
          </div>
        )}

        {/* Zoom Button (images only) */}
        {currentMedia.type === 'image' && (
          <button
            onClick={handleZoomOpen}
            className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Zoom image"
          >
            <ZoomIn className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
        )}

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
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Video indicator */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="w-4 h-4 text-white" fill="white" />
                </div>
              )}

              {/* Duration badge for videos */}
              {item.type === 'video' && item.duration && (
                <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/70 text-white text-xs rounded">
                  {formatDurationDisplay(item.duration)}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Enhanced Lightbox with Pan/Zoom */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={handleZoomClose}
        >
          <button
            onClick={handleZoomClose}
            className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 z-10"
            aria-label="Close zoom"
          >
            <X className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>

          {currentMedia.type === 'image' ? (
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={4}
              doubleClick={{ mode: 'toggle', step: 2 }}
              wheel={{ step: 0.1 }}
              panning={{ velocityDisabled: true }}
            >
              {({ zoomIn, zoomOut, resetTransform, state }) => (
                <>
                  {/* Navigation in Zoom Mode (disabled while zoomed) */}
                  {displayMedia.length > 1 && state.scale === 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevious();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 z-10"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
                      </button>
                    </>
                  )}

                  {/* Zoom Controls */}
                  <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        zoomIn();
                      }}
                      className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label="Zoom in"
                    >
                      <ZoomIn className="w-5 h-5 text-gray-900 dark:text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        zoomOut();
                      }}
                      className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      aria-label="Zoom out"
                    >
                      <span className="w-5 h-5 text-gray-900 dark:text-white flex items-center justify-center font-bold">
                        −
                      </span>
                    </button>
                    {state.scale > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resetTransform();
                        }}
                        className="px-3 py-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium text-gray-900 dark:text-white"
                        aria-label="Reset zoom"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Zoomed Image */}
                  <TransformComponent
                    wrapperClass="!w-full !h-full flex items-center justify-center"
                    contentClass="max-w-7xl max-h-[90vh]"
                  >
                    <img
                      src={currentMedia.url}
                      alt={currentMedia.alt || `${productName} - Zoomed Image ${selectedMediaIndex + 1}`}
                      className="w-full h-full object-contain"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TransformComponent>

                  {/* Image Counter in Zoom */}
                  {displayMedia.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm rounded-full shadow-lg z-10">
                      {selectedMediaIndex + 1} / {displayMedia.length}
                    </div>
                  )}
                </>
              )}
            </TransformWrapper>
          ) : (
            // Video player in lightbox
            <>
              {/* Navigation for videos */}
              {displayMedia.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevious();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 z-10"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-gray-900 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 z-10"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
                  </button>
                </>
              )}

              <div
                className="max-w-7xl max-h-[90vh] w-full px-4"
                onClick={(e) => e.stopPropagation()}
              >
                <video
                  src={currentMedia.url}
                  poster={currentMedia.poster}
                  controls={currentMedia.videoConfig?.controls ?? true}
                  autoPlay={currentMedia.videoConfig?.autoplay ?? false}
                  muted={currentMedia.videoConfig?.muted ?? true}
                  loop={currentMedia.videoConfig?.loop ?? false}
                  className="w-full h-full object-contain rounded-lg"
                  preload="metadata"
                />
              </div>

              {/* Video Counter */}
              {displayMedia.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm rounded-full shadow-lg z-10">
                  {selectedMediaIndex + 1} / {displayMedia.length}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
