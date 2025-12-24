import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "./useAuth";

export interface UserPhone {
  id: number;
  userId: string;
  phoneNumber: string;
  countryCode: string;
  type: "mobile" | "home" | "work";
  isVerified: boolean;
  isPrimary: boolean;
  label?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPhoneInput {
  phoneNumber: string;
  countryCode?: string;
  type?: "mobile" | "home" | "work";
  isVerified?: boolean;
  isPrimary?: boolean;
  label?: string;
}

export interface UpdateUserPhoneInput {
  phoneNumber?: string;
  countryCode?: string;
  type?: "mobile" | "home" | "work";
  isVerified?: boolean;
  isPrimary?: boolean;
  label?: string;
}

export function useUserPhones() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["/api/user-phones"],
    queryFn: async () => {
      const response = await fetch("/api/user-phones");
      if (!response.ok) throw new Error("Failed to fetch user phones");
      return response.json() as Promise<UserPhone[]>;
    },
    enabled: !!user,
  });
}

export function useCreateUserPhone() {
  return useMutation({
    mutationFn: async (data: CreateUserPhoneInput) => {
      const res = await apiRequest("POST", "/api/user-phones", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-phones"] });
    },
  });
}

export function useUpdateUserPhone() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUserPhoneInput }) => {
      const res = await apiRequest("PUT", `/api/user-phones/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-phones"] });
    },
  });
}

export function useDeleteUserPhone() {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/user-phones/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-phones"] });
    },
  });
}
