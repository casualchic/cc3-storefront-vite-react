/**
 * Shopping Cart Store
 * Zustand store for managing cart state with persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartState, AddToCartParams, CartItem } from '../types/cart';

const CART_STORAGE_KEY = 'casual-chic-cart';

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, subtotal };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subtotal: 0,
      isOpen: false,

      addItem: (params: AddToCartParams) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          item => item.productId === params.productId &&
                  item.variantId === params.variantId
        );

        let newItems: CartItem[];

        if (existingItemIndex > -1) {
          // Update quantity of existing item
          newItems = [...items];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + (params.quantity || 1)
          };
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${params.productId}-${params.variantId || 'default'}-${Date.now()}`,
            productId: params.productId,
            variantId: params.variantId,
            handle: params.handle,
            name: params.name,
            price: params.price,
            compareAtPrice: params.compareAtPrice,
            quantity: params.quantity || 1,
            image: params.image,
            variantTitle: params.variantTitle,
            brand: params.brand
          };
          newItems = [...items, newItem];
        }

        const totals = calculateTotals(newItems);
        set({
          items: newItems,
          ...totals,
          isOpen: true // Open cart when item is added
        });
      },

      removeItem: (id: string) => {
        const items = get().items.filter(item => item.id !== id);
        const totals = calculateTotals(items);
        set({ items, ...totals });
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const items = get().items.map(item =>
          item.id === id ? { ...item, quantity } : item
        );
        const totals = calculateTotals(items);
        set({ items, ...totals });
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, subtotal: 0 });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      }
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Only persist cart items, not UI state
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        subtotal: state.subtotal
      })
    }
  )
);
