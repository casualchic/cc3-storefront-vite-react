import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductImageGallery } from '../ProductImageGallery';
import type { MediaItem } from '../../types/media';

// Mock react-zoom-pan-pinch to avoid hook errors in tests
vi.mock('react-zoom-pan-pinch', () => ({
  TransformWrapper: ({ children }: { children: (utils: any) => React.ReactNode }) =>
    children({
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
      resetTransform: vi.fn(),
      state: { scale: 1 },
    }),
  TransformComponent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('ProductImageGallery', () => {
  const mockImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ];

  const mockMedia: MediaItem[] = [
    { type: 'image', url: 'https://example.com/image1.jpg' },
    { type: 'image', url: 'https://example.com/image2.jpg' },
    { type: 'video', url: 'https://example.com/video1.mp4', thumbnailUrl: 'https://example.com/thumb1.jpg', duration: 90 },
  ];

  describe('Legacy images prop support', () => {
    it('renders with legacy images prop', () => {
      render(<ProductImageGallery images={mockImages} productName="Test Product" />);
      // Legacy conversion sets alt to productName directly
      expect(screen.getByAltText('Test Product')).toBeInTheDocument();
    });

    it('converts images array to media items', () => {
      render(<ProductImageGallery images={mockImages} productName="Test Product" />);
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });
  });

  describe('Media prop support', () => {
    it('renders with media prop', () => {
      render(<ProductImageGallery media={mockMedia} productName="Test Product" />);
      expect(screen.getByAltText(/Test Product - Image 1/)).toBeInTheDocument();
    });

    it('displays image counter for mixed media', () => {
      render(<ProductImageGallery media={mockMedia} productName="Test Product" />);
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('navigates to next media when next button is clicked', () => {
      render(<ProductImageGallery media={mockMedia} productName="Test Product" />);
      const nextButton = screen.getByLabelText('Next image');
      fireEvent.click(nextButton);

      expect(screen.getByAltText(/Test Product - Image 2/)).toBeInTheDocument();
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('navigates to previous media when previous button is clicked', () => {
      render(<ProductImageGallery media={mockMedia} productName="Test Product" />);
      const prevButton = screen.getByLabelText('Previous image');
      fireEvent.click(prevButton);

      // Should wrap to last media (video)
      expect(screen.getByText('3 / 3')).toBeInTheDocument();
    });

    it('selects media when thumbnail is clicked', () => {
      render(<ProductImageGallery media={mockMedia} productName="Test Product" />);
      const thumbnail = screen.getByLabelText('View image 2');
      fireEvent.click(thumbnail);

      expect(screen.getByAltText(/Test Product - Image 2/)).toBeInTheDocument();
    });
  });

  describe('Video support', () => {
    it('displays play icon on video thumbnails', () => {
      render(<ProductImageGallery media={mockMedia} productName="Test Product" />);
      const videoThumbnail = screen.getByLabelText('View video 3');

      expect(videoThumbnail).toBeInTheDocument();
    });

    it('displays video duration badge', () => {
      render(<ProductImageGallery media={mockMedia} productName="Test Product" />);

      // Navigate to video
      const nextButton = screen.getByLabelText('Next image');
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      // Duration shows on both main display and thumbnail; verify at least one exists
      const badges = screen.getAllByText('1:30');
      expect(badges.length).toBeGreaterThanOrEqual(1);
    });

    it('shows play button overlay on video', () => {
      render(<ProductImageGallery media={mockMedia} productName="Test Product" />);

      // Navigate to video
      const nextButton = screen.getByLabelText('Next image');
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      expect(screen.getByLabelText('Play video')).toBeInTheDocument();
    });
  });

  describe('Zoom functionality', () => {
    it('opens zoom modal when zoom button is clicked on image', () => {
      render(<ProductImageGallery media={mockMedia} productName="Test Product" />);
      const zoomButton = screen.getByLabelText('Zoom image');
      fireEvent.click(zoomButton);

      expect(screen.getByLabelText('Close zoom')).toBeInTheDocument();
    });

    it('opens zoom modal when play button clicked on video', () => {
      render(<ProductImageGallery media={mockMedia} productName="Test Product" />);

      // Navigate to video
      const nextButton = screen.getByLabelText('Next image');
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      const playButton = screen.getByLabelText('Play video');
      fireEvent.click(playButton);

      expect(screen.getByLabelText('Close zoom')).toBeInTheDocument();
    });

    it('closes zoom modal when close button is clicked', () => {
      render(<ProductImageGallery media={mockMedia} productName="Test Product" />);
      const zoomButton = screen.getByLabelText('Zoom image');
      fireEvent.click(zoomButton);

      const closeButton = screen.getByLabelText('Close zoom');
      fireEvent.click(closeButton);

      expect(screen.queryByLabelText('Close zoom')).not.toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('handles empty media array gracefully', () => {
      render(<ProductImageGallery media={[]} productName="Test Product" />);
      // Empty array creates placeholder with alt = productName
      expect(screen.getByAltText('Test Product')).toBeInTheDocument();
    });

    it('does not show counter for single media item', () => {
      render(<ProductImageGallery media={[mockMedia[0]]} productName="Test Product" />);
      expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders thumbnails for all media', () => {
      render(<ProductImageGallery media={mockMedia} productName="Test Product" />);
      expect(screen.getByAltText('Test Product thumbnail 1')).toBeInTheDocument();
      expect(screen.getByAltText('Test Product thumbnail 2')).toBeInTheDocument();
      expect(screen.getByAltText('Test Product thumbnail 3')).toBeInTheDocument();
    });

    it('has proper ARIA labels', () => {
      render(<ProductImageGallery media={mockMedia} productName="Test Product" />);
      expect(screen.getByLabelText('Zoom image')).toBeInTheDocument();
      expect(screen.getByLabelText('Next image')).toBeInTheDocument();
      expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
    });
  });
});
