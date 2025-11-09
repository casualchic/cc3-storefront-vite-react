/**
 * Medusa Cart Store
 * Zustand store for managing Medusa cart with optimistic updates
 * Updated for Medusa v2 SDK with mock mode support
 */

import { create } from 'zustand';
import type { Cart, LineItem } from '../types/medusa';
import { sdk, getCartId, setCartId, clearCartId } from '../medusa/client';
import { mockProducts } from '../medusa/mock-data';

// Check if we're in mock mode (no backend configured)
// Force mock mode for development until backend is properly configured
const USE_MOCK_CART = true;

interface MedusaCartState {
  cart: Cart | null;
  isLoading: boolean;
  isOpen: boolean;
  error: string | null;

  // Actions
  initCart: () => Promise<void>;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateLineItem: (lineItemId: string, quantity: number) => Promise<void>;
  removeLineItem: (lineItemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

/**
 * Mock cart implementation for development
 */
function getMockCart(): Cart | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('mock_cart');
  if (!stored) return null;
  return JSON.parse(stored);
}

function saveMockCart(cart: Cart) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mock_cart', JSON.stringify(cart));
}

function createEmptyMockCart(): Cart {
  return {
    id: `mock_cart_${Date.now()}`,
    items: [],
    region_id: 'mock_region',
    region: null as any,
    customer_id: null,
    payment_sessions: [],
    payment: null,
    shipping_methods: [],
    total: 0,
    subtotal: 0,
    tax_total: 0,
    shipping_total: 0,
    discount_total: 0,
    gift_card_total: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function calculateMockCartTotals(cart: Cart): Cart {
  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.unit_price || 0;
    return sum + (price * item.quantity);
  }, 0);

  return {
    ...cart,
    subtotal,
    total: subtotal, // For now, total = subtotal (no tax/shipping in mock)
    updated_at: new Date().toISOString(),
  };
}

