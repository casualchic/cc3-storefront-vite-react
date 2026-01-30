import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotifyWhenAvailable } from '../NotifyWhenAvailable';

describe('NotifyWhenAvailable', () => {
  const defaultProps = {
    productId: 'test-product',
    productName: 'Test Product',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initially shows button to open form', () => {
    render(<NotifyWhenAvailable {...defaultProps} />);
    expect(screen.getByText('Notify Me When Available')).toBeInTheDocument();
  });

  it('opens form when button is clicked', () => {
    render(<NotifyWhenAvailable {...defaultProps} />);
    const button = screen.getByText('Notify Me When Available');
    fireEvent.click(button);

    expect(screen.getByText('Get notified when back in stock')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('displays product name in notification message', () => {
    render(<NotifyWhenAvailable {...defaultProps} />);
    const button = screen.getByText('Notify Me When Available');
    fireEvent.click(button);

    expect(screen.getByText(/Test Product is available/)).toBeInTheDocument();
  });

  it('includes size in notification message when provided', () => {
    render(<NotifyWhenAvailable {...defaultProps} selectedSize="M" />);
    const button = screen.getByText('Notify Me When Available');
    fireEvent.click(button);

    expect(screen.getByText(/in size M/)).toBeInTheDocument();
  });

  it('includes color in notification message when provided', () => {
    render(<NotifyWhenAvailable {...defaultProps} selectedColor="Blue" />);
    const button = screen.getByText('Notify Me When Available');
    fireEvent.click(button);

    expect(screen.getByText(/in Blue/)).toBeInTheDocument();
  });

  it('closes form when close button is clicked', () => {
    render(<NotifyWhenAvailable {...defaultProps} />);
    const openButton = screen.getByText('Notify Me When Available');
    fireEvent.click(openButton);

    const closeButton = screen.getByLabelText('Close notification form');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Get notified when back in stock')).not.toBeInTheDocument();
  });

  it('shows error for invalid email', async () => {
    render(<NotifyWhenAvailable {...defaultProps} />);
    const openButton = screen.getByText('Notify Me When Available');
    fireEvent.click(openButton);

    const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement;
    const form = emailInput.closest('form') as HTMLFormElement;

    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('shows error for empty email', async () => {
    render(<NotifyWhenAvailable {...defaultProps} />);
    const openButton = screen.getByText('Notify Me When Available');
    fireEvent.click(openButton);

    const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement;
    const form = emailInput.closest('form') as HTMLFormElement;

    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('submits form with valid email', async () => {
    render(<NotifyWhenAvailable {...defaultProps} />);
    const openButton = screen.getByText('Notify Me When Available');
    fireEvent.click(openButton);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByText('Notify Me');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // Wait for async submission (1s API call + success state update)
    await waitFor(() => {
      expect(screen.getByText(/You're on the list!/)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('shows loading state during submission', async () => {
    render(<NotifyWhenAvailable {...defaultProps} />);
    const openButton = screen.getByText('Notify Me When Available');
    fireEvent.click(openButton);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByText('Notify Me');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Subscribing...')).toBeInTheDocument();
  });

  it('displays privacy disclaimer', () => {
    render(<NotifyWhenAvailable {...defaultProps} />);
    const openButton = screen.getByText('Notify Me When Available');
    fireEvent.click(openButton);

    expect(screen.getByText(/By subscribing, you agree to receive email notifications/)).toBeInTheDocument();
  });
});
