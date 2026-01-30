import { renderHook } from '@testing-library/react';
import { useVariantSelection } from './useVariantSelection';
import type { ProductVariant } from '../types';

describe('useVariantSelection', () => {
  const blueSmall: ProductVariant = {
    id: 'var-1',
    title: 'Blue / S',
    options: [
      { id: 'blue', value: 'Blue', option: { title: 'Color' } as any },
      { id: 's', value: 'S', option: { title: 'Size' } as any },
    ],
    price: 29.99,
    inventory_quantity: 10,
  };

  const blueMedium: ProductVariant = {
    id: 'var-2',
    title: 'Blue / M',
    options: [
      { id: 'blue', value: 'Blue', option: { title: 'Color' } as any },
      { id: 'm', value: 'M', option: { title: 'Size' } as any },
    ],
    price: 29.99,
    inventory_quantity: 5,
  };

  test('returns null variant when no selection', () => {
    const { result } = renderHook(() =>
      useVariantSelection([blueSmall, blueMedium], {})
    );

    expect(result.current.currentVariant).toBeNull();
    expect(result.current.isComplete).toBe(false);
  });

  test('returns null variant when partial selection', () => {
    const { result } = renderHook(() =>
      useVariantSelection([blueSmall, blueMedium], { Color: 'Blue' })
    );

    expect(result.current.currentVariant).toBeNull();
    expect(result.current.isComplete).toBe(false);
  });

  test('returns matching variant when all options selected', () => {
    const { result } = renderHook(() =>
      useVariantSelection([blueSmall, blueMedium], {
        Color: 'Blue',
        Size: 'S',
      })
    );

    expect(result.current.currentVariant?.id).toBe('var-1');
    expect(result.current.isComplete).toBe(true);
  });

  test('memoizes result when inputs unchanged', () => {
    const { result, rerender } = renderHook(
      ({ variants, selected }) => useVariantSelection(variants, selected),
      {
        initialProps: {
          variants: [blueSmall],
          selected: { Color: 'Blue', Size: 'S' },
        },
      }
    );

    const firstResult = result.current;
    rerender({
      variants: [blueSmall],
      selected: { Color: 'Blue', Size: 'S' },
    });

    expect(result.current).toBe(firstResult);
  });
});
