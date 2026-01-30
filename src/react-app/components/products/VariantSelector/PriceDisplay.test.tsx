import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriceDisplay } from './PriceDisplay';

describe('PriceDisplay', () => {
  test('renders current price only when no original price', () => {
    render(<PriceDisplay price={29.99} />);

    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.queryByText(/original/i)).not.toBeInTheDocument();
  });

  test('renders sale price with strikethrough original price', () => {
    render(<PriceDisplay price={19.99} originalPrice={29.99} />);

    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toHaveClass('price-original');
  });

  test('renders "Select options" when no price provided', () => {
    render(<PriceDisplay />);

    expect(screen.getByText('Select options')).toBeInTheDocument();
  });

  test('has correct ARIA label', () => {
    render(<PriceDisplay price={29.99} />);

    const priceElement = screen.getByText('$29.99').closest('div');
    expect(priceElement).toHaveAttribute('aria-label', 'Price: $29.99');
  });

  test('has sale price ARIA label when on sale', () => {
    render(<PriceDisplay price={19.99} originalPrice={29.99} />);

    const priceElement = screen.getByText('$19.99').closest('div');
    expect(priceElement).toHaveAttribute(
      'aria-label',
      'Sale price: $19.99, original price: $29.99'
    );
  });
});
