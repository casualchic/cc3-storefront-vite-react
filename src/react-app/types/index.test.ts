import { describe, test, expect } from 'vitest';
import type {
  ProductOption,
  ProductOptionValue,
  ProductVariant,
} from './index';

describe('Medusa-Compatible Types', () => {
  test('ProductOption type exists and has required fields', () => {
    const option: ProductOption = {
      id: 'opt-1',
      title: 'Size',
      values: [],
    };
    expect(option.id).toBe('opt-1');
    expect(option.title).toBe('Size');
  });

  test('ProductOptionValue type exists', () => {
    const value: ProductOptionValue = {
      id: 'val-1',
      value: 'Medium',
    };
    expect(value.value).toBe('Medium');
  });

  test('ProductVariant type exists with required fields', () => {
    const variant: ProductVariant = {
      id: 'var-1',
      title: 'Small / Blue',
      inventory_quantity: 10,
      options: [],
    };
    expect(variant.id).toBe('var-1');
    expect(variant.title).toBe('Small / Blue');
    expect(variant.inventory_quantity).toBe(10);
  });
});
