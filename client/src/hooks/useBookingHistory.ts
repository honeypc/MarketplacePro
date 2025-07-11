import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function useBookingHistory(userType: 'guest' | 'host' = 'guest') {
  return useQuery({
    queryKey: ['booking-history', userType],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/booking-history?userType=${userType}`);
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBookingDetails(id: number) {
  return useQuery({
    queryKey: ['booking-details', id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/bookings/${id}/details`);
      return response.json();
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, checkInOut }: { id: number; status: string; checkInOut?: any }) => {
      const response = await apiRequest('PUT', `/api/bookings/${id}/status`, {
        status,
        checkInOut
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-history'] });
      queryClient.invalidateQueries({ queryKey: ['booking-details'] });
    },
  });
}