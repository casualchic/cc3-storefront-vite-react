import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductImageGallery } from '../ProductImageGallery';

describe('ProductImageGallery', () => {
  const mockImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ];

  it('renders the first image by default', () => {
    render(<ProductImageGallery images={mockImages} productName="Test Product" />);
    const mainImage = screen.getByAltText('Test Product - Image 1');
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', mockImages[0]);
  });

  it('displays image counter when multiple images are provided', () => {
    render(<ProductImageGallery images={mockImages} productName="Test Product" />);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('does not display counter for single image', () => {
    render(<ProductImageGallery images={[mockImages[0]]} productName="Test Product" />);
    expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
  });

  it('navigates to next image when next button is clicked', () => {
    render(<ProductImageGallery images={mockImages} productName="Test Product" />);
    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);

    const mainImage = screen.getByAltText('Test Product - Image 2');
    expect(mainImage).toHaveAttribute('src', mockImages[1]);
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('navigates to previous image when previous button is clicked', () => {
    render(<ProductImageGallery images={mockImages} productName="Test Product" />);
    const prevButton = screen.getByLabelText('Previous image');
    fireEvent.click(prevButton);

    // Should wrap to last image
    const mainImage = screen.getByAltText('Test Product - Image 3');
    expect(mainImage).toHaveAttribute('src', mockImages[2]);
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
  });

  it('selects image when thumbnail is clicked', () => {
    render(<ProductImageGallery images={mockImages} productName="Test Product" />);
    const thumbnail = screen.getByLabelText('View image 3');
    fireEvent.click(thumbnail);

    const mainImage = screen.getByAltText('Test Product - Image 3');
    expect(mainImage).toHaveAttribute('src', mockImages[2]);
  });

  it('opens zoom modal when zoom button is clicked', () => {
    render(<ProductImageGallery images={mockImages} productName="Test Product" />);
    const zoomButton = screen.getByLabelText('Zoom image');
    fireEvent.click(zoomButton);

    expect(screen.getByAltText('Test Product - Zoomed Image 1')).toBeInTheDocument();
  });

  it('closes zoom modal when close button is clicked', () => {
    render(<ProductImageGallery images={mockImages} productName="Test Product" />);
    const zoomButton = screen.getByLabelText('Zoom image');
    fireEvent.click(zoomButton);

    const closeButton = screen.getByLabelText('Close zoom');
    fireEvent.click(closeButton);

    expect(screen.queryByAltText('Test Product - Zoomed Image 1')).not.toBeInTheDocument();
  });

  it('renders thumbnails for all images', () => {
    render(<ProductImageGallery images={mockImages} productName="Test Product" />);
    mockImages.forEach((_, index) => {
      expect(screen.getByAltText(`Test Product thumbnail ${index + 1}`)).toBeInTheDocument();
    });
  });

  it('handles empty images array gracefully', () => {
    render(<ProductImageGallery images={[]} productName="Test Product" />);
    // Should still render without crashing
    expect(screen.getByAltText('Test Product - Image 1')).toBeInTheDocument();
  });
});
