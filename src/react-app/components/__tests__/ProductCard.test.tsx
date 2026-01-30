import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import { CartProvider } from '../../context/CartContext';
import { WishlistProvider } from '../../context/WishlistContext';
import { Product } from '../../types';

// Mock the @tanstack/react-router Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, params, children, className, onMouseEnter, onMouseLeave }: {
    to: string;
    params?: { id?: string };
    children: React.ReactNode;
    className?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }) => (
    <a
      href={typeof to === 'string' ? to.replace('$id', params?.id || '') : '/'}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  ),
}));

// Mock product data
const mockProduct: Product = {
  id: 'test-1',
  name: 'Test Product',
  price: 99.99,
  originalPrice: 149.99,
  image: '/test-image.jpg',
  images: ['/test-image-2.jpg'],
  category: 'dresses',
  sizes: ['S', 'M', 'L'],
  colors: ['Red', 'Blue'],
  colorSwatches: [
    { name: 'Red', hex: '#FF0000' },
    { name: 'Blue', hex: '#0000FF' },
  ],
  inStock: true,
  stockStatus: 'in-stock',
  rating: 4.5,
  reviews: 120,
};

const mockProductOutOfStock: Product = {
  ...mockProduct,
  id: 'test-2',
  inStock: false,
  stockStatus: 'out-of-stock',
};

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <CartProvider>
      <WishlistProvider>
        {ui}
      </WishlistProvider>
    </CartProvider>
  );
}

