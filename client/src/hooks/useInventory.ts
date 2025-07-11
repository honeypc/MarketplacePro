import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "./useAuth";

export interface InventoryAlert {
  id: number;
  productId: number;
  sellerId: string;
  alertType: string;
  message: string;
  isRead: boolean;
  isResolved: boolean;
  createdAt: string;
  product?: {
    id: number;
    title: string;
    stockQuantity: number;
    lowStockThreshold: number;
  };
}

export interface StockMovement {
  id: number;
  productId: number;
  sellerId: string;
  movementType: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  createdAt: string;
  product?: {
    id: number;
    title: string;
  };
}

export function useInventoryAlerts() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["/api/inventory/alerts"],
    queryFn: async () => {
      const response = await fetch("/api/inventory/alerts");
      if (!response.ok) throw new Error("Failed to fetch inventory alerts");
      return response.json();
    },
    enabled: !!user,
  });
}

export function useStockMovements(productId: number) {
  return useQuery({
    queryKey: ["/api/inventory/movements", productId],
    queryFn: async () => {
      const response = await fetch(`/api/inventory/movements/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch stock movements");
      return response.json();
    },
    enabled: !!productId,
  });
}

export function useUpdateProductStock() {
  return useMutation({
    mutationFn: async (data: {
      productId: number;
      newStock: number;
      movementType: string;
      reason?: string;
    }) => {
      const res = await apiRequest("PUT", `/api/inventory/stock/${data.productId}`, data);
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/movements", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/alerts"] });
    },
  });
}

export function useMarkAlertAsRead() {
  return useMutation({
    mutationFn: async (alertId: number) => {
      await apiRequest("PUT", `/api/inventory/alerts/${alertId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/alerts"] });
    },
  });
}

export function useMarkAlertAsResolved() {
  return useMutation({
    mutationFn: async (alertId: number) => {
      await apiRequest("PUT", `/api/inventory/alerts/${alertId}/resolve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/alerts"] });
    },
  });
}

export function useSellerStats() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["/api/seller/stats"],
    queryFn: async () => {
      const response = await fetch("/api/seller/stats");
      if (!response.ok) throw new Error("Failed to fetch seller stats");
      return response.json();
    },
    enabled: !!user && user.role === 'seller',
  });
}