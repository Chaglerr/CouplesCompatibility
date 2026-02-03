import {useEffect, useRef, useCallback} from 'react';

export interface WebSocketData {
  plate?: string;
  status?: number;
  wash_cancelled?: boolean;
  type?: 'ping' | 'pong';
  [key: string]: unknown;
}

export interface UseWebSocketOptions {
  url: string;
  onMessage?: (data: WebSocketData) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  shouldReconnect?: boolean;
  heartbeatInterval?: number; // New option for heartbeat
}

export const useWebSocket = ({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
  shouldReconnect = true,
  heartbeatInterval = 30000,
}: UseWebSocketOptions) => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeoutId = useRef<number | null>(null);
  const heartbeatTimeoutId = useRef<number | null>(null);
  const periodicRetryTimeoutId = useRef<number | null>(null);
  const isManualClose = useRef(false);
  const lastPongTime = useRef<number>(Date.now());

  // Clear heartbeat timer
  const clearHeartbeat = useCallback(() => {
    if (heartbeatTimeoutId.current) {
      window.clearTimeout(heartbeatTimeoutId.current);
      heartbeatTimeoutId.current = null;
    }
  }, []);

  // Clear periodic retry timer
  const clearPeriodicRetry = useCallback(() => {
    if (periodicRetryTimeoutId.current) {
      window.clearTimeout(periodicRetryTimeoutId.current);
      periodicRetryTimeoutId.current = null;
    }
  }, []);

  // Start heartbeat mechanism
  const startHeartbeat = useCallback(() => {
    clearHeartbeat();

    const sendPing = () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const timeSinceLastPong = Date.now() - lastPongTime.current;
        if (timeSinceLastPong > heartbeatInterval * 2) {
          console.warn('No pong received, connection might be dead. Reconnecting...');
          ws.current.close();
          return;
        }

        ws.current.send(JSON.stringify({type: 'ping', timestamp: Date.now()}));
        console.log('Sent ping');

        heartbeatTimeoutId.current = window.setTimeout(sendPing, heartbeatInterval);
      }
    };

    heartbeatTimeoutId.current = window.setTimeout(sendPing, heartbeatInterval);
  }, [heartbeatInterval, clearHeartbeat]);

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log('WebSocket connection opened');
        reconnectAttempts.current = 0;
        lastPongTime.current = Date.now();
        clearPeriodicRetry();
        startHeartbeat();
        onOpen?.();
      };

      ws.current.onmessage = event => {
        try {
          const data = JSON.parse(event.data) as WebSocketData;
          // console.log('Received data:', data);

          if (data.type === 'pong') {
            lastPongTime.current = Date.now();
            console.log('Received pong');
            return;
          }

          if (data.type === 'ping') {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
              ws.current.send(JSON.stringify({type: 'pong', timestamp: Date.now()}));
            }
            return;
          }

          onMessage?.(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = event => {
        console.log('WebSocket connection closed', event.code, event.reason);
        clearHeartbeat();
        onClose?.();

        if (
          !isManualClose.current &&
          shouldReconnect &&
          reconnectAttempts.current < maxReconnectAttempts
        ) {
          reconnectAttempts.current += 1;
          console.log(
            `Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`
          );
          reconnectTimeoutId.current = window.setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (
          !isManualClose.current &&
          shouldReconnect &&
          reconnectAttempts.current >= maxReconnectAttempts
        ) {
          console.log(
            'Max reconnection attempts reached, switching to periodic retry every 30 seconds'
          );
          // Start periodic retry every 30 seconds after max attempts reached
          periodicRetryTimeoutId.current = window.setTimeout(() => {
            console.log(
              'Periodic retry: Resetting reconnect attempts and trying again...'
            );
            reconnectAttempts.current = 0; // Reset counter for fresh attempts
            connect();
          }, 30000); // Retry every 30 seconds
        }
      };

      ws.current.onerror = error => {
        console.error('WebSocket error:', error);
        onError?.(error);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  }, [
    url,
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectInterval,
    maxReconnectAttempts,
    shouldReconnect,
    startHeartbeat,
    clearHeartbeat,
    clearPeriodicRetry,
  ]);

  const disconnect = useCallback(() => {
    isManualClose.current = true;
    clearHeartbeat();
    clearPeriodicRetry();

    if (reconnectTimeoutId.current) {
      window.clearTimeout(reconnectTimeoutId.current);
      reconnectTimeoutId.current = null;
    }

    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  }, [clearHeartbeat, clearPeriodicRetry]);

  const sendMessage = useCallback((message: Record<string, unknown>) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  useEffect(() => {
    isManualClose.current = false;
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    sendMessage,
    disconnect,
    isConnected: ws.current?.readyState === WebSocket.OPEN,
  };
};
