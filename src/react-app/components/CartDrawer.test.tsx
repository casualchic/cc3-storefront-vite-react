import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CartDrawer } from './CartDrawer';
import { CartProvider } from '../context/CartContext';

describe('CartDrawer', () => {
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
});
