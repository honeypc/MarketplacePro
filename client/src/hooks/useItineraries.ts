import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function useItineraries() {
  return useQuery({
    queryKey: ['/api/travel/itineraries'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/travel/itineraries');
      return response.json();
    },
  });
}

export function useItinerary(id: number) {
  return useQuery({
    queryKey: ['/api/travel/itineraries', id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/travel/itineraries/${id}`);
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateItinerary() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/travel/itineraries', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/travel/itineraries'] });
      toast({
        title: "Thành công",
        description: "Đã tạo lịch trình du lịch mới!"
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể tạo lịch trình du lịch",
        variant: "destructive"
      });
    }
  });
}

export function useUpdateItinerary() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest('PUT', `/api/travel/itineraries/${id}`, data);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/travel/itineraries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/travel/itineraries', variables.id] });
      toast({
        title: "Thành công",
        description: "Đã cập nhật lịch trình du lịch!"
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật lịch trình du lịch",
        variant: "destructive"
      });
    }
  });
}

export function useDeleteItinerary() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/travel/itineraries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/travel/itineraries'] });
      toast({
        title: "Thành công",
        description: "Đã xóa lịch trình du lịch!"
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể xóa lịch trình du lịch",
        variant: "destructive"
      });
    }
  });
}

export function useItineraryTemplates() {
  return useQuery({
    queryKey: ['/api/travel/templates'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/travel/templates');
      return response.json();
    },
  });
}

export function useCreateItineraryFromTemplate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ templateId, customizations }: { templateId: number; customizations: any }) => {
      const response = await apiRequest('POST', `/api/travel/templates/${templateId}/create-itinerary`, customizations);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/travel/itineraries'] });
      toast({
        title: "Thành công",
        description: "Đã tạo lịch trình từ mẫu!"
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể tạo lịch trình từ mẫu",
        variant: "destructive"
      });
    }
  });
}

export function useItineraryActivities(itineraryId: number) {
  return useQuery({
    queryKey: ['/api/travel/itineraries', itineraryId, 'activities'],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/travel/itineraries/${itineraryId}/activities`);
      return response.json();
    },
    enabled: !!itineraryId,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ itineraryId, dayId, activity }: { itineraryId: number; dayId: number; activity: any }) => {
      const response = await apiRequest('POST', `/api/travel/itineraries/${itineraryId}/days/${dayId}/activities`, activity);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/travel/itineraries', variables.itineraryId, 'activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/travel/itineraries', variables.itineraryId] });
      toast({
        title: "Thành công",
        description: "Đã thêm hoạt động mới!"
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể thêm hoạt động",
        variant: "destructive"
      });
    }
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ activityId, data }: { activityId: number; data: any }) => {
      const response = await apiRequest('PUT', `/api/travel/activities/${activityId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/travel/itineraries'] });
      toast({
        title: "Thành công",
        description: "Đã cập nhật hoạt động!"
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật hoạt động",
        variant: "destructive"
      });
    }
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (activityId: number) => {
      await apiRequest('DELETE', `/api/travel/activities/${activityId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/travel/itineraries'] });
      toast({
        title: "Thành công",
        description: "Đã xóa hoạt động!"
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể xóa hoạt động",
        variant: "destructive"
      });
    }
  });
}