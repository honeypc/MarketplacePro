import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, X, Minimize2, Maximize2 } from 'lucide-react';
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

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messageText, setMessageText] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [newSubject, setNewSubject] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuth();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // WebSocket connection
  useEffect(() => {
    if (isAuthenticated && user && isOpen) {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        websocket.send(JSON.stringify({
          type: 'authenticate',
          userId: user.id
        }));
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'newMessage') {
          // Invalidate messages query to fetch updated messages
          queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms', data.roomId, 'messages'] });
        } else if (data.type === 'messagesRead') {
          queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms', data.roomId, 'messages'] });
        }
      };

      setWs(websocket);

      return () => {
        websocket.close();
      };
    }
  }, [isAuthenticated, user, isOpen]);

  // Fetch user's chat rooms
  const { data: chatRooms = [] } = useQuery<ChatRoom[]>({
    queryKey: ['/api/chat/rooms'],
    enabled: isAuthenticated && isOpen,
  });

  // Fetch messages for current room
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/rooms', currentRoom?.id, 'messages'],
    enabled: !!currentRoom,
  });

  // Create new chat room
  const createRoomMutation = useMutation({
    mutationFn: async (subject: string) => {
      const response = await apiRequest('POST', '/api/chat/rooms', {
        subject,
        priority: 'medium'
      });
      return response.json();
    },
    onSuccess: (newRoom) => {
      setCurrentRoom(newRoom);
      setNewSubject('');
      queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms'] });
    },
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { message: string; messageType?: string }) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'sendMessage',
          roomId: currentRoom?.id,
          message: messageData.message,
          messageType: messageData.messageType || 'text'
        }));
      }
    },
    onSuccess: () => {
      setMessageText('');
    },
  });

  // Mark messages as read
  const markReadMutation = useMutation({
    mutationFn: async (roomId: number) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'markRead',
          roomId
        }));
      }
    },
  });

  useEffect(() => {
    if (currentRoom && messages.length > 0) {
      scrollToBottom();
      markReadMutation.mutate(currentRoom.id);
    }
  }, [messages, currentRoom]);

  const handleSendMessage = () => {
    if (messageText.trim() && currentRoom) {
      sendMessageMutation.mutate({ message: messageText.trim() });
    }
  };

  const handleCreateRoom = () => {
    if (newSubject.trim()) {
      createRoomMutation.mutate(newSubject.trim());
    }
  };

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Chat toggle button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat widget */}
      {isOpen && (
        <Card className={`fixed bottom-6 right-6 w-80 shadow-xl z-50 ${
          isMinimized ? 'h-14' : 'h-96'
        } transition-all duration-300`}>
          <CardHeader className="p-3 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Customer Support</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-6 w-6 p-0"
                >
                  {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-3 pt-0 h-full flex flex-col">
              {!currentRoom ? (
                <div className="flex flex-col h-full">
                  {/* Chat rooms list */}
                  <div className="flex-1 min-h-0">
                    <ScrollArea className="h-full">
                      {chatRooms.length > 0 ? (
                        <div className="space-y-2">
                          {chatRooms.map((room) => (
                            <div
                              key={room.id}
                              onClick={() => setCurrentRoom(room)}
                              className="p-2 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium truncate">
                                  {room.subject || 'General Support'}
                                </span>
                                <div className="flex gap-1">
                                  <Badge className={`text-xs ${getPriorityColor(room.priority)}`}>
                                    {room.priority}
                                  </Badge>
                                  <Badge className={`text-xs ${getStatusColor(room.status)}`}>
                                    {room.status}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {format(new Date(room.updatedAt), 'MMM dd, HH:mm')}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 text-sm py-4">
                          No chat conversations yet
                        </div>
                      )}
                    </ScrollArea>
                  </div>

                  {/* Create new chat */}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Subject (optional)"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        className="text-xs"
                        onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
                      />
                      <Button
                        size="sm"
                        onClick={handleCreateRoom}
                        disabled={createRoomMutation.isPending}
                      >
                        Start Chat
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Chat header */}
                  <div className="flex items-center justify-between pb-2 border-b">
                    <div>
                      <h4 className="text-sm font-medium">
                        {currentRoom.subject || 'General Support'}
                      </h4>
                      <div className="flex gap-1 mt-1">
                        <Badge className={`text-xs ${getStatusColor(currentRoom.status)}`}>
                          {currentRoom.status}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(currentRoom.priority)}`}>
                          {currentRoom.priority}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentRoom(null)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 min-h-0 py-2">
                    <ScrollArea className="h-full">
                      <div className="space-y-2">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.senderId === user?.id ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[80%] px-2 py-1 rounded text-xs ${
                                message.senderId === user?.id
                                  ? 'bg-blue-500 text-white'
                                  : message.messageType === 'system'
                                  ? 'bg-gray-100 text-gray-600 italic'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p>{message.message}</p>
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

                  {/* Message input */}
                  {currentRoom.status !== 'closed' && (
                    <div className="border-t pt-2">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="text-xs min-h-[60px] resize-none"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={handleSendMessage}
                          disabled={!messageText.trim() || sendMessageMutation.isPending}
                          className="self-end"
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}
    </>
  );
}