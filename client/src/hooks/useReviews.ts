import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export interface Review {
  id: number;
  userId: string;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
  };
}

export function useProductReviews(productId: number) {
  return useQuery({
    queryKey: ["/api/reviews", "product", productId],
    queryFn: async () => {
      const response = await fetch(`/api/reviews/product/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    },
    enabled: !!productId,
  });
}

export function useUserReviews() {
  return useQuery({
    queryKey: ["/api/reviews", "user"],
    queryFn: async () => {
      const response = await fetch("/api/reviews/user");
      if (!response.ok) throw new Error("Failed to fetch user reviews");
      return response.json();
    },
  });
}

export function useCreateReview() {
  return useMutation({
    mutationFn: async (reviewData: {
      productId: number;
      rating: number;
      comment: string;
    }) => {
      const res = await apiRequest("POST", "/api/reviews", reviewData);
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", "product", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", "user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products", variables.productId] });
    },
  });
}

export function useUpdateReview() {
  return useMutation({
    mutationFn: async ({ id, ...reviewData }: Partial<Review> & { id: number }) => {
      const res = await apiRequest("PUT", `/api/reviews/${id}`, reviewData);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", "product", data.productId] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", "user"] });
    },
  });
}

export function useDeleteReview() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
    },
  });
}