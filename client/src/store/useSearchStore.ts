import { create } from 'zustand';

interface SearchFilters {
  query: string;
  categoryId: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: 'price' | 'created' | 'rating' | 'name';
  sortOrder: 'asc' | 'desc';
  inStock: boolean;
  rating: number | null;
}

interface SearchStore {
  filters: SearchFilters;
  recentSearches: string[];
  searchHistory: string[];
  
  // Actions
  setQuery: (query: string) => void;
  setCategory: (categoryId: number | null) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setSort: (sortBy: SearchFilters['sortBy'], sortOrder: SearchFilters['sortOrder']) => void;
  setInStock: (inStock: boolean) => void;
  setRating: (rating: number | null) => void;
  
  clearFilters: () => void;
  resetSearch: () => void;
  
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  
  // Getters
  hasActiveFilters: () => boolean;
  getFilterCount: () => number;
}

const defaultFilters: SearchFilters = {
  query: '',
  categoryId: null,
  minPrice: null,
  maxPrice: null,
  sortBy: 'created',
  sortOrder: 'desc',
  inStock: false,
  rating: null,
};

export const useSearchStore = create<SearchStore>((set, get) => ({
  filters: defaultFilters,
  recentSearches: [],
  searchHistory: [],
  
  setQuery: (query) => {
    set(state => ({
      filters: { ...state.filters, query },
    }));
    
    // Add to search history if not empty
    if (query.trim()) {
      const state = get();
      const newHistory = [query, ...state.searchHistory.filter(h => h !== query)].slice(0, 10);
      set({ searchHistory: newHistory });
    }
  },
  
  setCategory: (categoryId) => {
    set(state => ({
      filters: { ...state.filters, categoryId },
    }));
  },
  
  setPriceRange: (min, max) => {
    set(state => ({
      filters: { ...state.filters, minPrice: min, maxPrice: max },
    }));
  },
  
  setSort: (sortBy, sortOrder) => {
    set(state => ({
      filters: { ...state.filters, sortBy, sortOrder },
    }));
  },
  
  setInStock: (inStock) => {
    set(state => ({
      filters: { ...state.filters, inStock },
    }));
  },
  
  setRating: (rating) => {
    set(state => ({
      filters: { ...state.filters, rating },
    }));
  },
  
  clearFilters: () => {
    set(state => ({
      filters: { ...defaultFilters, query: state.filters.query },
    }));
  },
  
  resetSearch: () => {
    set({ filters: defaultFilters });
  },
  
  addToSearchHistory: (query) => {
    if (!query.trim()) return;
    
    const state = get();
    const newHistory = [query, ...state.searchHistory.filter(h => h !== query)].slice(0, 10);
    set({ searchHistory: newHistory });
  },
  
  clearSearchHistory: () => {
    set({ searchHistory: [] });
  },
  
  hasActiveFilters: () => {
    const { filters } = get();
    return !!(
      filters.categoryId ||
      filters.minPrice !== null ||
      filters.maxPrice !== null ||
      filters.inStock ||
      filters.rating !== null
    );
  },
  
  getFilterCount: () => {
    const { filters } = get();
    let count = 0;
    
    if (filters.categoryId) count++;
    if (filters.minPrice !== null || filters.maxPrice !== null) count++;
    if (filters.inStock) count++;
    if (filters.rating !== null) count++;
    
    return count;
  },
}));