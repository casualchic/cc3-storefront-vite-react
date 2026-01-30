import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartItem as CartItemComponent } from './CartItem';
import { CartItem } from '../types';

// Mock the @tanstack/react-router Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, params, children, className }: { to: string; params?: { productId?: string }; children: React.ReactNode; className?: string }) => (
    <a href={typeof to === 'string' ? to.replace('$productId', params?.productId || '') : '/'} className={className}>
      {children}
    </a>
  ),
}));

// Mock cart item data
const mockCartItem: CartItem = {
  productId: 'test-product-1',
  name: 'Classic Cotton T-Shirt',
  price: 29.99,
  image: '/test-image.jpg',
  size: 'M',
  color: 'Navy Blue',
  quantity: 2,
};

const mockCartItemMinimal: CartItem = {
  productId: 'test-product-2',
  name: 'Simple Product',
  price: 19.99,
  image: '/test-image-2.jpg',
  quantity: 1,
};

function renderCartItem(
  onUpdateQuantity: (productId: string, quantity: number) => void,
  onRemove: (productId: string) => void,
  item: CartItem = mockCartItem,
  compact: boolean = false
) {
  return render(
    <CartItemComponent
      item={item}
      onUpdateQuantity={onUpdateQuantity}
      onRemove={onRemove}
      compact={compact}
    />
  );
}

describe('CartItem', () => {
  beforeEach(() => {
    // Clear any mocks between tests
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders cart item with correct details (name, price, size, color, quantity)', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItem);

      // Check product name
      expect(screen.getByText('Classic Cotton T-Shirt')).toBeInTheDocument();

      // Check price display (text may be split across elements)
      expect(screen.getByText(/29.99/)).toBeInTheDocument();

      // Check size and color badges
      expect(screen.getByText('M')).toBeInTheDocument();
      expect(screen.getByText('Navy Blue')).toBeInTheDocument();

      // Check quantity
      const quantityInput = screen.getByDisplayValue('2');
      expect(quantityInput).toBeInTheDocument();

      // Check image
      const image = screen.getByRole('img', { name: /Classic Cotton T-Shirt/i });
      expect(image).toHaveAttribute('src', '/test-image.jpg');
    });

    it('renders cart item without size and color', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItemMinimal);

      expect(screen.getByText('Simple Product')).toBeInTheDocument();
      // Size and color badges should not be present
      expect(screen.queryByText('M')).not.toBeInTheDocument();
      expect(screen.queryByText('Navy Blue')).not.toBeInTheDocument();
    });

    it('displays total price and per-unit price', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItem);

      // Per-unit price: $29.99 (text may be split across elements)
      expect(screen.getByText(/29.99/)).toBeInTheDocument();
      expect(screen.getByText(/each/)).toBeInTheDocument();

      // Total price: 2 × $29.99 = $59.98 (text may be split across elements)
      expect(screen.getByText(/59.98/)).toBeInTheDocument();
    });

    it('links product name to product detail page', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItem);

      const productLink = screen.getByRole('link', { name: /Classic Cotton T-Shirt/i });
      expect(productLink).toHaveAttribute('href', '/product/test-product-1');
    });
  });

  describe('Quantity Controls', () => {
    it('calls onUpdateQuantity when plus button clicked (quantity + 1)', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItem);

      const plusButton = screen.getByRole('button', { name: /increase quantity/i });
      fireEvent.click(plusButton);

      expect(onUpdateQuantity).toHaveBeenCalledWith(mockCartItem.productId, 3);
    });

    it('calls onUpdateQuantity when minus button clicked (quantity - 1)', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItem);

      const minusButton = screen.getByRole('button', { name: /decrease quantity/i });
      fireEvent.click(minusButton);

      expect(onUpdateQuantity).toHaveBeenCalledWith(mockCartItem.productId, 1);
    });

    it('disables minus button at quantity 1', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItemMinimal);

      const minusButton = screen.getByRole('button', { name: /decrease quantity/i });
      expect(minusButton).toBeDisabled();
    });

    it('disables plus button at max quantity', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();
      const itemAtMax: CartItem = {
        ...mockCartItem,
        quantity: 10, // SHOP_CONFIG.maxQuantityPerItem
      };

      renderCartItem(onUpdateQuantity, onRemove, itemAtMax);

      const plusButton = screen.getByRole('button', { name: /increase quantity/i });
      expect(plusButton).toBeDisabled();
    });

    it('allows manual quantity input within valid range', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItem);

      const quantityInput = screen.getByDisplayValue('2') as HTMLInputElement;
      fireEvent.change(quantityInput, { target: { value: '5' } });
      fireEvent.blur(quantityInput);

      expect(onUpdateQuantity).toHaveBeenCalledWith(mockCartItem.productId, 5);
    });
  });

  describe('Remove Button', () => {
    it('calls onRemove when remove button clicked', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItem);

      const removeButton = screen.getByRole('button', { name: /remove item/i });
      fireEvent.click(removeButton);

      expect(onRemove).toHaveBeenCalledWith(mockCartItem.productId);
    });

    it('has accessible label for remove button', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItem);

      const removeButton = screen.getByLabelText(/remove item/i);
      expect(removeButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has aria-labels for all interactive elements', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItem);

      expect(screen.getByLabelText(/decrease quantity/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/increase quantity/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/remove item/i)).toBeInTheDocument();
    });
  });

  describe('Compact Mode', () => {
    it('renders in compact mode when prop is true', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItem, true);

      // Verify component renders in compact mode
      expect(screen.getByText('Classic Cotton T-Shirt')).toBeInTheDocument();
    });
  });
});
