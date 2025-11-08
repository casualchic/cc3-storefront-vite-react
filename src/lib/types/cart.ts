/**
 * Shopping Cart Types
 * Defines the data structures for cart functionality
 */

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  handle: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  image?: string;
  variantTitle?: string;
  brand: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface AddToCartParams {
  productId: string;
  variantId?: string;
  handle: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  quantity?: number;
  image?: string;
  variantTitle?: string;
  brand: string;
}

export interface UpdateCartItemParams {
  id: string;
  quantity: number;
}

export interface CartState extends Cart {
  addItem: (params: AddToCartParams) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}
