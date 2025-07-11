import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function useRoomAvailability(propertyId: number, startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['room-availability', propertyId, startDate, endDate],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/properties/${propertyId}/room-availability?startDate=${startDate}&endDate=${endDate}`);
      return response.json();
    },
    enabled: !!propertyId && !!startDate && !!endDate,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCheckRoomAvailability() {
  return useMutation({
    mutationFn: async (data: { propertyId: number; checkIn: string; checkOut: string; roomsNeeded: number }) => {
      const response = await apiRequest('POST', `/api/properties/${data.propertyId}/check-room-availability`, {
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        roomsNeeded: data.roomsNeeded
      });
      return response.json();
    },
  });
}

export function useUpdateRoomAvailability() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { propertyId: number; date: string; availableRooms: number; totalRooms: number; priceOverride?: number }) => {
      const response = await apiRequest('POST', `/api/properties/${data.propertyId}/room-availability`, {
        date: data.date,
        availableRooms: data.availableRooms,
        totalRooms: data.totalRooms,
        priceOverride: data.priceOverride
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['room-availability', variables.propertyId] });
    },
  });
}