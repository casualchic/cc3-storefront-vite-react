import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleZoomOpen = () => {
    setIsZoomOpen(true);
  };

  const handleZoomClose = () => {
    setIsZoomOpen(false);
  };

  // If no images provided, use a single placeholder
  const displayImages = images.length > 0 ? images : [''];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group">
        <img
          src={displayImages[selectedImageIndex]}
          alt={`${productName} - Image ${selectedImageIndex + 1}`}
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

        {/* Navigation Arrows (only show if multiple images) */}
        {displayImages.length > 1 && (
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

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
            {selectedImageIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails (only show if multiple images) */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImageIndex === index
                  ? 'border-gray-900 dark:border-white ring-2 ring-gray-900 dark:ring-white'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-500'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
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
          {displayImages.length > 1 && (
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

          {/* Zoomed Image */}
          <div
            className="max-w-7xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={displayImages[selectedImageIndex]}
              alt={`${productName} - Zoomed Image ${selectedImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Image Counter in Zoom */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm rounded-full shadow-lg">
              {selectedImageIndex + 1} / {displayImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
