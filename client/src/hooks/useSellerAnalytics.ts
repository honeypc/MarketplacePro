import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export const useSellerAnalytics = (sellerId: string, period: string = '30d') => {
  return useQuery({
    queryKey: ['/api/seller/analytics', sellerId, period],
    queryFn: () => apiRequest('GET', `/api/seller/analytics?sellerId=${sellerId}&period=${period}`).then(res => res.json()),
    enabled: !!sellerId
  });
};

export const useSellerProducts = (sellerId: string) => {
  return useQuery({
    queryKey: ['/api/seller/products', sellerId],
    queryFn: () => apiRequest('GET', `/api/seller/products?sellerId=${sellerId}`).then(res => res.json()),
    enabled: !!sellerId
  });
};

export const useSellerOrders = (sellerId: string) => {
  return useQuery({
    queryKey: ['/api/seller/orders', sellerId],
    queryFn: () => apiRequest('GET', `/api/seller/orders?sellerId=${sellerId}`).then(res => res.json()),
    enabled: !!sellerId
  });
};

export const useSellerInventory = (sellerId: string) => {
  return useQuery({
    queryKey: ['/api/seller/inventory', sellerId],
    queryFn: () => apiRequest('GET', `/api/seller/inventory?sellerId=${sellerId}`).then(res => res.json()),
    enabled: !!sellerId
  });
};

export const useSellerPerformance = (sellerId: string, period: string = '30d') => {
  return useQuery({
    queryKey: ['/api/seller/performance', sellerId, period],
    queryFn: () => apiRequest('GET', `/api/seller/performance?sellerId=${sellerId}&period=${period}`).then(res => res.json()),
    enabled: !!sellerId
  });
};