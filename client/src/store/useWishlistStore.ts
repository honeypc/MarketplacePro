import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  id: number;
  productId: number;
  title: string;
  price: string;
  images: string[];
  sellerId: string;
  addedAt: string;
}

interface WishlistStore {
  items: WishlistItem[];
  
  // Actions
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: number) => void;
  clearWishlist: () => void;
  
  // Getters
  isItemInWishlist: (productId: number) => boolean;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const state = get();
        const existingItem = state.items.find(i => i.productId === item.productId);
        
        if (!existingItem) {
          set(state => ({
            items: [...state.items, { ...item, addedAt: new Date().toISOString() }],
          }));
        }
      },
      
      removeItem: (productId) => {
        set(state => ({
          items: state.items.filter(item => item.productId !== productId),
        }));
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
      
      isItemInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId);
      },
      
      getWishlistCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);