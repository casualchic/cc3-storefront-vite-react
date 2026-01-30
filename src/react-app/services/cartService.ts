import { CartItem } from '../types';

/**
 * CartService interface for cart data operations
 * Designed for easy swapping between localStorage and Medusa.js backend
 */
export interface CartService {
  getCart(): CartItem[];
  saveCart(cart: CartItem[]): void;
  addItem(item: CartItem): void;
  updateQuantity(productId: string, quantity: number, size?: string, color?: string): void;
  removeItem(productId: string, size?: string, color?: string): void;
  clearCart(): void;
}

/**
 * LocalStorage implementation of CartService
 * Handles SSR compatibility and safe JSON parsing
 */
class LocalStorageCartService implements CartService {
  private readonly storageKey = 'cc3-cart';

  /**
   * Check if we're in a browser environment
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Get cart items from localStorage
   */
  getCart(): CartItem[] {
    if (!this.isBrowser()) {
      return [];
    }

    try {
      const cartData = localStorage.getItem(this.storageKey);
      if (!cartData) {
        return [];
      }
      const parsedCart = JSON.parse(cartData);
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error('Error parsing cart data from localStorage:', error);
      return [];
    }
  }

  /**
   * Save cart items to localStorage
   */
  saveCart(cart: CartItem[]): void {
    if (!this.isBrowser()) {
      return;
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart data to localStorage:', error);
    }
  }

  /**
   * Find an item in the cart by matching productId, size, and color
   */
  private findItem(cart: CartItem[], productId: string, size?: string, color?: string): number {
    return cart.findIndex(
      (item) =>
        item.productId === productId &&
        item.size === size &&
        item.color === color
    );
  }

  /**
   * Add item to cart, merging quantities if item already exists
   */
  addItem(item: CartItem): void {
    const cart = this.getCart();
    const existingIndex = this.findItem(cart, item.productId, item.size, item.color);

    if (existingIndex >= 0) {
      // Item exists, merge quantities
      cart[existingIndex].quantity += item.quantity;
    } else {
      // New item, add to cart
      cart.push(item);
    }

    this.saveCart(cart);
  }

  /**
   * Update quantity of an existing cart item
   */
  updateQuantity(productId: string, quantity: number, size?: string, color?: string): void {
    const cart = this.getCart();
    const itemIndex = this.findItem(cart, productId, size, color);

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
      this.saveCart(cart);
    }
  }

  /**
   * Remove item from cart
   */
  removeItem(productId: string, size?: string, color?: string): void {
    const cart = this.getCart();
    const filteredCart = cart.filter(
      (item) =>
        !(item.productId === productId &&
          item.size === size &&
          item.color === color)
    );
    this.saveCart(filteredCart);
  }

  /**
   * Clear all items from cart
   */
  clearCart(): void {
    if (!this.isBrowser()) {
      return;
    }

    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  }
}

/**
 * Singleton instance of the cart service
 * Easy to swap implementations (e.g., MedusaCartService) in the future
 */
export const cartService: CartService = new LocalStorageCartService();
