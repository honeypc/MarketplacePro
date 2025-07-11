import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "./useAuth";

export interface WishlistItem {
  id: number;
  userId: string;
  productId: number;
  createdAt: string;
  product?: {
    id: number;
    title: string;
    price: string;
    images: string[];
    sellerId: string;
  };
}

export function useWishlist() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["/api/wishlist"],
    queryFn: async () => {
      const response = await fetch("/api/wishlist");
      if (!response.ok) throw new Error("Failed to fetch wishlist");
      return response.json();
    },
    enabled: !!user,
  });
}

export function useAddToWishlist() {
  return useMutation({
    mutationFn: async (productId: number) => {
      const res = await apiRequest("POST", "/api/wishlist", { productId });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
    },
  });
}

export function useRemoveFromWishlist() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/wishlist/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
    },
  });
}

export function useIsInWishlist(productId: number) {
  const { data: wishlist } = useWishlist();
  return wishlist?.some((item: WishlistItem) => item.productId === productId) || false;
}