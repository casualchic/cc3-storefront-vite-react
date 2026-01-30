import { describe, test, expect } from 'vitest';
import type {
  ProductOption,
  ProductOptionValue,
  ProductVariant,
  ProductImage,
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

  test('ProductVariant type exists with options array', () => {
    const variant: ProductVariant = {
      id: 'var-1',
      options: [],
    };
    expect(variant.id).toBe('var-1');
  });
});
