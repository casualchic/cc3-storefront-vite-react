import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cartService } from './cartService';
import { CartItem } from '../types';
import { SHOP_CONFIG } from '../config/shopConfig';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('cartService', () => {
  beforeEach(() => {
    localStorageMock.clear();
    cartService.clearCart();
  });

  describe('quantity limits', () => {
    it('caps merged quantity at SHOP_CONFIG.maxQuantityPerItem', () => {
      const item: CartItem = {
        productId: 'test-1',
        name: 'Test Product',
        price: 29.99,
        image: '/test.jpg',
        quantity: 5,
      };

      // Add item with quantity 5
      cartService.addItem(item);
      let cart = cartService.getCart();
      expect(cart[0].quantity).toBe(5);

      // Add same item with quantity 8 (would total 13, but should cap at maxQuantityPerItem)
      cartService.addItem({ ...item, quantity: 8 });
      cart = cartService.getCart();

      // Should cap at SHOP_CONFIG.maxQuantityPerItem (10)
      expect(cart[0].quantity).toBe(SHOP_CONFIG.maxQuantityPerItem);
      expect(cart.length).toBe(1); // Should still be one item, not two
    });

    it('caps merged quantity with variants at SHOP_CONFIG.maxQuantityPerItem', () => {
      const item: CartItem = {
        productId: 'test-1',
        name: 'Test Product',
        price: 29.99,
        image: '/test.jpg',
        quantity: 7,
        size: 'M',
        color: 'Blue',
      };

      // Add item with quantity 7
      cartService.addItem(item);
      let cart = cartService.getCart();
      expect(cart[0].quantity).toBe(7);

      // Add same variant with quantity 5 (would total 12, should cap at 10)
      cartService.addItem({ ...item, quantity: 5 });
      cart = cartService.getCart();

      expect(cart[0].quantity).toBe(SHOP_CONFIG.maxQuantityPerItem);
      expect(cart.length).toBe(1);
    });

    it('does not merge items with different variants', () => {
      const baseItem: CartItem = {
        productId: 'test-1',
        name: 'Test Product',
        price: 29.99,
        image: '/test.jpg',
        quantity: 5,
        size: 'M',
        color: 'Blue',
      };

      cartService.addItem(baseItem);

      // Add same product but different color
      cartService.addItem({ ...baseItem, color: 'Red', quantity: 3 });

      const cart = cartService.getCart();
      expect(cart.length).toBe(2); // Two separate items
      expect(cart[0].quantity).toBe(5);
      expect(cart[1].quantity).toBe(3);
    });
  });

  describe('updateQuantity', () => {
    it('updates quantity for matching variant', () => {
      const item: CartItem = {
        productId: 'test-1',
        name: 'Test Product',
        price: 29.99,
        image: '/test.jpg',
        quantity: 2,
        size: 'M',
        color: 'Blue',
      };

      cartService.addItem(item);

      const updated = cartService.updateQuantity('test-1', 5, 'M', 'Blue');
      expect(updated).toBe(true);

      const cart = cartService.getCart();
      expect(cart[0].quantity).toBe(5);
    });

    it('removes item when quantity is 0', () => {
      const item: CartItem = {
        productId: 'test-1',
        name: 'Test Product',
        price: 29.99,
        image: '/test.jpg',
        quantity: 2,
      };

      cartService.addItem(item);
      expect(cartService.getCart().length).toBe(1);

      cartService.updateQuantity('test-1', 0);
      expect(cartService.getCart().length).toBe(0);
    });

    it('returns false when item not found', () => {
      const updated = cartService.updateQuantity('nonexistent', 5);
      expect(updated).toBe(false);
    });
  });

  describe('removeItem', () => {
    it('removes item with matching variant', () => {
      const item1: CartItem = {
        productId: 'test-1',
        name: 'Test Product',
        price: 29.99,
        image: '/test.jpg',
        quantity: 2,
        size: 'M',
        color: 'Blue',
      };

      const item2: CartItem = {
        ...item1,
        color: 'Red',
      };

      cartService.addItem(item1);
      cartService.addItem(item2);
      expect(cartService.getCart().length).toBe(2);

      cartService.removeItem('test-1', 'M', 'Blue');
      const cart = cartService.getCart();

      expect(cart.length).toBe(1);
      expect(cart[0].color).toBe('Red');
    });
  });

  describe('clearCart', () => {
    it('removes all items from cart', () => {
      cartService.addItem({
        productId: 'test-1',
        name: 'Test Product 1',
        price: 29.99,
        image: '/test1.jpg',
        quantity: 2,
      });

      cartService.addItem({
        productId: 'test-2',
        name: 'Test Product 2',
        price: 39.99,
        image: '/test2.jpg',
        quantity: 1,
      });

      expect(cartService.getCart().length).toBe(2);

      cartService.clearCart();
      expect(cartService.getCart().length).toBe(0);
    });
  });
});
