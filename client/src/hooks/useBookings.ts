import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Booking, InsertBooking } from '@shared/schema';

export function useBookings(type: 'guest' | 'host' = 'guest') {
  return useQuery({
    queryKey: ['/api/bookings', { type }],
    queryFn: async () => {
      const response = await fetch(`/api/bookings?type=${type}`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },
  });
}

export function useBooking(id: number) {
  return useQuery({
    queryKey: ['/api/bookings', id],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/${id}`);
      if (!response.ok) throw new Error('Failed to fetch booking');
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (bookingData: InsertBooking) => {
      const response = await apiRequest('POST', '/api/bookings', bookingData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      toast({
        title: 'Booking created',
        description: 'Your booking has been successfully created.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error creating booking',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Booking>) => {
      const response = await apiRequest('PUT', `/api/bookings/${id}`, data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings', data.id] });
      toast({
        title: 'Booking updated',
        description: 'Your booking has been successfully updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating booking',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const response = await apiRequest('POST', `/api/bookings/${id}/cancel`, { reason });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      toast({
        title: 'Booking cancelled',
        description: 'Your booking has been successfully cancelled.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error cancelling booking',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}