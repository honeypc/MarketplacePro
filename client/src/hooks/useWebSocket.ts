import { useEffect, useRef, useState } from 'react';

export interface WebSocketMessage {
  type: string;
  data?: any;
}

export interface UseWebSocketOptions {
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  protocols?: string | string[];
}

export function useWebSocket(
  url: string,
  options: UseWebSocketOptions = {}
) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const shouldReconnectRef = useRef(true);

  const {
    onOpen,
    onClose,
    onError,
    onMessage,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
    protocols,
  } = options;

  const connect = () => {
    try {
      setConnectionStatus('connecting');
      const ws = new WebSocket(url, protocols);

      ws.onopen = (event) => {
        setSocket(ws);
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        onOpen?.(event);
      };

      ws.onclose = (event) => {
        setSocket(null);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        onClose?.(event);

        // Attempt to reconnect if needed
        if (shouldReconnectRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (event) => {
        setConnectionStatus('error');
        onError?.(event);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
          onMessage?.(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionStatus('error');
    }
  };

  const disconnect = () => {
    shouldReconnectRef.current = false;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (socket) {
      socket.close();
    }
  };

  const sendMessage = (message: WebSocketMessage) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  };

  const reconnect = () => {
    reconnectAttemptsRef.current = 0;
    shouldReconnectRef.current = true;
    connect();
  };

  useEffect(() => {
    connect();

    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, [url]);

  return {
    socket,
    isConnected,
    connectionStatus,
    lastMessage,
    sendMessage,
    disconnect,
    reconnect,
  };
}