import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { WishlistItem } from '../types';

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'id'>) => void;
  removeItem: (id: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = window.localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('wishlist', JSON.stringify(items));
    } catch {
      // Ignore quota or security errors
    }
  }, [items]);

  const addItem = (item: Omit<WishlistItem, 'id'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) return prev;
      return [...prev, { ...item, id: `wishlist-${Date.now()}-${Math.random()}` }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.productId === productId);
  };

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
