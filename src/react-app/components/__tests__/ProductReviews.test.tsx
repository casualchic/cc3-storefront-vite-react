import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductReviews } from '../ProductReviews';

describe('ProductReviews', () => {
  const defaultProps = {
    productId: 'test-product',
    averageRating: 4.5,
    totalReviews: 124,
  };

  it('displays average rating and review count', () => {
    render(<ProductReviews {...defaultProps} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('Based on 124 reviews')).toBeInTheDocument();
  });

  it('renders write review button', () => {
    render(<ProductReviews {...defaultProps} />);
    expect(screen.getByText('Write a Review')).toBeInTheDocument();
  });

  it('shows review form when write review button is clicked', () => {
    render(<ProductReviews {...defaultProps} />);
    const writeButton = screen.getByText('Write a Review');
    fireEvent.click(writeButton);

    expect(screen.getByText('Share Your Experience')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Give your review a title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tell us what you think about this product')).toBeInTheDocument();
  });

  it('hides review form when cancel is clicked', () => {
    render(<ProductReviews {...defaultProps} />);
    const writeButton = screen.getByText('Write a Review');
    fireEvent.click(writeButton);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Share Your Experience')).not.toBeInTheDocument();
  });

  it('displays sort options', () => {
    render(<ProductReviews {...defaultProps} />);
    const sortSelect = screen.getByText('Most Recent').closest('select');
    expect(sortSelect).toBeInTheDocument();
  });

  it('changes sort order when option is selected', () => {
    render(<ProductReviews {...defaultProps} />);
    const sortSelect = screen.getByText('Most Recent').closest('select') as HTMLSelectElement;

    fireEvent.change(sortSelect, { target: { value: 'helpful' } });
    expect(sortSelect.value).toBe('helpful');
  });

  it('displays review content', () => {
    render(<ProductReviews {...defaultProps} />);
    // Mock reviews should be displayed
    expect(screen.getByText(/Absolutely love it!/)).toBeInTheDocument();
  });

  it('shows limited reviews initially', () => {
    render(<ProductReviews {...defaultProps} />);
    // Should show "Show All" button if there are more than 3 reviews
    const showAllButton = screen.queryByText(/Show All/);
    expect(showAllButton).toBeInTheDocument();
  });

  it('expands to show all reviews when button is clicked', () => {
    render(<ProductReviews {...defaultProps} />);
    const showAllButton = screen.getByText(/Show All/);
    fireEvent.click(showAllButton);

    expect(screen.getByText(/Show Less Reviews/)).toBeInTheDocument();
  });

  it('displays verified purchase badge for verified reviews', () => {
    render(<ProductReviews {...defaultProps} />);
    expect(screen.getAllByText('Verified Purchase').length).toBeGreaterThan(0);
  });

  it('displays helpful count for reviews', () => {
    render(<ProductReviews {...defaultProps} />);
    const helpfulButtons = screen.getAllByText(/Helpful/);
    expect(helpfulButtons.length).toBeGreaterThan(0);
  });

  it('renders star ratings for reviews', () => {
    render(<ProductReviews {...defaultProps} />);
    // Stars should be rendered in the rating summary and individual reviews
    const ratingElements = screen.getAllByText('4.5');
    expect(ratingElements.length).toBeGreaterThan(0);
  });
});
