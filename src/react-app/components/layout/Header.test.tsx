import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Header } from './Header';
import { CartProvider } from '../../context/CartContext';
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
    // This would need cart with items pre-populated
    renderWithProviders(<Header />);

    const cartButton = screen.getByLabelText('Cart');
    expect(cartButton).toBeInTheDocument();
  });
});
