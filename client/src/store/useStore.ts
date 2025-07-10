import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, WishlistItem } from '@shared/schema';

interface CartItemWithProduct extends CartItem {
  product?: Product;
}

interface WishlistItemWithProduct extends WishlistItem {
  product?: Product;
}

interface AppStore {
  // Cart state
  cartItems: CartItemWithProduct[];
  cartCount: number;
  cartTotal: number;
  
  // Wishlist state
  wishlistItems: WishlistItemWithProduct[];
  wishlistCount: number;
  
  // UI state
  isCartOpen: boolean;
  isProductModalOpen: boolean;
  selectedProduct: Product | null;
  searchQuery: string;
  selectedCategory: number | null;
  
  // Actions
  setCartItems: (items: CartItemWithProduct[]) => void;
  setWishlistItems: (items: WishlistItemWithProduct[]) => void;
  updateCartCount: () => void;
  updateWishlistCount: () => void;
  updateCartTotal: () => void;
  
  // UI Actions
  toggleCart: () => void;
  closeCart: () => void;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: number | null) => void;
  
  // Local cart management (for optimistic updates)
  addToLocalCart: (item: CartItemWithProduct) => void;
  removeFromLocalCart: (id: number) => void;
  updateLocalCartQuantity: (id: number, quantity: number) => void;
  
  // Local wishlist management
  addToLocalWishlist: (item: WishlistItemWithProduct) => void;
  removeFromLocalWishlist: (id: number) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      cartItems: [],
      cartCount: 0,
      cartTotal: 0,
      wishlistItems: [],
      wishlistCount: 0,
      isCartOpen: false,
      isProductModalOpen: false,
      selectedProduct: null,
      searchQuery: '',
      selectedCategory: null,
      
      // State setters
      setCartItems: (items) => {
        set({ cartItems: items });
        get().updateCartCount();
        get().updateCartTotal();
      },
      
      setWishlistItems: (items) => {
        set({ wishlistItems: items });
        get().updateWishlistCount();
      },
      
      updateCartCount: () => {
        const { cartItems } = get();
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        set({ cartCount: count });
      },
      
      updateWishlistCount: () => {
        const { wishlistItems } = get();
        set({ wishlistCount: wishlistItems.length });
      },
      
      updateCartTotal: () => {
        const { cartItems } = get();
        const total = cartItems.reduce((sum, item) => {
          const price = item.product?.price ? parseFloat(item.product.price) : 0;
          return sum + (price * item.quantity);
        }, 0);
        set({ cartTotal: total });
      },
      
      // UI Actions
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      closeCart: () => set({ isCartOpen: false }),
      
      openProductModal: (product) => set({ 
        selectedProduct: product, 
        isProductModalOpen: true 
      }),
      closeProductModal: () => set({ 
        selectedProduct: null, 
        isProductModalOpen: false 
      }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
      
      // Local cart management
      addToLocalCart: (item) => {
        const { cartItems } = get();
        const existingItem = cartItems.find(
          (cartItem) => cartItem.productId === item.productId
        );
        
        if (existingItem) {
          get().updateLocalCartQuantity(existingItem.id, existingItem.quantity + item.quantity);
        } else {
          const newItems = [...cartItems, item];
          get().setCartItems(newItems);
        }
      },
      
      removeFromLocalCart: (id) => {
        const { cartItems } = get();
        const newItems = cartItems.filter(item => item.id !== id);
        get().setCartItems(newItems);
      },
      
      updateLocalCartQuantity: (id, quantity) => {
        const { cartItems } = get();
        const newItems = cartItems.map(item => 
          item.id === id ? { ...item, quantity } : item
        );
        get().setCartItems(newItems);
      },
      
      // Local wishlist management
      addToLocalWishlist: (item) => {
        const { wishlistItems } = get();
        const newItems = [...wishlistItems, item];
        get().setWishlistItems(newItems);
      },
      
      removeFromLocalWishlist: (id) => {
        const { wishlistItems } = get();
        const newItems = wishlistItems.filter(item => item.id !== id);
        get().setWishlistItems(newItems);
      },
    }),
    {
      name: 'marketplace-store',
      partialize: (state) => ({
        cartItems: state.cartItems,
        wishlistItems: state.wishlistItems,
        searchQuery: state.searchQuery,
        selectedCategory: state.selectedCategory,
      }),
    }
  )
);
