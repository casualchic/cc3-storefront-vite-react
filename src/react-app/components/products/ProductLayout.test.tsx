import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '../../context/CartContext';
import { WishlistProvider } from '../../context/WishlistContext';
import { ProductLayout } from './ProductLayout';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <WishlistProvider>
    <CartProvider>{children}</CartProvider>
  </WishlistProvider>
);

describe('ProductLayout', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
    // Reset URL
    window.history.replaceState({}, '', '/');
  });

  it('renders product grid', () => {
    render(
      <Wrapper>
        <ProductLayout />
      </Wrapper>
    );

    expect(screen.getByText(/Showing \d+ of \d+ products/)).toBeInTheDocument();
  });

  it('displays products', () => {
    render(
      <Wrapper>
        <ProductLayout />
      </Wrapper>
    );

    // Should display at least one product card
    const productNames = screen.getAllByText(/Blouse|Shirt|Dress|Pants/i);
    expect(productNames.length).toBeGreaterThan(0);
  });

  it('filters by category', () => {
    render(
      <Wrapper>
        <ProductLayout category="women" />
      </Wrapper>
    );

    // Results should be filtered
    const resultsCount = screen.getByText(/Showing \d+ of \d+ products/);
    expect(resultsCount).toBeInTheDocument();
  });

  it('toggles view mode', () => {
    render(
      <Wrapper>
        <ProductLayout />
      </Wrapper>
    );

    const listViewButton = screen.getByLabelText('List view');
    fireEvent.click(listViewButton);

    // View mode should be stored in localStorage
    expect(localStorage.getItem('cc3-view-mode')).toBe('list');
  });

  it('shows filter toggle on mobile', () => {
    render(
      <Wrapper>
        <ProductLayout />
      </Wrapper>
    );

    const filterToggle = screen.getByLabelText('Open filters');
    expect(filterToggle).toBeInTheDocument();
  });

  it('displays results count', () => {
    render(
      <Wrapper>
        <ProductLayout />
      </Wrapper>
    );

    const resultsCount = screen.getByText(/Showing \d+ of 20 products/);
    expect(resultsCount).toBeInTheDocument();
  });
});