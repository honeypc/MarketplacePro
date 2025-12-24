import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "./useAuth";

export interface RecentlyViewedProduct {
  id: number;
  userId: string;
  productId: number;
  viewedAt: string;
  duration?: number;
  metadata?: any;
  product?: {
    id: number;
    title: string;
    price: string;
    images: string[];
    sellerId: string;
  };
}

export interface TrackViewInput {
  productId: number;
  duration?: number;
  metadata?: any;
}

export function useRecentlyViewed(limit?: number) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["/api/recently-viewed", limit],
    queryFn: async () => {
      const url = limit
        ? `/api/recently-viewed?limit=${limit}`
        : "/api/recently-viewed";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch recently viewed products");
      return response.json() as Promise<RecentlyViewedProduct[]>;
    },
    enabled: !!user,
  });
}

export function useTrackProductView() {
  return useMutation({
    mutationFn: async (data: TrackViewInput) => {
      const res = await apiRequest("POST", "/api/recently-viewed", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recently-viewed"] });
    },
  });
}

export function useDeleteRecentlyViewed() {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/recently-viewed/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recently-viewed"] });
    },
  });
}
