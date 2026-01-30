import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { OptionSelector } from './OptionSelector';
import type { ProductOption } from '../../../types';

describe('OptionSelector', () => {
  const materialOption: ProductOption = {
    id: 'material-opt',
    title: 'Material',
    values: [
      { id: 'cotton', value: 'Cotton' },
      { id: 'polyester', value: 'Polyester' },
      { id: 'blend', value: 'Cotton Blend' },
    ],
  };

  test('renders all option values as buttons', () => {
    render(
      <OptionSelector
        option={materialOption}
        selectedValue={undefined}
        availableValues={new Set(['Cotton', 'Polyester', 'Cotton Blend'])}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /material cotton$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /material polyester/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /material cotton blend/i })).toBeInTheDocument();
  });

  test('highlights selected option', () => {
    render(
      <OptionSelector
        option={materialOption}
        selectedValue="Polyester"
        availableValues={new Set(['Cotton', 'Polyester', 'Cotton Blend'])}
        onSelect={vi.fn()}
      />
    );

    const polyesterButton = screen.getByRole('button', { name: /material polyester/i });
    expect(polyesterButton).toHaveClass('option-button', 'option-button-selected');
    expect(polyesterButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('disables unavailable options', () => {
    render(
      <OptionSelector
        option={materialOption}
        selectedValue={undefined}
        availableValues={new Set(['Cotton', 'Polyester'])} // Cotton Blend not available
        onSelect={vi.fn()}
      />
    );

    const blendButton = screen.getByRole('button', { name: /material cotton blend/i });
    expect(blendButton).toBeDisabled();
    expect(blendButton).toHaveClass('option-button-unavailable');
  });

  test('calls onSelect when clicked', () => {
    const handleSelect = vi.fn();
    render(
      <OptionSelector
        option={materialOption}
        selectedValue={undefined}
        availableValues={new Set(['Cotton', 'Polyester', 'Cotton Blend'])}
        onSelect={handleSelect}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /material polyester/i }));

    expect(handleSelect).toHaveBeenCalledWith('Material', 'Polyester');
  });
});
