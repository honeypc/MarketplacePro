import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { buildWebSocketUrl } from '@/lib/ws';
import { 
  MessageCircle, 
  Send, 
  Clock, 
  Users, 
  CheckCircle,
  AlertCircle,
  User,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface ChatMessage {
  id: number;
  roomId: number;
  senderId: string;
  message: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  isRead: boolean;
  createdAt: string;
}

interface ChatRoom {
  id: number;
  customerId: string;
  supportAgentId?: string;
  status: 'active' | 'closed' | 'waiting';
  subject?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

interface SupportStats {
  totalChats: number;
  activeChats: number;
  avgResponseTime: number;
  customerSatisfaction: number;
}

export default function SupportDashboard() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messageText, setMessageText] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuth();

  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      window.location.href = '/';
    }
  }, [isAuthenticated, user]);

  // WebSocket connection
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      const websocket = new WebSocket(buildWebSocketUrl());

      websocket.onopen = () => {
        websocket.send(JSON.stringify({
          type: 'authenticate',
          userId: user.id
        }));
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'newMessage') {
          queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms', data.roomId, 'messages'] });
          queryClient.invalidateQueries({ queryKey: ['/api/support/rooms'] });
        }
      };

      setWs(websocket);

      return () => {
        websocket.close();
      };
    }
  }, [isAuthenticated, user]);

  // Fetch support rooms
  const { data: supportRooms = [] } = useQuery<ChatRoom[]>({
    queryKey: ['/api/support/rooms'],
    enabled: isAuthenticated && user?.role === 'admin',
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch support stats
  const { data: supportStats } = useQuery<SupportStats>({
    queryKey: ['/api/support/stats'],
    enabled: isAuthenticated && user?.role === 'admin',
  });

  // Fetch messages for selected room
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/rooms', selectedRoom?.id, 'messages'],
    enabled: !!selectedRoom,
  });

  // Assign room to agent
  const assignRoomMutation = useMutation({
    mutationFn: async (roomId: number) => {
      const response = await apiRequest('PUT', `/api/support/rooms/${roomId}/assign`, {
        supportAgentId: user?.id
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/support/rooms'] });
    },
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { message: string; messageType?: string }) => {
      if (ws && ws.readyState === WebSocket.OPEN && selectedRoom) {
        ws.send(JSON.stringify({
          type: 'sendMessage',
          roomId: selectedRoom.id,
          message: messageData.message,
          messageType: messageData.messageType || 'text'
        }));
      }
    },
    onSuccess: () => {
      setMessageText('');
    },
  });

  // Close room
  const closeRoomMutation = useMutation({
    mutationFn: async (roomId: number) => {
      const response = await apiRequest('PUT', `/api/chat/rooms/${roomId}/close`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/support/rooms'] });
      setSelectedRoom(null);
    },
  });

  const handleSendMessage = () => {
    if (messageText.trim() && selectedRoom) {
      sendMessageMutation.mutate({ message: messageText.trim() });
    }
  };

  const handleAssignRoom = (room: ChatRoom) => {
    assignRoomMutation.mutate(room.id);
    setSelectedRoom(room);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'waiting': return 'bg-yellow-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">This page is only available to support agents.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Support Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage customer support conversations</p>
      </div>

      {/* Stats Cards */}
      {supportStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Chats</p>
                  <p className="text-2xl font-bold">{supportStats.totalChats}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Chats</p>
                  <p className="text-2xl font-bold">{supportStats.activeChats}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Response</p>
                  <p className="text-2xl font-bold">{supportStats.avgResponseTime}m</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                  <p className="text-2xl font-bold">{supportStats.customerSatisfaction}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Rooms List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Support Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="waiting" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="waiting">Waiting</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
              </TabsList>

              <TabsContent value="waiting" className="mt-4">
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {supportRooms
                      .filter(room => room.status === 'waiting')
                      .map((room) => (
                        <div
                          key={room.id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handleAssignRoom(room)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">
                              {room.subject || 'General Support'}
                            </span>
                            <Badge className={`text-xs ${getPriorityColor(room.priority)}`}>
                              {room.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(room.createdAt), 'MMM dd, HH:mm')}
                          </div>
                        </div>
                      ))}

                    {supportRooms.filter(room => room.status === 'waiting').length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No waiting conversations</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="active" className="mt-4">
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {supportRooms
                      .filter(room => room.status === 'active' && room.supportAgentId === user?.id)
                      .map((room) => (
                        <div
                          key={room.id}
                          className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                            selectedRoom?.id === room.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => setSelectedRoom(room)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">
                              {room.subject || 'General Support'}
                            </span>
                            <div className="flex gap-1">
                              <Badge className={`text-xs ${getStatusColor(room.status)}`}>
                                {room.status}
                              </Badge>
                              <Badge className={`text-xs ${getPriorityColor(room.priority)}`}>
                                {room.priority}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <User className="h-3 w-3 mr-1" />
                            Customer ID: {room.customerId.slice(0, 8)}...
                          </div>
                        </div>
                      ))}

                    {supportRooms.filter(room => room.status === 'active' && room.supportAgentId === user?.id).length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No active conversations</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedRoom ? selectedRoom.subject || 'General Support' : 'Select a conversation'}
              </CardTitle>
              {selectedRoom && (
                <div className="flex gap-2">
                  <Badge className={`${getStatusColor(selectedRoom.status)}`}>
                    {selectedRoom.status}
                  </Badge>
                  <Badge className={`${getPriorityColor(selectedRoom.priority)}`}>
                    {selectedRoom.priority}
                  </Badge>
                  {selectedRoom.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => closeRoomMutation.mutate(selectedRoom.id)}
                      disabled={closeRoomMutation.isPending}
                    >
                      Close Chat
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-96">
            {selectedRoom ? (
              <>
                {/* Messages */}
                <div className="flex-1 min-h-0 mb-4">
                  <ScrollArea className="h-full">
                    <div className="space-y-3">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] px-3 py-2 rounded-lg ${
                              message.senderId === user?.id
                                ? 'bg-blue-500 text-white'
                                : message.messageType === 'system'
                                ? 'bg-gray-100 text-gray-600 italic'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {format(new Date(message.createdAt), 'HH:mm')}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                {/* Message Input */}
                {selectedRoom.status === 'active' && (
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your response..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="resize-none"
                      rows={2}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || sendMessageMutation.isPending}
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a conversation to start</p>
                  <p className="text-sm">Choose from waiting or active conversations</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
