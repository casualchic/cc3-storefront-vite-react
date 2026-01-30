import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useEffect } from 'react';
import { CartDrawer } from './CartDrawer';
import { CartProvider, useCart } from '../context/CartContext';

// Mock the @tanstack/react-router Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, params, children, className }: any) => (
    <a href={typeof to === 'string' ? to.replace('$productId', params?.productId || '') : '/'} className={className}>
      {children}
    </a>
  ),
}));

describe('CartDrawer', () => {
  beforeEach(() => {
    // Clear localStorage before each test to prevent state pollution
    localStorage.clear();
  });

  const renderWithCart = (ui: React.ReactElement) => {
    return render(<CartProvider>{ui}</CartProvider>);
  };

  it('renders drawer when open', () => {
    const onClose = vi.fn();

    renderWithCart(<CartDrawer isOpen={true} onClose={onClose} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    const onClose = vi.fn();

    renderWithCart(<CartDrawer isOpen={false} onClose={onClose} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows empty state when cart is empty', () => {
    const onClose = vi.fn();

    renderWithCart(<CartDrawer isOpen={true} onClose={onClose} />);

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('calls onClose when backdrop clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithCart(<CartDrawer isOpen={true} onClose={onClose} />);

    const backdrop = screen.getByTestId('drawer-backdrop');
    await user.click(backdrop);

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithCart(<CartDrawer isOpen={true} onClose={onClose} />);

    const closeButton = screen.getByLabelText('Close cart');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithCart(<CartDrawer isOpen={true} onClose={onClose} />);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });

  it('locks body scroll when open', () => {
    const onClose = vi.fn();
    const originalOverflow = document.body.style.overflow;

    const { rerender } = renderWithCart(<CartDrawer isOpen={true} onClose={onClose} />);

    expect(document.body.style.overflow).toBe('hidden');

    rerender(<CartProvider><CartDrawer isOpen={false} onClose={onClose} /></CartProvider>);

    expect(document.body.style.overflow).toBe(originalOverflow);
  });

  it('calls onClose when Continue Shopping button clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithCart(<CartDrawer isOpen={true} onClose={onClose} />);

    const continueButton = screen.getByText('Continue Shopping');
    await user.click(continueButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('displays cart items when cart has items', () => {
    const onClose = vi.fn();

    // Need to wrap with CartProvider that has items
    const CartWithItems = () => {
      const { addToCart } = useCart();

      useEffect(() => {
        addToCart({
          productId: 'test-1',
          name: 'Test Product',
          price: 49.99,
          image: '/test.jpg',
          quantity: 2,
        });
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

      return <CartDrawer isOpen={true} onClose={onClose} />;
    };

    renderWithCart(<CartWithItems />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('shows free shipping progress when under threshold', () => {
    // Cart with $50 total, threshold is $75
    const CartWithItems = () => {
      const { addToCart } = useCart();

      useEffect(() => {
        addToCart({
          productId: 'test-1',
          name: 'Test Product',
          price: 50,
          image: '/test.jpg',
          quantity: 1,
        });
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

      return <CartDrawer isOpen={true} onClose={vi.fn()} />;
    };

    renderWithCart(<CartWithItems />);

    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Add $25.00 more for FREE shipping!' &&
             element?.className === 'text-sm text-gray-600 mb-2';
    })).toBeInTheDocument();
  });

  it('shows free shipping qualified message when threshold met', () => {
    const CartWithItems = () => {
      const { addToCart } = useCart();

      useEffect(() => {
        addToCart({
          productId: 'test-1',
          name: 'Test Product',
          price: 100,
          image: '/test.jpg',
          quantity: 1,
        });
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

      return <CartDrawer isOpen={true} onClose={vi.fn()} />;
    };

    renderWithCart(<CartWithItems />);

    expect(screen.getByText(/You qualify for FREE shipping/i)).toBeInTheDocument();
  });
});