describe('ProductCard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Basic Rendering', () => {
    it('renders product name', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('renders product price', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    it('renders sale price with discount', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      expect(screen.getByText('$149.99')).toBeInTheDocument();
      expect(screen.getByText('33% OFF')).toBeInTheDocument();
    });

    it('renders rating', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText('(120)')).toBeInTheDocument();
    });

    it('renders custom badge', () => {
      renderWithProviders(
        <ProductCard
          product={mockProduct}
          badge={{ text: 'NEW', color: 'bg-blue-500' }}
        />
      );
      expect(screen.getByText('NEW')).toBeInTheDocument();
    });
  });

  describe('Stock Status', () => {
    it('shows "Out of Stock" badge for out of stock products', () => {
      renderWithProviders(<ProductCard product={mockProductOutOfStock} />);
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });

    it('hides quick add button for out of stock products', () => {
      renderWithProviders(<ProductCard product={mockProductOutOfStock} />);
      const quickAddButton = screen.queryByRole('button', { name: /quick add/i });
      expect(quickAddButton).not.toBeInTheDocument();
    });

    it('shows quick add button for in-stock products on hover', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      const quickAddButton = screen.getByRole('button', { name: /quick add/i });
      expect(quickAddButton).toBeInTheDocument();
    });
  });

  describe('Color Swatches', () => {
    it('renders color swatches when available', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      const swatches = screen.getAllByTitle(/Red|Blue/);
      expect(swatches).toHaveLength(2);
    });

    it('shows color count when swatches not available', () => {
      const productNoSwatches = { ...mockProduct, colorSwatches: undefined };
      renderWithProviders(<ProductCard product={productNoSwatches} />);
      expect(screen.getByText('2 colors')).toBeInTheDocument();
    });

    it('limits swatches to 5 and shows remainder', () => {
      const manyColors = Array.from({ length: 8 }, (_, i) => ({
        name: `Color ${i}`,
        hex: `#00000${i}`,
      }));
      const productManyColors = { ...mockProduct, colorSwatches: manyColors };
      renderWithProviders(<ProductCard product={productManyColors} />);
      expect(screen.getByText('+3')).toBeInTheDocument();
    });
  });

  describe('Quick Add to Cart', () => {
    it('calls onAddToCart callback when provided', async () => {
      const onAddToCart = vi.fn();
      renderWithProviders(
        <ProductCard product={mockProduct} onAddToCart={onAddToCart} />
      );

      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      const quickAddButton = screen.getByRole('button', { name: /quick add/i });
      fireEvent.click(quickAddButton);

      await waitFor(() => {
        expect(onAddToCart).toHaveBeenCalledWith(mockProduct.id);
      });
    });

    it('adds product to cart when no callback provided', async () => {
      renderWithProviders(<ProductCard product={mockProduct} />);

      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      const quickAddButton = screen.getByRole('button', { name: /quick add/i });
      fireEvent.click(quickAddButton);

      await waitFor(() => {
        expect(quickAddButton).toHaveTextContent('Adding...');
      });
    });

    it('respects showQuickAdd prop', () => {
      renderWithProviders(<ProductCard product={mockProduct} showQuickAdd={false} />);
      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      const quickAddButton = screen.queryByRole('button', { name: /quick add/i });
      expect(quickAddButton).not.toBeInTheDocument();
    });
  });

  describe('Wishlist', () => {
    it('toggles wishlist on heart icon click', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      const wishlistButton = screen.getByLabelText('Add to wishlist');
      fireEvent.click(wishlistButton);

      expect(screen.getByLabelText('Remove from wishlist')).toBeInTheDocument();
    });

    it('calls onWishlistToggle callback when provided', () => {
      const onWishlistToggle = vi.fn();
      renderWithProviders(
        <ProductCard product={mockProduct} onWishlistToggle={onWishlistToggle} />
      );

      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      const wishlistButton = screen.getByLabelText('Add to wishlist');
      fireEvent.click(wishlistButton);

      expect(onWishlistToggle).toHaveBeenCalledWith(mockProduct.id);
    });

    it('respects showWishlist prop', () => {
      renderWithProviders(<ProductCard product={mockProduct} showWishlist={false} />);
      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);

      const wishlistButton = screen.queryByLabelText(/wishlist/i);
      expect(wishlistButton).not.toBeInTheDocument();
    });
  });

  describe('View Modes', () => {
    it('renders in grid mode by default', () => {
      const { container } = renderWithProviders(<ProductCard product={mockProduct} />);
      const link = container.querySelector('a');
      expect(link).not.toHaveClass('flex');
    });

    it('renders in list mode when specified', () => {
      const { container } = renderWithProviders(
        <ProductCard product={mockProduct} viewMode="list" />
      );
      const link = container.querySelector('a');
      expect(link).toHaveClass('flex');
    });

    it('shows quick add button inline in list mode', () => {
      renderWithProviders(<ProductCard product={mockProduct} viewMode="list" />);
      const quickAddButton = screen.getByRole('button', { name: /quick add/i });
      expect(quickAddButton).toBeInTheDocument();
    });
  });

  describe('Hover Behavior', () => {
    it('shows secondary image on hover when available', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      const link = screen.getByRole('link');

      fireEvent.mouseEnter(link);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2); // Primary + secondary
    });

    it('shows action buttons on hover', () => {
      renderWithProviders(<ProductCard product={mockProduct} />);
      const link = screen.getByRole('link');

      fireEvent.mouseEnter(link);

      expect(screen.getByLabelText('Add to wishlist')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /quick add/i })).toBeInTheDocument();
    });
  });

  describe('Aspect Ratio', () => {
    it('uses default 4/5 aspect ratio', () => {
      const { container } = renderWithProviders(<ProductCard product={mockProduct} />);
      const imageContainer = container.querySelector('[style*="aspect-ratio"]');
      expect(imageContainer).toHaveStyle({ aspectRatio: '4/5' });
    });

    it('respects custom aspect ratio', () => {
      const { container } = renderWithProviders(
        <ProductCard product={mockProduct} aspectRatio="1/1" />
      );
      const imageContainer = container.querySelector('[style*="aspect-ratio"]');
      expect(imageContainer).toHaveStyle({ aspectRatio: '1/1' });
    });
  });
});
