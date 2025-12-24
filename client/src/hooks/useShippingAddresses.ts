import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "./useAuth";

export interface ShippingAddress {
  id: number;
  userId: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  label?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShippingAddressInput {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
  label?: string;
}

export interface UpdateShippingAddressInput {
  fullName?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isDefault?: boolean;
  label?: string;
}

export function useShippingAddresses() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["/api/shipping-addresses"],
    queryFn: async () => {
      const response = await fetch("/api/shipping-addresses");
      if (!response.ok) throw new Error("Failed to fetch shipping addresses");
      return response.json() as Promise<ShippingAddress[]>;
    },
    enabled: !!user,
  });
}

export function useCreateShippingAddress() {
  return useMutation({
    mutationFn: async (data: CreateShippingAddressInput) => {
      const res = await apiRequest("POST", "/api/shipping-addresses", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shipping-addresses"] });
    },
  });
}

export function useUpdateShippingAddress() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateShippingAddressInput }) => {
      const res = await apiRequest("PUT", `/api/shipping-addresses/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shipping-addresses"] });
    },
  });
}

export function useDeleteShippingAddress() {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/shipping-addresses/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shipping-addresses"] });
    },
  });
}
