import { describe, it, expect } from 'vitest';
import type { ProductOption, ProductVariant } from '../types';
import {
  findMatchingVariant,
  computeAvailableOptions,
  getVariantStockStatus,
} from './variantMatching';

describe('findMatchingVariant', () => {
  const mockVariants: ProductVariant[] = [
    {
      id: 'var-1',
      title: 'Small / Blue',
      inventory_quantity: 10,
      options: [
        {
          id: 'opt-val-1',
          value: 'Small',
          option_id: 'size-opt',
          option: { id: 'size-opt', title: 'Size', values: [] },
        },
        {
          id: 'opt-val-2',
          value: 'Blue',
          option_id: 'color-opt',
          option: { id: 'color-opt', title: 'Color', values: [] },
        },
      ],
    },
    {
      id: 'var-2',
      title: 'Medium / Blue',
      inventory_quantity: 5,
      options: [
        {
          id: 'opt-val-3',
          value: 'Medium',
          option_id: 'size-opt',
          option: { id: 'size-opt', title: 'Size', values: [] },
        },
        {
          id: 'opt-val-4',
          value: 'Blue',
          option_id: 'color-opt',
          option: { id: 'color-opt', title: 'Color', values: [] },
        },
      ],
    },
    {
      id: 'var-3',
      title: 'Small / Red',
      inventory_quantity: 0,
      options: [
        {
          id: 'opt-val-5',
          value: 'Small',
          option_id: 'size-opt',
          option: { id: 'size-opt', title: 'Size', values: [] },
        },
        {
          id: 'opt-val-6',
          value: 'Red',
          option_id: 'color-opt',
          option: { id: 'color-opt', title: 'Color', values: [] },
        },
      ],
    },
  ];

  it('finds exact match when all options selected', () => {
    const selected = { Size: 'Small', Color: 'Blue' };
    const result = findMatchingVariant(mockVariants, selected);
    expect(result).toEqual(mockVariants[0]);
    expect(result?.id).toBe('var-1');
  });

  it('returns null when no match found', () => {
    const selected = { Size: 'Large', Color: 'Green' };
    const result = findMatchingVariant(mockVariants, selected);
    expect(result).toBeNull();
  });

  it('returns null for partial selection', () => {
    const selected = { Size: 'Small' };
    const result = findMatchingVariant(mockVariants, selected);
    // Partial selection could match multiple variants, so should return null
    expect(result).toBeNull();
  });

  it('returns null when variant has more options than selected (partial selection)', () => {
    const result = findMatchingVariant(mockVariants, { Size: 'Small' }); // Only selecting Size, not Color
    expect(result).toBeNull(); // Should not match because selection is incomplete
  });
});

describe('computeAvailableOptions', () => {
  const mockOptions: ProductOption[] = [
    {
      id: 'size-opt',
      title: 'Size',
      values: [
        { id: 'size-1', value: 'Small', option_id: 'size-opt' },
        { id: 'size-2', value: 'Medium', option_id: 'size-opt' },
        { id: 'size-3', value: 'Large', option_id: 'size-opt' },
      ],
    },
    {
      id: 'color-opt',
      title: 'Color',
      values: [
        { id: 'color-1', value: 'Blue', option_id: 'color-opt' },
        { id: 'color-2', value: 'Red', option_id: 'color-opt' },
        { id: 'color-3', value: 'Green', option_id: 'color-opt' },
      ],
    },
  ];

  const mockVariants: ProductVariant[] = [
    {
      id: 'var-1',
      title: 'Small / Blue',
      inventory_quantity: 10,
      options: [
        {
          id: 'opt-val-1',
          value: 'Small',
          option_id: 'size-opt',
          option: { id: 'size-opt', title: 'Size', values: [] },
        },
        {
          id: 'opt-val-2',
          value: 'Blue',
          option_id: 'color-opt',
          option: { id: 'color-opt', title: 'Color', values: [] },
        },
      ],
    },
    {
      id: 'var-2',
      title: 'Medium / Blue',
      inventory_quantity: 5,
      options: [
        {
          id: 'opt-val-3',
          value: 'Medium',
          option_id: 'size-opt',
          option: { id: 'size-opt', title: 'Size', values: [] },
        },
        {
          id: 'opt-val-4',
          value: 'Blue',
          option_id: 'color-opt',
          option: { id: 'color-opt', title: 'Color', values: [] },
        },
      ],
    },
    {
      id: 'var-3',
      title: 'Small / Red',
      inventory_quantity: 0,
      options: [
        {
          id: 'opt-val-5',
          value: 'Small',
          option_id: 'size-opt',
          option: { id: 'size-opt', title: 'Size', values: [] },
        },
        {
          id: 'opt-val-6',
          value: 'Red',
          option_id: 'color-opt',
          option: { id: 'color-opt', title: 'Color', values: [] },
        },
      ],
    },
  ];

  it('returns all options when nothing selected', () => {
    const result = computeAvailableOptions(mockOptions, mockVariants, {});
    expect(result.Size).toEqual(new Set(['Small', 'Medium']));
    expect(result.Color).toEqual(new Set(['Blue']));
  });

  it('filters sizes when color selected', () => {
    const selected = { Color: 'Blue' };
    const result = computeAvailableOptions(mockOptions, mockVariants, selected);
    expect(result.Size).toEqual(new Set(['Small', 'Medium']));
    expect(result.Color).toEqual(new Set(['Blue']));
  });

  it('excludes out-of-stock variants from availability', () => {
    const selected = { Size: 'Small' };
    const result = computeAvailableOptions(mockOptions, mockVariants, selected);
    // Small/Blue has inventory=10, Small/Red has inventory=0
    expect(result.Size).toEqual(new Set(['Small']));
    expect(result.Color).toEqual(new Set(['Blue']));
  });
});

describe('getVariantStockStatus', () => {
  it('returns out-of-stock when variant is null', () => {
    const result = getVariantStockStatus(null);
    expect(result.status).toBe('out-of-stock');
    expect(result.message).toBe('Out of Stock');
  });

  it('returns out-of-stock when inventory is zero', () => {
    const variant: ProductVariant = {
      id: 'var-1',
      title: 'Test',
      inventory_quantity: 0,
      options: [],
    };
    const result = getVariantStockStatus(variant);
    expect(result.status).toBe('out-of-stock');
    expect(result.message).toBe('Out of Stock');
  });

  it('returns low-stock when below threshold', () => {
    const variant: ProductVariant = {
      id: 'var-1',
      title: 'Test',
      inventory_quantity: 3,
      options: [],
    };
    const result = getVariantStockStatus(variant, 5);
    expect(result.status).toBe('low-stock');
    expect(result.quantity).toBe(3);
    expect(result.message).toBe('Only 3 left in stock');
  });

  it('returns in-stock when above threshold', () => {
    const variant: ProductVariant = {
      id: 'var-1',
      title: 'Test',
      inventory_quantity: 10,
      options: [],
    };
    const result = getVariantStockStatus(variant, 5);
    expect(result.status).toBe('in-stock');
    expect(result.message).toBe('In Stock');
  });

  it('treats undefined inventory as zero', () => {
    const variant = {
      id: 'var-1',
      title: 'Test',
      options: [],
    } as ProductVariant;
    const result = getVariantStockStatus(variant);
    expect(result.status).toBe('out-of-stock');
    expect(result.message).toBe('Out of Stock');
  });
});
