// src/react-app/components/ProductRecommendations.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductRecommendations } from './ProductRecommendations';
import { Product } from '../types';
import { CartProvider } from '../context/CartContext';

// Mock the @tanstack/react-router Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
    <a href={typeof to === 'string' ? to : '/'} className={className}>
      {children}
    </a>
  ),
}));

const mockProducts: Product[] = [
  {
    id: 'rec-1',
    name: 'Recommended Product 1',
    price: 29.99,
    image: '/rec1.jpg',
    category: 'women',
    inStock: true,
  },
  {
    id: 'rec-2',
    name: 'Recommended Product 2',
    price: 39.99,
    image: '/rec2.jpg',
    category: 'women',
    inStock: true,
  },
];

function renderWithProvider(products: Product[]) {
  return render(
    <CartProvider>
      <ProductRecommendations products={products} />
    </CartProvider>
  );
}

describe('ProductRecommendations', () => {
  it('renders recommendations title', () => {
    renderWithProvider(mockProducts);

    expect(screen.getByText('You might also like')).toBeInTheDocument();
  });

  it('displays all recommended products', () => {
    renderWithProvider(mockProducts);

    expect(screen.getByText('Recommended Product 1')).toBeInTheDocument();
    expect(screen.getByText('Recommended Product 2')).toBeInTheDocument();
  });

  it('does not render when products array is empty', () => {
    const { container } = renderWithProvider([]);

    expect(container.firstChild).toBeNull();
  });
});