export const useMedusaCartStore = create<MedusaCartState>((set, get) => ({
  cart: null,
  isLoading: false,
  isOpen: false,
  error: null,

  /**
   * Initialize or retrieve cart
   */
  initCart: async () => {
    if (USE_MOCK_CART) {
      console.log('[DEV MODE] Using mock cart');
      const mockCart = getMockCart() || createEmptyMockCart();
      set({ cart: mockCart, isLoading: false });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      const existingCartId = getCartId();

      if (existingCartId) {
        try {
          const { cart } = await sdk.store.cart.retrieve(existingCartId);
          set({ cart, isLoading: false });
        } catch (err) {
          console.warn('Cart not found, creating new cart');
          const { cart: newCart } = await sdk.store.cart.create({});
          setCartId(newCart.id);
          set({ cart: newCart, isLoading: false });
        }
      } else {
        const { cart: newCart } = await sdk.store.cart.create({});
        setCartId(newCart.id);
        set({ cart: newCart, isLoading: false });
      }
    } catch (err) {
      console.error('Failed to initialize cart:', err);
      set({ error: 'Failed to load cart', isLoading: false });
    }
  },

  /**
   * Add item to cart
   */
  addItem: async (variantId: string, quantity = 1) => {
    if (USE_MOCK_CART) {
      try {
        set({ error: null });

        let cart = get().cart;
        if (!cart) {
          cart = createEmptyMockCart();
        }

        // Find the product and variant from mock data
        const product = mockProducts.find(p =>
          p.variants?.some(v => v.id === variantId)
        );
        const variant = product?.variants?.find(v => v.id === variantId);

        if (!product || !variant) {
          throw new Error('Product or variant not found');
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(item =>
          item.variant_id === variantId
        );

        if (existingItemIndex >= 0) {
          // Update quantity of existing item
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          // Add new item to cart
          const newItem: LineItem = {
            id: `line_${Date.now()}`,
            cart_id: cart.id,
            title: product.title || 'Product',
            description: variant.title || '',
            thumbnail: product.thumbnail || product.images?.[0]?.url || null,
            variant_id: variantId,
            variant: variant,
            quantity: quantity,
            unit_price: variant.calculated_price?.calculated_amount || 0,
            subtotal: (variant.calculated_price?.calculated_amount || 0) * quantity,
            total: (variant.calculated_price?.calculated_amount || 0) * quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          cart.items.push(newItem);
        }

        // Recalculate totals
        cart = calculateMockCartTotals(cart);
        saveMockCart(cart);
        set({ cart, isOpen: true });

        console.log('[MOCK CART] Item added:', { variantId, quantity, itemCount: cart.items.length });
      } catch (err: any) {
        console.error('Failed to add item to mock cart:', err);
        set({ error: err.message || 'Failed to add item to cart' });
        throw err;
      }
      return;
    }

    // Real Medusa API implementation
    const cartId = getCartId();
    if (!cartId) {
      await get().initCart();
      return get().addItem(variantId, quantity);
    }

    try {
      set({ error: null });

      const { cart: updatedCart } = await sdk.store.cart.createLineItem(cartId, {
        variant_id: variantId,
        quantity,
      });

      set({ cart: updatedCart, isOpen: true });
    } catch (err: any) {
      console.error('Failed to add item:', err);
      const errorMessage = err?.message || 'Failed to add item to cart';
      set({ error: errorMessage });
      throw err;
    }
  },

  /**
   * Update line item quantity
   */
  updateLineItem: async (lineItemId: string, quantity: number) => {
    if (USE_MOCK_CART) {
      try {
        set({ error: null });
        let cart = get().cart;
        if (!cart) return;

        if (quantity === 0) {
          // Remove item
          cart.items = cart.items.filter(item => item.id !== lineItemId);
        } else {
          // Update quantity
          const item = cart.items.find(item => item.id === lineItemId);
          if (item) {
            item.quantity = quantity;
            item.subtotal = (item.unit_price || 0) * quantity;
            item.total = item.subtotal;
          }
        }

        cart = calculateMockCartTotals(cart);
        saveMockCart(cart);
        set({ cart });
      } catch (err: any) {
        console.error('Failed to update mock cart item:', err);
        set({ error: err.message || 'Failed to update quantity' });
      }
      return;
    }

    // Real Medusa API implementation
    const cartId = getCartId();
    if (!cartId) return;

    try {
      set({ error: null });

      if (quantity === 0) {
        await sdk.store.cart.deleteLineItem(cartId, lineItemId);
      } else {
        await sdk.store.cart.updateLineItem(cartId, lineItemId, {
          quantity,
        });
      }

      await get().refreshCart();
    } catch (err: any) {
      console.error('Failed to update quantity:', err);
      const errorMessage = err?.message || 'Failed to update quantity';
      set({ error: errorMessage });
    }
  },

  /**
   * Remove line item from cart
   */
  removeLineItem: async (lineItemId: string) => {
    if (USE_MOCK_CART) {
      return get().updateLineItem(lineItemId, 0);
    }

    const cartId = getCartId();
    if (!cartId) return;

    try {
      set({ error: null });
      await sdk.store.cart.deleteLineItem(cartId, lineItemId);
      await get().refreshCart();
    } catch (err: any) {
      console.error('Failed to remove item:', err);
      const errorMessage = err?.message || 'Failed to remove item';
      set({ error: errorMessage });
    }
  },

  /**
   * Refresh cart data
   */
  refreshCart: async () => {
    if (USE_MOCK_CART) {
      const mockCart = getMockCart();
      if (mockCart) {
        set({ cart: mockCart });
      }
      return;
    }

    const cartId = getCartId();
    if (!cartId) return;

    try {
      const { cart } = await sdk.store.cart.retrieve(cartId);
      set({ cart });
    } catch (err) {
      console.error('Failed to refresh cart:', err);
      set({ error: 'Failed to refresh cart' });
    }
  },

  /**
   * Clear cart (after checkout)
   */
  clearCart: () => {
    if (USE_MOCK_CART) {
      localStorage.removeItem('mock_cart');
      set({ cart: createEmptyMockCart(), isOpen: false });
      return;
    }

    clearCartId();
    set({ cart: null, isOpen: false });
    get().initCart();
  },

  /**
   * Toggle cart visibility
   */
  toggleCart: () => {
    set({ isOpen: !get().isOpen });
  },

  /**
   * Open cart
   */
  openCart: () => {
    set({ isOpen: true });
  },

  /**
   * Close cart
   */
  closeCart: () => {
    set({ isOpen: false });
  },
}));

// Helper function to get cart item count
export function getCartItemCount(cart: Cart | null): number {
  if (!cart?.items) return 0;
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

// Helper function to format cart total
export function formatCartTotal(cart: Cart | null): string {
  if (!cart) return '$0.00';
  const total = cart.total || 0;
  return `$${(total / 100).toFixed(2)}`;
}
