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
  onUpdateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void,
  onRemove: (productId: string, size?: string, color?: string) => void,
  item: CartItem = mockCartItem,
  compact: boolean = false,
  onSaveForLater?: (productId: string, size?: string, color?: string) => void
) {
  return render(
    <CartItemComponent
      item={item}
      onUpdateQuantity={onUpdateQuantity}
      onRemove={onRemove}
      onSaveForLater={onSaveForLater}
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

      expect(onUpdateQuantity).toHaveBeenCalledWith(mockCartItem.productId, 3, mockCartItem.size, mockCartItem.color);
    });

    it('calls onUpdateQuantity when minus button clicked (quantity - 1)', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItem);

      const minusButton = screen.getByRole('button', { name: /decrease quantity/i });
      fireEvent.click(minusButton);

      expect(onUpdateQuantity).toHaveBeenCalledWith(mockCartItem.productId, 1, mockCartItem.size, mockCartItem.color);
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

      expect(onUpdateQuantity).toHaveBeenCalledWith(mockCartItem.productId, 5, mockCartItem.size, mockCartItem.color);
    });
  });

  describe('Remove Button', () => {
    it('calls onRemove when remove button clicked', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItem);

      const removeButton = screen.getByRole('button', { name: /remove item/i });
      fireEvent.click(removeButton);

      expect(onRemove).toHaveBeenCalledWith(mockCartItem.productId, mockCartItem.size, mockCartItem.color);
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

  describe('Inventory Warnings', () => {
    it('displays inventory warning when quantity exceeds available inventory', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();
      const itemWithLowStock: CartItem = {
        ...mockCartItem,
        quantity: 5,
        availableInventory: 3,
      };

      renderCartItem(onUpdateQuantity, onRemove, itemWithLowStock);

      expect(screen.getByText(/Only 3 left in stock/i)).toBeInTheDocument();
    });

    it('displays low stock indicator when inventory is low but not exceeded', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();
      const itemWithLowStock: CartItem = {
        ...mockCartItem,
        quantity: 2,
        availableInventory: 4,
      };

      renderCartItem(onUpdateQuantity, onRemove, itemWithLowStock);

      expect(screen.getByText(/Only 4 left/i)).toBeInTheDocument();
    });

    it('does not display inventory warning when stock is sufficient', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();
      const itemWithGoodStock: CartItem = {
        ...mockCartItem,
        quantity: 2,
        availableInventory: 20,
      };

      renderCartItem(onUpdateQuantity, onRemove, itemWithGoodStock);

      expect(screen.queryByText(/Only.*left/i)).not.toBeInTheDocument();
    });

    it('does not display inventory warning when availableInventory is undefined', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItem);

      expect(screen.queryByText(/Only.*left/i)).not.toBeInTheDocument();
    });
  });

  describe('Save for Later', () => {
    it('displays save for later button when callback provided', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();
      const onSaveForLater = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItem, false, onSaveForLater);

      expect(screen.getByText(/Save for later/i)).toBeInTheDocument();
    });

    it('does not display save for later button when callback not provided', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItem);

      expect(screen.queryByText(/Save for later/i)).not.toBeInTheDocument();
    });

    it('calls onSaveForLater when save for later button clicked', () => {
      const onUpdateQuantity = vi.fn();
      const onRemove = vi.fn();
      const onSaveForLater = vi.fn();

      renderCartItem(onUpdateQuantity, onRemove, mockCartItem, false, onSaveForLater);

      const saveButton = screen.getByText(/Save for later/i);
      fireEvent.click(saveButton);

      expect(onSaveForLater).toHaveBeenCalledWith(mockCartItem.productId, mockCartItem.size, mockCartItem.color);
    });
  });
});
