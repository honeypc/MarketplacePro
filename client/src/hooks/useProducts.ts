import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export interface Product {
  id: number;
  sellerId: string;
  title: string;
  description: string;
  price: string;
  categoryId: number;
  images: string[];
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  categoryId?: number;
  sellerId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
  sortBy?: 'price' | 'created' | 'rating';
  sortOrder?: 'asc' | 'desc';
  excludeId?: number;
}

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ["/api/products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
      }
      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["/api/products", id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      const res = await apiRequest("POST", "/api/products", productData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: async ({ id, ...productData }: Partial<Product> & { id: number }) => {
      const res = await apiRequest("PUT", `/api/products/${id}`, productData);
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products", variables.id] });
    },
  });
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });
}