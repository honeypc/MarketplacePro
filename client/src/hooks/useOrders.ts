import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "./useAuth";

export interface Order {
  id: number;
  userId: string;
  totalAmount: string;
  status: string;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  orderItems?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: string;
  product?: {
    id: number;
    title: string;
    images: string[];
  };
}

export function useOrders() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["/api/orders"],
    queryFn: async () => {
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
    enabled: !!user,
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ["/api/orders", id],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${id}`);
      if (!response.ok) throw new Error("Failed to fetch order");
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (orderData: {
      totalAmount: string;
      shippingAddress: string;
      billingAddress: string;
      paymentMethod: string;
      items: { productId: number; quantity: number; price: string }[];
    }) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });
}

export function useUpdateOrderStatus() {
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PUT", `/api/orders/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders", variables.id] });
    },
  });
}