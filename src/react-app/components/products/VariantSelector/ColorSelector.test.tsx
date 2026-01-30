import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { ColorSelector } from './ColorSelector';
import type { ProductOption } from '../../../types';

describe('ColorSelector', () => {
  const colorOption: ProductOption = {
    id: 'color-opt',
    title: 'Color',
    values: [
      { id: 'blue', value: 'Blue', metadata: { hex: '#0000ff' } },
      { id: 'red', value: 'Red', metadata: { hex: '#ff0000' } },
      { id: 'green', value: 'Green', metadata: { hex: '#00ff00' } },
    ],
  };

  test('renders all color swatches', () => {
    render(
      <ColorSelector
        option={colorOption}
        selectedValue={undefined}
        availableValues={new Set(['Blue', 'Red', 'Green'])}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /color blue/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /color red/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /color green/i })).toBeInTheDocument();
  });

  test('applies hex color as background', () => {
    render(
      <ColorSelector
        option={colorOption}
        selectedValue={undefined}
        availableValues={new Set(['Blue', 'Red', 'Green'])}
        onSelect={vi.fn()}
      />
    );

    const blueButton = screen.getByRole('button', { name: /color blue/i });
    const swatch = blueButton.querySelector('.color-swatch');
    expect(swatch).toHaveStyle({ backgroundColor: '#0000ff' });
  });

  test('shows checkmark on selected color', () => {
    render(
      <ColorSelector
        option={colorOption}
        selectedValue="Blue"
        availableValues={new Set(['Blue', 'Red', 'Green'])}
        onSelect={vi.fn()}
      />
    );

    const blueButton = screen.getByRole('button', { name: /color blue/i });
    expect(blueButton).toHaveClass('color-button-selected');
    expect(blueButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('disables unavailable colors', () => {
    render(
      <ColorSelector
        option={colorOption}
        selectedValue={undefined}
        availableValues={new Set(['Blue', 'Red'])} // Green unavailable
        onSelect={vi.fn()}
      />
    );

    const greenButton = screen.getByRole('button', { name: /color green/i });
    expect(greenButton).toBeDisabled();
    expect(greenButton).toHaveClass('color-button-unavailable');
  });

  test('calls onSelect when color clicked', () => {
    const handleSelect = vi.fn();
    render(
      <ColorSelector
        option={colorOption}
        selectedValue={undefined}
        availableValues={new Set(['Blue', 'Red', 'Green'])}
        onSelect={handleSelect}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /color red/i }));

    expect(handleSelect).toHaveBeenCalledWith('Color', 'Red');
  });

  test('uses default color when hex not provided', () => {
    const colorWithoutHex: ProductOption = {
      id: 'color-opt',
      title: 'Color',
      values: [{ id: 'navy', value: 'Navy' }],
    };

    render(
      <ColorSelector
        option={colorWithoutHex}
        selectedValue={undefined}
        availableValues={new Set(['Navy'])}
        onSelect={vi.fn()}
      />
    );

    const navyButton = screen.getByRole('button', { name: /color navy/i });
    const swatch = navyButton.querySelector('.color-swatch');
    expect(swatch).toHaveStyle({ backgroundColor: '#cccccc' });
  });
});
