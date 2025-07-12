import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, MessageCircle, User } from 'lucide-react';

interface ChatNotificationProps {
  message: string;
  roomId: number;
  senderName?: string;
  onClose: () => void;
  onOpen: () => void;
}

export function ChatNotification({ 
  message, 
  roomId, 
  senderName, 
  onClose, 
  onOpen 
}: ChatNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <Card className={`fixed top-4 right-4 w-80 shadow-lg z-50 border-l-4 border-l-blue-500 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <User className="w-3 h-3 text-gray-500" />
                <p className="text-sm font-medium text-gray-900 truncate">
                  {senderName || 'Support Agent'}
                </p>
                <Badge variant="secondary" className="text-xs">
                  New
                </Badge>
              </div>
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                {message}
              </p>
              <div className="flex space-x-2 mt-3">
                <Button
                  size="sm"
                  onClick={onOpen}
                  className="text-xs bg-blue-600 hover:bg-blue-700"
                >
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                  }}
                  className="text-xs"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="h-6 w-6 p-0 flex-shrink-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}