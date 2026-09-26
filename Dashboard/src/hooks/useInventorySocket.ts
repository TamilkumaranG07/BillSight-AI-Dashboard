import { useEffect, useState, useRef, useCallback } from 'react';

export type SocketStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected';

export interface WebSocketMessage {
  type: string;
  data: any;
}

export function useInventorySocket(
  onMessageReceived?: (msg: WebSocketMessage) => void
) {
  const [status, setStatus] = useState<SocketStatus>('connecting');
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const maxAttempts = 5;

  const connect = useCallback(() => {
    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//localhost:5000/ws/inventory`;

      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        reconnectAttemptsRef.current = 0;
        console.log('Real-time Inventory WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const parsed: WebSocketMessage = JSON.parse(event.data);
          if (onMessageReceived) {
            onMessageReceived(parsed);
          }
        } catch (e) {
          console.warn('Failed to parse WS message:', e);
        }
      };

      ws.onclose = () => {
        setStatus('disconnected');
        if (reconnectAttemptsRef.current < maxAttempts) {
          reconnectAttemptsRef.current += 1;
          setStatus('reconnecting');
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 15000);
          setTimeout(connect, delay);
        }
      };

      ws.onerror = (err) => {
        console.warn('WebSocket connection error:', err);
        ws.close();
      };
    } catch (err) {
      console.warn('Could not initialize WebSocket:', err);
      setStatus('disconnected');
    }
  }, [onMessageReceived]);

  useEffect(() => {
    connect();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  return { status };
}
