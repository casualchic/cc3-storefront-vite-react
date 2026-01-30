import { CartItem } from '../types';
import { SHOP_CONFIG } from '../config/shopConfig';

/**
 * CartService interface for cart data operations
 * Designed for easy swapping between localStorage and Medusa.js backend
 */
export interface CartService {
  getCart(): CartItem[];
  saveCart(cart: CartItem[]): void;
  addItem(item: CartItem): void;
  updateQuantity(productId: string, quantity: number, size?: string, color?: string): boolean;
  removeItem(productId: string, size?: string, color?: string): void;
  clearCart(): void;
}

/**
 * LocalStorage implementation of CartService
 * Handles SSR compatibility and safe JSON parsing
 */
class LocalStorageCartService implements CartService {
  private readonly storageKey = 'cc3-cart';
  private readonly MAX_CART_ITEMS = 100;
  private readonly MAX_ITEM_QUANTITY = SHOP_CONFIG.maxQuantityPerItem;

  /**
   * Check if we're in a browser environment
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Validate that an object is a valid CartItem with all required properties
   */
  private isValidCartItem(item: unknown): item is CartItem {
    if (typeof item !== 'object' || item === null) {
      return false;
    }

    const obj = item as Record<string, unknown>;
    return (
      typeof obj.productId === 'string' &&
      typeof obj.name === 'string' &&
      typeof obj.price === 'number' &&
      typeof obj.image === 'string' &&
      typeof obj.quantity === 'number' &&
      obj.quantity > 0
    );
  }

  /**
   * Get cart items from localStorage with runtime type validation
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
      if (!Array.isArray(parsedCart)) {
        return [];
      }

      // Filter out invalid items and validate each CartItem has required properties
      const validCart = parsedCart.filter((item) => {
        const isValid = this.isValidCartItem(item);
        if (!isValid) {
          console.warn('Invalid cart item found and removed:', item);
        }
        return isValid;
      });

      return validCart;
    } catch (error) {
      console.error('Error parsing cart data from localStorage:', error);
      return [];
    }
  }

  /**
   * Save cart items to localStorage
   * Handles QuotaExceededError specifically to notify caller of storage failures
   */
  saveCart(cart: CartItem[]): void {
    if (!this.isBrowser()) {
      return;
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(cart));
    } catch (error) {
      // Check for storage quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded - cart data could not be saved');
        throw error; // Re-throw so caller knows save failed
      }
      console.error('Error saving cart data to localStorage:', error);
      throw error; // Re-throw other errors as well
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
   * Validates input and enforces cart size limits
   */
  addItem(item: CartItem): void {
    // Validate required fields
    if (!item.productId || !item.name || !item.image) {
      console.error('Invalid cart item: missing required fields (productId, name, or image)', item);
      return;
    }

    // Validate quantity is positive and finite
    if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
      console.error('Invalid cart item: quantity must be a positive finite number', item);
      return;
    }

    // Validate price is non-negative and finite
    if (!Number.isFinite(item.price) || item.price < 0) {
      console.error('Invalid cart item: price must be a non-negative finite number', item);
      return;
    }

    const cart = this.getCart();
    const existingIndex = this.findItem(cart, item.productId, item.size, item.color);

    if (existingIndex >= 0) {
      // Item exists, merge quantities with max cap
      const newQuantity = cart[existingIndex].quantity + item.quantity;
      cart[existingIndex].quantity = Math.min(newQuantity, this.MAX_ITEM_QUANTITY);
    } else {
      // Check cart size limit before adding new item
      if (cart.length >= this.MAX_CART_ITEMS) {
        throw new Error(`Cart limit reached. Maximum ${this.MAX_CART_ITEMS} items allowed.`);
      }

      // Clone item to prevent external mutations
      const clonedItem: CartItem = {
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        ...(item.size && { size: item.size }),
        ...(item.color && { color: item.color }),
      };

      // New item, add to cart
      cart.push(clonedItem);
    }

    this.saveCart(cart);
  }

  /**
   * Update quantity of an existing cart item
   * Returns true if item was found and updated, false otherwise
   */
  updateQuantity(productId: string, quantity: number, size?: string, color?: string): boolean {
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
      return true;
    }

    // Item not found
    return false;
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
