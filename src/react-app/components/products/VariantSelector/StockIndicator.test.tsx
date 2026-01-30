import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StockIndicator } from './StockIndicator';

describe('StockIndicator', () => {
  test('renders in-stock status with green color', () => {
    render(
      <StockIndicator
        status="in-stock"
        message="In Stock"
      />
    );

    expect(screen.getByText('In Stock')).toBeInTheDocument();
    expect(screen.getByText('In Stock').closest('div')).toHaveClass(
      'stock-indicator',
      'stock-in-stock'
    );
  });

  test('renders low-stock status with amber color and quantity', () => {
    render(
      <StockIndicator
        status="low-stock"
        message="Only 3 left in stock"
      />
    );

    expect(screen.getByText('Only 3 left in stock')).toBeInTheDocument();
    expect(screen.getByText('Only 3 left in stock').closest('div')).toHaveClass(
      'stock-low-stock'
    );
  });

  test('renders out-of-stock status with red color', () => {
    render(
      <StockIndicator
        status="out-of-stock"
        message="Out of Stock"
      />
    );

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByText('Out of Stock').closest('div')).toHaveClass(
      'stock-out-of-stock'
    );
  });

  test('renders with correct ARIA attributes', () => {
    render(
      <StockIndicator
        status="low-stock"
        message="Only 2 left"
      />
    );

    const indicator = screen.getByText('Only 2 left').closest('div');
    expect(indicator).toHaveAttribute('role', 'status');
    expect(indicator).toHaveAttribute('aria-live', 'polite');
  });
});
