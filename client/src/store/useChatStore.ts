import { create } from 'zustand';
import { buildWebSocketUrl } from '@/lib/ws';

interface ChatMessage {
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

interface ChatRoom {
  id: number;
  customerId: string;
  supportAgentId: string | null;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
}

interface ChatStore {
  // Current chat state
  currentRoomId: number | null;
  currentRoom: ChatRoom | null;
  messages: ChatMessage[];
  
  // Chat rooms
  rooms: ChatRoom[];
  
  // UI state
  isOpen: boolean;
  isMinimized: boolean;
  isTyping: boolean;
  
  // WebSocket connection
  socket: WebSocket | null;
  isConnected: boolean;
  
  // Actions
  setCurrentRoom: (roomId: number | null) => void;
  setCurrentRoomData: (room: ChatRoom | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  markMessageAsRead: (messageId: number) => void;
  
  setRooms: (rooms: ChatRoom[]) => void;
  addRoom: (room: ChatRoom) => void;
  updateRoom: (roomId: number, updates: Partial<ChatRoom>) => void;
  
  openChat: (roomId?: number) => void;
  closeChat: () => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
  
  setTyping: (isTyping: boolean) => void;
  
  // WebSocket actions
  connectSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (roomId: number, message: string) => void;
  
  // Getters
  getTotalUnreadCount: () => number;
  getCurrentRoom: () => ChatRoom | null;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Current chat state
  currentRoomId: null,
  currentRoom: null,
  messages: [],
  
  // Chat rooms
  rooms: [],
  
  // UI state
  isOpen: false,
  isMinimized: false,
  isTyping: false,
  
  // WebSocket connection
  socket: null,
  isConnected: false,
  
  // Actions
  setCurrentRoom: (roomId) => {
    set({ currentRoomId: roomId });
  },
  
  setCurrentRoomData: (room) => {
    set({ currentRoom: room });
  },
  
  setMessages: (messages) => {
    set({ messages });
  },
  
  addMessage: (message) => {
    set(state => ({
      messages: [...state.messages, message],
    }));
    
    // Update room with last message
    const state = get();
    if (state.currentRoomId === message.roomId) {
      set(prevState => ({
        rooms: prevState.rooms.map(room =>
          room.id === message.roomId
            ? { ...room, lastMessage: message }
            : room
        ),
      }));
    }
  },
  
  markMessageAsRead: (messageId) => {
    set(state => ({
      messages: state.messages.map(msg =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ),
    }));
  },
  
  setRooms: (rooms) => {
    set({ rooms });
  },
  
  addRoom: (room) => {
    set(state => ({
      rooms: [...state.rooms, room],
    }));
  },
  
  updateRoom: (roomId, updates) => {
    set(state => ({
      rooms: state.rooms.map(room =>
        room.id === roomId ? { ...room, ...updates } : room
      ),
    }));
  },
  
  openChat: (roomId) => {
    set({ isOpen: true, isMinimized: false });
    if (roomId) {
      set({ currentRoomId: roomId });
    }
  },
  
  closeChat: () => {
    set({ isOpen: false, currentRoomId: null, currentRoom: null, messages: [] });
  },
  
  minimizeChat: () => {
    set({ isMinimized: true });
  },
  
  maximizeChat: () => {
    set({ isMinimized: false });
  },
  
  setTyping: (isTyping) => {
    set({ isTyping });
  },
  
  // WebSocket actions
  connectSocket: (userId) => {
    const socket = new WebSocket(buildWebSocketUrl());
    
    socket.onopen = () => {
      set({ isConnected: true });
      socket.send(JSON.stringify({ type: 'authenticate', userId }));
    };
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'newMessage') {
        get().addMessage(data.message);
      } else if (data.type === 'roomUpdate') {
        get().updateRoom(data.roomId, data.updates);
      }
    };
    
    socket.onclose = () => {
      set({ isConnected: false });
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      set({ isConnected: false });
    };
    
    set({ socket });
  },
  
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null, isConnected: false });
    }
  },
  
  sendMessage: (roomId, message) => {
    const { socket } = get();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'sendMessage',
        roomId,
        message,
        messageType: 'text'
      }));
    }
  },
  
  // Getters
  getTotalUnreadCount: () => {
    const { rooms } = get();
    return rooms.reduce((total, room) => total + (room.unreadCount || 0), 0);
  },
  
  getCurrentRoom: () => {
    const { currentRoomId, rooms } = get();
    return rooms.find(room => room.id === currentRoomId) || null;
  },
}));
