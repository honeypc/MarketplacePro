import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { UserPreferences, UserInteraction, Recommendation, Product, Property } from '@shared/schema';

// Hook for user preferences
export function useUserPreferences() {
  return useQuery<UserPreferences>({
    queryKey: ['/api/recommendations/preferences'],
    retry: false,
  });
}

// Hook for updating user preferences
export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (preferences: Partial<UserPreferences>) => {
      const response = await apiRequest('POST', '/api/recommendations/preferences', preferences);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations/preferences'] });
    },
  });
}

// Hook for tracking user interactions
export function useTrackInteraction() {
  return useMutation({
    mutationFn: async (interaction: {
      userId: string;
      itemType: 'product' | 'property' | 'destination';
      itemId: string;
      actionType: 'view' | 'like' | 'share' | 'purchase' | 'book';
      duration?: number;
      metadata?: any;
    }) => {
      const response = await apiRequest('POST', '/api/recommendations/interactions', interaction);
      return response.json();
    },
  });
}

// Hook for personalized product recommendations
export function usePersonalizedProducts() {
  return useQuery<Product[]>({
    queryKey: ['/api/recommendations/products'],
    retry: false,
  });
}

// Hook for personalized property recommendations
export function usePersonalizedProperties() {
  return useQuery<Property[]>({
    queryKey: ['/api/recommendations/properties'],
    retry: false,
  });
}

// Hook for personalized destination recommendations
export function usePersonalizedDestinations() {
  return useQuery<any[]>({
    queryKey: ['/api/recommendations/destinations'],
    retry: false,
  });
}

// Hook for generating recommendations
export function useGenerateRecommendations() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/recommendations/generate');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate all recommendation queries
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations/destinations'] });
    },
  });
}

// Hook for popular items
export function usePopularItems(itemType: 'product' | 'property' | 'destination', limit: number = 10) {
  return useQuery<any[]>({
    queryKey: ['/api/recommendations/popular', itemType, limit],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/recommendations/popular/${itemType}?limit=${limit}`);
      return response.json();
    },
  });
}

// Hook for trending items
export function useTrendingItems(itemType: 'product' | 'property' | 'destination', days: number = 7, limit: number = 10) {
  return useQuery<any[]>({
    queryKey: ['/api/recommendations/trending', itemType, days, limit],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/recommendations/trending/${itemType}?days=${days}&limit=${limit}`);
      return response.json();
    },
  });
}

// Hook for marking recommendation clicked
export function useMarkRecommendationClicked() {
  return useMutation({
    mutationFn: async (recommendationId: number) => {
      const response = await apiRequest('POST', `/api/recommendations/${recommendationId}/click`);
      return response.json();
    },
  });
}

// Combined hook for all recommendation data
export function useRecommendationData() {
  const personalizedProducts = usePersonalizedProducts();
  const personalizedProperties = usePersonalizedProperties();
  const personalizedDestinations = usePersonalizedDestinations();
  const preferences = useUserPreferences();
  
  return {
    products: personalizedProducts.data || [],
    properties: personalizedProperties.data || [],
    destinations: personalizedDestinations.data || [],
    preferences: preferences.data,
    isLoading: personalizedProducts.isLoading || personalizedProperties.isLoading || personalizedDestinations.isLoading,
    error: personalizedProducts.error || personalizedProperties.error || personalizedDestinations.error,
  };
}

// Advanced recommendation hooks
export function useCollaborativeRecommendations(itemType: 'product' | 'property' | 'destination', limit: number = 20) {
  return useQuery<any[]>({
    queryKey: ['/api/recommendations/collaborative', itemType, limit],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/recommendations/collaborative/${itemType}?limit=${limit}`);
      return response.json();
    },
    retry: false,
  });
}

export function useHybridRecommendations(itemType: 'product' | 'property' | 'destination', limit: number = 20) {
  return useQuery<any[]>({
    queryKey: ['/api/recommendations/hybrid', itemType, limit],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/recommendations/hybrid/${itemType}?limit=${limit}`);
      return response.json();
    },
    retry: false,
  });
}

export function useRecommendationFeedback() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ recommendationId, feedback }: { recommendationId: number; feedback: 'positive' | 'negative' | 'neutral' }) => {
      const response = await apiRequest('POST', `/api/recommendations/${recommendationId}/feedback`, { feedback });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
    },
  });
}

export function useRecommendationPerformance(itemType?: string, days: number = 30) {
  return useQuery<any>({
    queryKey: ['/api/recommendations/performance', itemType, days],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (itemType) params.append('itemType', itemType);
      params.append('days', days.toString());
      
      const response = await apiRequest('GET', `/api/recommendations/performance?${params}`);
      return response.json();
    },
    retry: false,
  });
}

export function useSeasonalRecommendations(season: string) {
  return useQuery<any[]>({
    queryKey: ['/api/recommendations/seasonal', season],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/recommendations/seasonal/${season}`);
      return response.json();
    },
    retry: false,
  });
}

export function useContextualRecommendations() {
  return useMutation({
    mutationFn: async (context: {
      location?: string;
      timeOfDay?: string;
      weather?: string;
      occasion?: string;
    }) => {
      const response = await apiRequest('POST', '/api/recommendations/contextual', context);
      return response.json();
    },
  });
}

export function useUpdateRecommendationScores() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/recommendations/update-scores');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
    },
  });
}

export function useSimilarUsers(limit: number = 10) {
  return useQuery<string[]>({
    queryKey: ['/api/recommendations/similar-users', limit],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/recommendations/similar-users?limit=${limit}`);
      return response.json();
    },
    retry: false,
  });
}

// Machine Learning enhancement hooks
export function useMLRecommendations(algorithm: 'collaborative' | 'hybrid' | 'seasonal' | 'contextual') {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: any) => {
      const endpoints = {
        collaborative: '/api/recommendations/collaborative/product',
        hybrid: '/api/recommendations/hybrid/product',
        seasonal: '/api/recommendations/seasonal/summer',
        contextual: '/api/recommendations/contextual'
      };
      
      const response = await apiRequest('GET', endpoints[algorithm], params);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
    },
  });
}

// Real-time recommendation updates
export function useRealTimeRecommendations() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userAction: {
      action: 'view' | 'like' | 'purchase' | 'share';
      itemType: 'product' | 'property' | 'destination';
      itemId: string;
    }) => {
      // Track the interaction
      await apiRequest('POST', '/api/recommendations/interactions', {
        userId: 'current-user',
        itemType: userAction.itemType,
        itemId: userAction.itemId,
        actionType: userAction.action,
        duration: 0
      });
      
      // Update recommendation scores
      await apiRequest('POST', '/api/recommendations/update-scores');
      
      return { success: true };
    },
    onSuccess: () => {
      // Refresh all recommendations
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
    },
  });
}