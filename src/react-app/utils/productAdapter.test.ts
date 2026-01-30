import { describe, it, expect } from 'vitest';
import { adaptSimpleProductToOptions } from './productAdapter';
import type { Product } from '../types';

describe('adaptSimpleProductToOptions', () => {
  it('converts simple sizes array to ProductOption', () => {
    const product: Product = {
      id: '1',
      name: 'T-Shirt',
      price: 29.99,
      image: 'tshirt.jpg',
      category: 'clothing',
      inStock: true,
      sizes: ['S', 'M', 'L', 'XL'],
    };

    const result = adaptSimpleProductToOptions(product);

    expect(result.options).toHaveLength(1);
    expect(result.options[0]).toEqual({
      id: 'size-option',
      title: 'Size',
      values: [
        { id: 'size-0', value: 'S', option_id: 'size-option' },
        { id: 'size-1', value: 'M', option_id: 'size-option' },
        { id: 'size-2', value: 'L', option_id: 'size-option' },
        { id: 'size-3', value: 'XL', option_id: 'size-option' },
      ],
    });
    expect(result.variants).toEqual([]);
  });

  it('converts colors array to ProductOption with hex metadata', () => {
    const product: Product = {
      id: '2',
      name: 'Shirt',
      price: 39.99,
      image: 'shirt.jpg',
      category: 'clothing',
      inStock: true,
      colors: ['Blue', 'Red', 'Green'],
    };

    const result = adaptSimpleProductToOptions(product);

    expect(result.options).toHaveLength(1);
    expect(result.options[0]).toEqual({
      id: 'color-option',
      title: 'Color',
      values: [
        {
          id: 'color-0',
          value: 'Blue',
          option_id: 'color-option',
          metadata: { hex: '#000000' },
        },
        {
          id: 'color-1',
          value: 'Red',
          option_id: 'color-option',
          metadata: { hex: '#000000' },
        },
        {
          id: 'color-2',
          value: 'Green',
          option_id: 'color-option',
          metadata: { hex: '#000000' },
        },
      ],
    });
    expect(result.variants).toEqual([]);
  });

  it('uses colorSwatches when available (preferred over colors)', () => {
    const product: Product = {
      id: '3',
      name: 'Premium Shirt',
      price: 59.99,
      image: 'premium-shirt.jpg',
      category: 'clothing',
      inStock: true,
      colors: ['Blue', 'Red'], // Should be ignored
      colorSwatches: [
        { name: 'Navy', hex: '#001f3f' },
        { name: 'Crimson', hex: '#dc143c' },
      ],
    };

    const result = adaptSimpleProductToOptions(product);

    expect(result.options).toHaveLength(1);
    expect(result.options[0]).toEqual({
      id: 'color-option',
      title: 'Color',
      values: [
        {
          id: 'color-0',
          value: 'Navy',
          option_id: 'color-option',
          metadata: { hex: '#001f3f' },
        },
        {
          id: 'color-1',
          value: 'Crimson',
          option_id: 'color-option',
          metadata: { hex: '#dc143c' },
        },
      ],
    });
  });

  it('returns empty arrays when no sizes or colors', () => {
    const product: Product = {
      id: '4',
      name: 'Simple Product',
      price: 19.99,
      image: 'simple.jpg',
      category: 'accessories',
      inStock: true,
    };

    const result = adaptSimpleProductToOptions(product);

    expect(result.options).toEqual([]);
    expect(result.variants).toEqual([]);
  });

  it('passes through existing variants if present', () => {
    const product: Product = {
      id: '5',
      name: 'Product with Variants',
      price: 49.99,
      image: 'product.jpg',
      category: 'clothing',
      inStock: true,
      sizes: ['S', 'M'],
      variants: [
        {
          id: 'var-1',
          title: 'Small / Blue',
          options: [
            { id: 'opt-val-1', value: 'S', option_id: 'size-option' },
            { id: 'opt-val-2', value: 'Blue', option_id: 'color-option' },
          ],
          inventory_quantity: 10,
        },
        {
          id: 'var-2',
          title: 'Medium / Red',
          options: [
            { id: 'opt-val-3', value: 'M', option_id: 'size-option' },
            { id: 'opt-val-4', value: 'Red', option_id: 'color-option' },
          ],
          inventory_quantity: 5,
        },
      ],
    };

    const result = adaptSimpleProductToOptions(product);

    expect(result.options).toHaveLength(1); // Only size option created
    expect(result.variants).toEqual(product.variants);
    expect(result.variants).toHaveLength(2);
  });

  it('handles both sizes and colors together', () => {
    const product: Product = {
      id: '6',
      name: 'Full Product',
      price: 79.99,
      image: 'full-product.jpg',
      category: 'clothing',
      inStock: true,
      sizes: ['S', 'M', 'L'],
      colorSwatches: [
        { name: 'Navy', hex: '#001f3f' },
        { name: 'White', hex: '#ffffff' },
      ],
    };

    const result = adaptSimpleProductToOptions(product);

    expect(result.options).toHaveLength(2);
    expect(result.options[0].title).toBe('Size');
    expect(result.options[0].values).toHaveLength(3);
    expect(result.options[1].title).toBe('Color');
    expect(result.options[1].values).toHaveLength(2);
    expect(result.variants).toEqual([]);
  });
});
