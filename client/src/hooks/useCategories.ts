import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
}

export function useCategories() {
  return useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: ["/api/categories", id],
    queryFn: async () => {
      const response = await fetch(`/api/categories/${id}`);
      if (!response.ok) throw new Error("Failed to fetch category");
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
      const res = await apiRequest("POST", "/api/categories", categoryData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}

export function useUpdateCategory() {
  return useMutation({
    mutationFn: async ({ id, ...categoryData }: Partial<Category> & { id: number }) => {
      const res = await apiRequest("PUT", `/api/categories/${id}`, categoryData);
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories", variables.id] });
    },
  });
}

export function useDeleteCategory() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}