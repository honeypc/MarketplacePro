import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalProperties: number;
  newUsersThisMonth: number;
  activeProducts: number;
  activeProperties: number;
  revenue: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface SystemHealth {
  database: string;
  timestamp: string;
  uptime: number;
  memory: any;
  version: string;
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    retry: false,
  });
}

export function useAdminUsers() {
  return useQuery<AdminUser[]>({
    queryKey: ['/api/admin/users'],
    retry: false,
  });
}

export function useAdminRoles() {
  return useQuery<AdminRole[]>({
    queryKey: ['/api/admin/roles'],
    retry: false,
  });
}

export function useSystemHealth() {
  return useQuery<SystemHealth>({
    queryKey: ['/api/admin/health'],
    retry: false,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: any }) => {
      const response = await apiRequest('PUT', `/api/admin/users/${id}`, userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await apiRequest('PUT', `/api/admin/users/${id}/status`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'Success',
        description: 'User status updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useBulkUpdateUsers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userIds, updates }: { userIds: string[]; updates: any }) => {
      const response = await apiRequest('POST', '/api/admin/users/bulk-update', { userIds, updates });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'Success',
        description: 'Users updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useBulkDeleteUsers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userIds: string[]) => {
      await apiRequest('POST', '/api/admin/users/bulk-delete', { userIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: 'Success',
        description: 'Users deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useExportUsers() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest('GET', '/api/admin/export/users');
      const data = await response.json();
      
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.json';
      a.click();
      window.URL.revokeObjectURL(url);
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Users exported successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useExportProducts() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest('GET', '/api/admin/export/products');
      const data = await response.json();
      
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products.json';
      a.click();
      window.URL.revokeObjectURL(url);
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Products exported successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}