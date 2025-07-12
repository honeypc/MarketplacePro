import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function useAdvancedSellerAnalytics(period: string = '30d') {
  return useQuery({
    queryKey: ['/api/seller/advanced-analytics', period],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/seller/advanced-analytics?period=${period}`);
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Refresh every minute
  });
}

export function useRealTimeMetrics() {
  return useQuery({
    queryKey: ['/api/seller/real-time-metrics'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/seller/real-time-metrics');
      return response.json();
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
  });
}

export function useProductAnalytics(productId?: number) {
  return useQuery({
    queryKey: ['/api/seller/product-analytics', productId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/seller/product-analytics${productId ? `?productId=${productId}` : ''}`);
      return response.json();
    },
    enabled: !!productId || productId === undefined,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCustomerAnalytics(period: string = '30d') {
  return useQuery({
    queryKey: ['/api/seller/customer-analytics', period],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/seller/customer-analytics?period=${period}`);
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useInventoryAnalytics() {
  return useQuery({
    queryKey: ['/api/seller/inventory-analytics'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/seller/inventory-analytics');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCompetitorAnalytics(categoryId?: number) {
  return useQuery({
    queryKey: ['/api/seller/competitor-analytics', categoryId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/seller/competitor-analytics${categoryId ? `?categoryId=${categoryId}` : ''}`);
      return response.json();
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!categoryId || categoryId === undefined,
  });
}

export function usePerformanceGoals() {
  return useQuery({
    queryKey: ['/api/seller/performance-goals'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/seller/performance-goals');
      return response.json();
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useMarketTrends(period: string = '30d') {
  return useQuery({
    queryKey: ['/api/seller/market-trends', period],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/seller/market-trends?period=${period}`);
      return response.json();
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useAIInsights() {
  return useQuery({
    queryKey: ['/api/seller/ai-insights'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/seller/ai-insights');
      return response.json();
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useExportAnalytics() {
  const exportData = async (format: 'csv' | 'pdf' | 'xlsx', period: string = '30d') => {
    const response = await apiRequest('GET', `/api/seller/export-analytics?format=${format}&period=${period}`);
    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${period}-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return { exportData };
}