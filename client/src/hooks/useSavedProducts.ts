import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "./useAuth";

export interface SavedProduct {
  id: number;
  userId: string;
  productId: number;
  note?: string;
  tags: string[];
  savedAt: string;
  updatedAt: string;
  product?: {
    id: number;
    title: string;
    price: string;
    images: string[];
    sellerId: string;
  };
}

export interface CreateSavedProductInput {
  productId: number;
  note?: string;
  tags?: string[];
}

export interface UpdateSavedProductInput {
  note?: string;
  tags?: string[];
}

export function useSavedProducts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["/api/saved-products"],
    queryFn: async () => {
      const response = await fetch("/api/saved-products");
      if (!response.ok) throw new Error("Failed to fetch saved products");
      return response.json() as Promise<SavedProduct[]>;
    },
    enabled: !!user,
  });
}

export function useCreateSavedProduct() {
  return useMutation({
    mutationFn: async (data: CreateSavedProductInput) => {
      const res = await apiRequest("POST", "/api/saved-products", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-products"] });
    },
  });
}

export function useUpdateSavedProduct() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateSavedProductInput }) => {
      const res = await apiRequest("PUT", `/api/saved-products/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-products"] });
    },
  });
}

export function useDeleteSavedProduct() {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/saved-products/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-products"] });
    },
  });
}
