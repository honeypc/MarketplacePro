import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Property, InsertProperty } from '@shared/schema';

export function useProperties(filters?: any) {
  return useQuery({
    queryKey: ['/api/properties', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });
      }
      const response = await fetch(`/api/properties?${params}`);
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    },
  });
}

export function useSearchProperties(filters?: any) {
  return useQuery({
    queryKey: ['/api/properties/search', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              value.forEach(v => params.append(key, String(v)));
            } else {
              params.append(key, String(value));
            }
          }
        });
      }
      const response = await fetch(`/api/properties/search?${params}`);
      if (!response.ok) throw new Error('Failed to search properties');
      return response.json();
    },
    enabled: !!filters,
  });
}

export function useProperty(id: number) {
  return useQuery({
    queryKey: ['/api/properties', id],
    queryFn: async () => {
      const response = await fetch(`/api/properties/${id}`);
      if (!response.ok) throw new Error('Failed to fetch property');
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (propertyData: InsertProperty) => {
      const response = await apiRequest('POST', '/api/properties', propertyData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({
        title: 'Property created',
        description: 'Your property has been successfully created.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error creating property',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Property>) => {
      const response = await apiRequest('PUT', `/api/properties/${id}`, data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/properties', data.id] });
      toast({
        title: 'Property updated',
        description: 'Your property has been successfully updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating property',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/properties/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({
        title: 'Property deleted',
        description: 'Your property has been successfully deleted.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error deleting property',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function usePropertiesByHost(hostId: string) {
  return useQuery({
    queryKey: ['/api/users', hostId, 'properties'],
    queryFn: async () => {
      const response = await fetch(`/api/users/${hostId}/properties`);
      if (!response.ok) throw new Error('Failed to fetch host properties');
      return response.json();
    },
    enabled: !!hostId,
  });
}