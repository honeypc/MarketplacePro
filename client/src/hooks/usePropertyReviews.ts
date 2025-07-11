import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { PropertyReview, InsertPropertyReview } from '@shared/schema';

export function usePropertyReviews(propertyId: number) {
  return useQuery({
    queryKey: ['/api/properties', propertyId, 'reviews'],
    queryFn: async () => {
      const response = await fetch(`/api/properties/${propertyId}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch property reviews');
      return response.json();
    },
    enabled: !!propertyId,
  });
}

export function useCreatePropertyReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ propertyId, ...reviewData }: { propertyId: number } & Omit<InsertPropertyReview, 'propertyId'>) => {
      const response = await apiRequest('POST', `/api/properties/${propertyId}/reviews`, reviewData);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties', variables.propertyId, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/properties', variables.propertyId] });
      toast({
        title: 'Review submitted',
        description: 'Your review has been successfully submitted.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error submitting review',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}