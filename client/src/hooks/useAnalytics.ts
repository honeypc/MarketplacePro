import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalItems: number;
  averageOrderValue: number;
  dailyData: Array<{
    date: string;
    revenue: number;
    orders: number;
    items: number;
  }>;
  period: string;
}

export interface SalesData {
  totalSales: number;
  categoryBreakdown: Array<{
    category: string;
    revenue: number;
    quantity: number;
    orders: number;
  }>;
  period: string;
}

export interface ProductPerformance {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  isActive: boolean;
  totalSales: number;
  totalRevenue: number;
  avgRating: number;
  reviewCount: number;
  createdAt: Date;
}

export interface CustomerInsights {
  totalCustomers: number;
  repeatCustomers: number;
  customers: Array<{
    id: string;
    name: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
    firstOrderDate: Date;
    lastOrderDate: Date;
    averageOrderValue: number;
  }>;
}

export interface RevenueBreakdown {
  totalRevenue: number;
  platformFees: number;
  netRevenue: number;
  categoryBreakdown: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;
  period: string;
}

export function useSellerAnalytics(period: string = '30d') {
  const { user } = useAuth();
  
  return useQuery<AnalyticsData>({
    queryKey: ['/api/seller/analytics', period],
    queryFn: async () => {
      const response = await fetch(`/api/seller/analytics?period=${period}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    enabled: !!user && user.role === 'seller',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSellerSalesData(period: string = '30d') {
  const { user } = useAuth();
  
  return useQuery<SalesData>({
    queryKey: ['/api/seller/sales-data', period],
    queryFn: async () => {
      const response = await fetch(`/api/seller/sales-data?period=${period}`);
      if (!response.ok) throw new Error('Failed to fetch sales data');
      return response.json();
    },
    enabled: !!user && user.role === 'seller',
    staleTime: 5 * 60 * 1000,
  });
}

export function useSellerProductPerformance() {
  const { user } = useAuth();
  
  return useQuery<ProductPerformance[]>({
    queryKey: ['/api/seller/product-performance'],
    queryFn: async () => {
      const response = await fetch('/api/seller/product-performance');
      if (!response.ok) throw new Error('Failed to fetch product performance');
      return response.json();
    },
    enabled: !!user && user.role === 'seller',
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSellerCustomerInsights() {
  const { user } = useAuth();
  
  return useQuery<CustomerInsights>({
    queryKey: ['/api/seller/customer-insights'],
    queryFn: async () => {
      const response = await fetch('/api/seller/customer-insights');
      if (!response.ok) throw new Error('Failed to fetch customer insights');
      return response.json();
    },
    enabled: !!user && user.role === 'seller',
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useSellerRevenueBreakdown(period: string = '30d') {
  const { user } = useAuth();
  
  return useQuery<RevenueBreakdown>({
    queryKey: ['/api/seller/revenue-breakdown', period],
    queryFn: async () => {
      const response = await fetch(`/api/seller/revenue-breakdown?period=${period}`);
      if (!response.ok) throw new Error('Failed to fetch revenue breakdown');
      return response.json();
    },
    enabled: !!user && user.role === 'seller',
    staleTime: 5 * 60 * 1000,
  });
}