import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  // Theme
  theme: 'light' | 'dark';
  primaryColor: string;
  
  // Language
  language: 'vi' | 'en' | 'ko' | 'ru' | 'ar';
  
  // UI States
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isFilterOpen: boolean;
  
  // Chat
  isChatOpen: boolean;
  unreadChatCount: number;
  
  // Loading states
  isLoading: boolean;
  loadingMessage: string;
  
  // Modals
  activeModal: string | null;
  modalData: any;
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  setPrimaryColor: (color: string) => void;
  setLanguage: (language: 'vi' | 'en' | 'ko' | 'ru' | 'ar') => void;
  
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  toggleFilter: () => void;
  
  openChat: () => void;
  closeChat: () => void;
  setUnreadChatCount: (count: number) => void;
  
  setLoading: (loading: boolean, message?: string) => void;
  
  openModal: (modalType: string, data?: any) => void;
  closeModal: () => void;
  
  // Getters
  isDarkMode: () => boolean;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      primaryColor: '#3b82f6', // blue-500
      
      // Language
      language: 'vi',
      
      // UI States
      isSidebarOpen: false,
      isMobileMenuOpen: false,
      isSearchOpen: false,
      isFilterOpen: false,
      
      // Chat
      isChatOpen: false,
      unreadChatCount: 0,
      
      // Loading states
      isLoading: false,
      loadingMessage: '',
      
      // Modals
      activeModal: null,
      modalData: null,
      
      // Actions
      setTheme: (theme) => {
        set({ theme });
        // Update document class for CSS
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },
      
      setPrimaryColor: (color) => {
        set({ primaryColor: color });
      },
      
      setLanguage: (language) => {
        set({ language });
      },
      
      toggleSidebar: () => {
        set(state => ({ isSidebarOpen: !state.isSidebarOpen }));
      },
      
      toggleMobileMenu: () => {
        set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
      },
      
      toggleSearch: () => {
        set(state => ({ isSearchOpen: !state.isSearchOpen }));
      },
      
      toggleFilter: () => {
        set(state => ({ isFilterOpen: !state.isFilterOpen }));
      },
      
      openChat: () => {
        set({ isChatOpen: true });
      },
      
      closeChat: () => {
        set({ isChatOpen: false });
      },
      
      setUnreadChatCount: (count) => {
        set({ unreadChatCount: count });
      },
      
      setLoading: (loading, message = '') => {
        set({ isLoading: loading, loadingMessage: message });
      },
      
      openModal: (modalType, data = null) => {
        set({ activeModal: modalType, modalData: data });
      },
      
      closeModal: () => {
        set({ activeModal: null, modalData: null });
      },
      
      isDarkMode: () => {
        return get().theme === 'dark';
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        primaryColor: state.primaryColor,
        language: state.language,
      }),
    }
  )
);