import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "./useAuth";

export interface CartItem {
  id: number;
  userId: string;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: number;
    title: string;
    price: string;
    images: string[];
    sellerId: string;
  };
}

export function useCart() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["/api/cart"],
    queryFn: async () => {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");
      return response.json();
    },
    enabled: !!user,
  });
}

export function useAddToCart() {
  return useMutation({
    mutationFn: async (item: { productId: number; quantity: number }) => {
      const res = await apiRequest("POST", "/api/cart", item);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });
}

export function useUpdateCartItem() {
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const res = await apiRequest("PUT", `/api/cart/${id}`, { quantity });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });
}

export function useRemoveFromCart() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });
}

export function useClearCart() {
  return useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });
}