import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { SizeSelector } from './SizeSelector';
import type { ProductOption } from '../../../types';

describe('SizeSelector', () => {
  const sizeOption: ProductOption = {
    id: 'size-opt',
    title: 'Size',
    values: [
      { id: 's', value: 'S' },
      { id: 'm', value: 'M' },
      { id: 'l', value: 'L' },
    ],
  };

  test('renders all size options as buttons', () => {
    render(
      <SizeSelector
        option={sizeOption}
        selectedValue={undefined}
        availableValues={new Set(['S', 'M', 'L'])}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByRole('radio', { name: /size s/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /size m/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /size l/i })).toBeInTheDocument();
  });

  test('highlights selected size', () => {
    render(
      <SizeSelector
        option={sizeOption}
        selectedValue="M"
        availableValues={new Set(['S', 'M', 'L'])}
        onSelect={vi.fn()}
      />
    );

    const mediumButton = screen.getByRole('radio', { name: /size m/i });
    expect(mediumButton).toHaveClass('size-button', 'size-button-selected');
    expect(mediumButton).toHaveAttribute('aria-checked', 'true');
  });

  test('disables unavailable sizes', () => {
    render(
      <SizeSelector
        option={sizeOption}
        selectedValue={undefined}
        availableValues={new Set(['S', 'M'])} // L not available
        onSelect={vi.fn()}
      />
    );

    const largeButton = screen.getByRole('radio', { name: /size l/i });
    expect(largeButton).toBeDisabled();
    expect(largeButton).toHaveClass('size-button-unavailable');
  });

  test('calls onSelect when size clicked', () => {
    const handleSelect = vi.fn();
    render(
      <SizeSelector
        option={sizeOption}
        selectedValue={undefined}
        availableValues={new Set(['S', 'M', 'L'])}
        onSelect={handleSelect}
      />
    );

    fireEvent.click(screen.getByRole('radio', { name: /size m/i }));

    expect(handleSelect).toHaveBeenCalledWith('Size', 'M');
  });

  test('has proper ARIA group label', () => {
    render(
      <SizeSelector
        option={sizeOption}
        selectedValue={undefined}
        availableValues={new Set(['S', 'M', 'L'])}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByRole('group', { name: 'Size selection' })).toBeInTheDocument();
  });

  test('supports keyboard navigation', () => {
    render(
      <SizeSelector
        option={sizeOption}
        selectedValue={undefined}
        availableValues={new Set(['S', 'M', 'L'])}
        onSelect={vi.fn()}
      />
    );

    const smallButton = screen.getByRole('radio', { name: /size s/i });
    smallButton.focus();
    expect(smallButton).toHaveFocus();
  });
});
