import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { CartItem } from '../types';
import { DiscountCode, validateDiscountCode, calculateDiscount } from '../data/mockDiscounts';

export interface AppliedDiscount {
  code: string;
  amount: number;
  description: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  // Drawer state
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  // Discount state
  appliedDiscount: AppliedDiscount | null;
  applyDiscount: (code: string) => { success: boolean; error?: string };
  removeDiscount: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cc3-cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Load cart from localStorage on mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<{code: string; discount: DiscountCode} | null>(null);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.size === item.size &&
          cartItem.color === item.color
      );

      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += item.quantity || 1;
        return newCart;
      } else {
        // Add new item
        return [...prevCart, { ...item, quantity: item.quantity || 1 }];
      }
    });
    setIsDrawerOpen(true);
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item.productId === productId && item.size === size && item.color === color)
      )
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  // Calculate discount dynamically based on current cart total
  const appliedDiscount = useMemo(() => {
    if (!appliedDiscountCode) return null;
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const amount = calculateDiscount(appliedDiscountCode.discount, subtotal);
    return {
      code: appliedDiscountCode.code,
      amount,
      description: appliedDiscountCode.discount.description,
    };
  }, [appliedDiscountCode, cart]);

  const applyDiscount = (code: string): { success: boolean; error?: string } => {
    const result = validateDiscountCode(code);

    if (!result.valid || !result.discount) {
      return { success: false, error: result.error || 'Invalid discount code' };
    }

    setAppliedDiscountCode({
      code: code.toUpperCase(),
      discount: result.discount,
    });

    return { success: true };
  };

  const removeDiscount = () => {
    setAppliedDiscountCode(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addItem: addToCart, // Alias for compatibility
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        appliedDiscount,
        applyDiscount,
        removeDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
