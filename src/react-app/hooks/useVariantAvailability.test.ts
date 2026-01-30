import { describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useVariantAvailability } from './useVariantAvailability';
import type { ProductOption, ProductVariant } from '../types';

describe('useVariantAvailability', () => {
  const options: ProductOption[] = [
    {
      id: 'color-opt',
      title: 'Color',
      values: [
        { id: 'blue', value: 'Blue' },
        { id: 'red', value: 'Red' },
      ],
    },
    {
      id: 'size-opt',
      title: 'Size',
      values: [
        { id: 's', value: 'S' },
        { id: 'm', value: 'M' },
      ],
    },
  ];

  const variants: ProductVariant[] = [
    {
      id: 'var-1',
      title: 'Blue / S',
      options: [
        { id: 'blue', value: 'Blue', option: { title: 'Color' } as ProductOption },
        { id: 's', value: 'S', option: { title: 'Size' } as ProductOption },
      ],
      inventory_quantity: 10,
    },
    {
      id: 'var-2',
      title: 'Red / M',
      options: [
        { id: 'red', value: 'Red', option: { title: 'Color' } as ProductOption },
        { id: 'm', value: 'M', option: { title: 'Size' } as ProductOption },
      ],
      inventory_quantity: 5,
    },
  ];

  test('returns all options when nothing selected', () => {
    const { result } = renderHook(() =>
      useVariantAvailability(options, variants, {})
    );

    expect(result.current.Color.has('Blue')).toBe(true);
    expect(result.current.Color.has('Red')).toBe(true);
    expect(result.current.Size.has('S')).toBe(true);
    expect(result.current.Size.has('M')).toBe(true);
  });

  test('filters options when selection made', () => {
    const { result } = renderHook(() =>
      useVariantAvailability(options, variants, { Color: 'Blue' })
    );

    expect(result.current.Size.has('S')).toBe(true);
    expect(result.current.Size.has('M')).toBe(false);
  });

  test('memoizes result when inputs unchanged', () => {
    const { result, rerender } = renderHook(
      ({ opts, vars, selected }) =>
        useVariantAvailability(opts, vars, selected),
      {
        initialProps: { opts: options, vars: variants, selected: {} },
      }
    );

    const firstResult = result.current;
    rerender({ opts: options, vars: variants, selected: {} });

    expect(result.current).toBe(firstResult);
  });
});
