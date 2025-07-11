import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  productId: number;
  title: string;
  price: string;
  quantity: number;
  images: string[];
  sellerId: string;
  stockQuantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Getters
  getItemQuantity: (productId: number) => number;
  isItemInCart: (productId: number) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,
      
      addItem: (item) => {
        const state = get();
        const existingItem = state.items.find(i => i.productId === item.productId);
        
        if (existingItem) {
          // Update existing item quantity
          set(state => ({
            items: state.items.map(i =>
              i.productId === item.productId
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, item.stockQuantity) }
                : i
            ),
          }));
        } else {
          // Add new item
          set(state => ({
            items: [...state.items, { ...item, quantity: Math.min(item.quantity, item.stockQuantity) }],
          }));
        }
        
        // Update totals
        const newState = get();
        set({
          totalItems: newState.items.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newState.items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0),
        });
      },
      
      removeItem: (productId) => {
        set(state => ({
          items: state.items.filter(item => item.productId !== productId),
        }));
        
        // Update totals
        const newState = get();
        set({
          totalItems: newState.items.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newState.items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0),
        });
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set(state => ({
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity: Math.min(quantity, item.stockQuantity) }
              : item
          ),
        }));
        
        // Update totals
        const newState = get();
        set({
          totalItems: newState.items.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newState.items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0),
        });
      },
      
      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },
      
      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },
      
      openCart: () => {
        set({ isOpen: true });
      },
      
      closeCart: () => {
        set({ isOpen: false });
      },
      
      getItemQuantity: (productId) => {
        const item = get().items.find(i => i.productId === productId);
        return item ? item.quantity : 0;
      },
      
      isItemInCart: (productId) => {
        return get().items.some(item => item.productId === productId);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      }),
    }
  )
);