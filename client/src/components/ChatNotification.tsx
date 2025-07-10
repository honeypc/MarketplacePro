import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  senderName = "Support Agent", 
  onClose, 
  onOpen 
}: ChatNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <Card className="fixed top-4 right-4 w-80 shadow-xl z-50 border-blue-200 bg-white">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Bell className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium text-gray-900">{senderName}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-4 w-4 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-2">{message}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={onOpen} className="h-7 text-xs">
                Reply
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose} className="h-7 text-xs">
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}