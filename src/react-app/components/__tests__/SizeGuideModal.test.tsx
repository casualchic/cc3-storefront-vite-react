import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SizeGuideModal } from '../SizeGuideModal';

describe('SizeGuideModal', () => {
  const mockOnClose = vi.fn();

  it('does not render when isOpen is false', () => {
    render(<SizeGuideModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByText(/Size Guide/)).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(<SizeGuideModal isOpen={true} onClose={mockOnClose} category="tops" />);
    expect(screen.getByText('Tops Size Guide')).toBeInTheDocument();
  });

  it('displays measurement table', () => {
    render(<SizeGuideModal isOpen={true} onClose={mockOnClose} category="tops" />);
    expect(screen.getByText('XS')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getByText('XL')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<SizeGuideModal isOpen={true} onClose={mockOnClose} category="tops" />);
    const closeButton = screen.getByLabelText('Close size guide');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const { container } = render(<SizeGuideModal isOpen={true} onClose={mockOnClose} category="tops" />);
    const backdrop = container.querySelector('.fixed.inset-0') as HTMLElement;
    fireEvent.click(backdrop);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays how to measure instructions', () => {
    render(<SizeGuideModal isOpen={true} onClose={mockOnClose} category="tops" />);
    expect(screen.getByText('How to Measure')).toBeInTheDocument();
    expect(screen.getByText(/Measure around the fullest part of your bust/)).toBeInTheDocument();
  });

  it('displays fit tips', () => {
    render(<SizeGuideModal isOpen={true} onClose={mockOnClose} category="tops" />);
    expect(screen.getByText('Fit Tips')).toBeInTheDocument();
    expect(screen.getByText(/All measurements are in inches/)).toBeInTheDocument();
  });

  it('shows correct title for different categories', () => {
    const { rerender } = render(<SizeGuideModal isOpen={true} onClose={mockOnClose} category="bottoms" />);
    expect(screen.getByText('Bottoms Size Guide')).toBeInTheDocument();

    rerender(<SizeGuideModal isOpen={true} onClose={mockOnClose} category="dresses" />);
    expect(screen.getByText('Dresses Size Guide')).toBeInTheDocument();
  });

  it('shows general guide for unknown category', () => {
    render(<SizeGuideModal isOpen={true} onClose={mockOnClose} category="unknown" />);
    expect(screen.getByText('General Size Guide')).toBeInTheDocument();
  });
});
