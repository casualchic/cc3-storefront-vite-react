import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { VariantSelector } from './VariantSelector';
import type { Product, ProductOption, ProductVariant } from '../../../types';

describe('VariantSelector', () => {
  describe('with Medusa format (options + variants)', () => {
    const options: ProductOption[] = [
      {
        id: 'color-opt',
        title: 'Color',
        values: [
          { id: 'blue', value: 'Blue', metadata: { hex: '#0000ff' } },
          { id: 'red', value: 'Red', metadata: { hex: '#ff0000' } },
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
          { id: 'blue', value: 'Blue', option: { title: 'Color' } as any },
          { id: 's', value: 'S', option: { title: 'Size' } as any },
        ],
        price: 29.99,
        inventory_quantity: 10,
      },
      {
        id: 'var-2',
        title: 'Red / M',
        options: [
          { id: 'red', value: 'Red', option: { title: 'Color' } as any },
          { id: 'm', value: 'M', option: { title: 'Size' } as any },
        ],
        price: 34.99,
        inventory_quantity: 3,
      },
    ];

    test('renders all option selectors', () => {
      render(
        <VariantSelector
          options={options}
          variants={variants}
          selectedOptions={{}}
          onOptionChange={vi.fn()}
        />
      );

      expect(screen.getByRole('group', { name: /color selection/i })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: /size selection/i })).toBeInTheDocument();
    });

    test('calls onOptionChange when option selected', () => {
      const handleChange = vi.fn();
      render(
        <VariantSelector
          options={options}
          variants={variants}
          selectedOptions={{}}
          onOptionChange={handleChange}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /color blue/i }));

      expect(handleChange).toHaveBeenCalledWith('Color', 'Blue');
    });

    test('calls onVariantSelect when variant matched', () => {
      const handleVariantSelect = vi.fn();
      render(
        <VariantSelector
          options={options}
          variants={variants}
          selectedOptions={{ Color: 'Blue', Size: 'S' }}
          onOptionChange={vi.fn()}
          onVariantSelect={handleVariantSelect}
        />
      );

      expect(handleVariantSelect).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'var-1' })
      );
    });

    test('shows price when showPrice is true', () => {
      render(
        <VariantSelector
          options={options}
          variants={variants}
          selectedOptions={{ Color: 'Blue', Size: 'S' }}
          onOptionChange={vi.fn()}
          showPrice
        />
      );

      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });

    test('shows stock status when showStock is true', () => {
      render(
        <VariantSelector
          options={options}
          variants={variants}
          selectedOptions={{ Color: 'Red', Size: 'M' }}
          onOptionChange={vi.fn()}
          showStock
          lowStockThreshold={5}
        />
      );

      expect(screen.getByText(/only 3 left/i)).toBeInTheDocument();
    });
  });

  describe('with simple Product format', () => {
    const product: Product = {
      id: 'prod-1',
      name: 'Test Product',
      price: 29.99,
      image: 'test.jpg',
      category: 'test',
      sizes: ['S', 'M', 'L'],
      colors: ['Blue', 'Red'],
      inStock: true,
    };

    test('adapts simple product to options/variants', () => {
      render(
        <VariantSelector
          product={product}
          selectedOptions={{}}
          onOptionChange={vi.fn()}
        />
      );

      expect(screen.getByRole('group', { name: /size selection/i })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: /color selection/i })).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    test('shows loading state', () => {
      render(
        <VariantSelector
          options={[]}
          variants={[]}
          selectedOptions={{}}
          onOptionChange={vi.fn()}
          isLoading
        />
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test('throws error when neither product nor options provided', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <VariantSelector selectedOptions={{}} onOptionChange={vi.fn()} />
        );
      }).toThrow();

      consoleError.mockRestore();
    });
  });
});
