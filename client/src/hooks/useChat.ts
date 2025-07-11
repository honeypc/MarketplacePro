import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "./useAuth";

export interface ChatRoom {
  id: number;
  customerId: string;
  supportAgentId: string | null;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  supportAgent?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ChatMessage {
  id: number;
  roomId: number;
  senderId: string;
  message: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export function useChatRooms() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["/api/chat/rooms"],
    queryFn: async () => {
      const response = await fetch("/api/chat/rooms");
      if (!response.ok) throw new Error("Failed to fetch chat rooms");
      return response.json();
    },
    enabled: !!user,
  });
}

export function useChatRoom(roomId: number) {
  return useQuery({
    queryKey: ["/api/chat/rooms", roomId],
    queryFn: async () => {
      const response = await fetch(`/api/chat/rooms/${roomId}`);
      if (!response.ok) throw new Error("Failed to fetch chat room");
      return response.json();
    },
    enabled: !!roomId,
  });
}

export function useChatMessages(roomId: number) {
  return useQuery({
    queryKey: ["/api/chat/messages", roomId],
    queryFn: async () => {
      const response = await fetch(`/api/chat/messages/${roomId}`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      return response.json();
    },
    enabled: !!roomId,
  });
}

export function useCreateChatRoom() {
  return useMutation({
    mutationFn: async (roomData: {
      subject: string;
      priority: string;
    }) => {
      const res = await apiRequest("POST", "/api/chat/rooms", roomData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/rooms"] });
    },
  });
}

export function useCreateChatMessage() {
  return useMutation({
    mutationFn: async (messageData: {
      roomId: number;
      message: string;
      messageType?: string;
    }) => {
      const res = await apiRequest("POST", "/api/chat/messages", messageData);
      return await res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages", variables.roomId] });
    },
  });
}

export function useCloseChatRoom() {
  return useMutation({
    mutationFn: async (roomId: number) => {
      await apiRequest("PUT", `/api/chat/rooms/${roomId}/close`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/rooms"] });
    },
  });
}

export function useMarkMessagesAsRead() {
  return useMutation({
    mutationFn: async (roomId: number) => {
      await apiRequest("PUT", `/api/chat/rooms/${roomId}/read`);
    },
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages", roomId] });
    },
  });
}