import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useEffect } from 'react';
import { Header } from './Header';
import { CartProvider, useCart } from '../../context/CartContext';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

describe('Header with CartDrawer', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <ThemeProvider>
        <CartProvider>
          {ui}
        </CartProvider>
      </ThemeProvider>
    );
  };

  it('opens cart drawer when cart icon clicked', async () => {
    const user = userEvent.setup();

    renderWithProviders(<Header />);

    const cartButton = screen.getByLabelText('Cart');
    await user.click(cartButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
  });

  it('displays cart item count in badge', () => {
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
        addToCart({
          productId: 'test-2',
          name: 'Test Product 2',
          price: 29.99,
          image: '/test2.jpg',
          quantity: 1,
        });
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

      return <Header />;
    };

    renderWithProviders(<CartWithItems />);

    // Cart badge should show total item count (2 + 1 = 3)
    const cartBadge = screen.getByText('3');
    expect(cartBadge).toBeInTheDocument();
    expect(cartBadge).toHaveClass('cart-badge');
  });
});
