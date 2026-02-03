import {createContext, ReactNode, useContext, useRef, useState} from 'react';
import {RootUiStoreContext} from '../../store/RootUiStore.tsx';
import {useWebSocket, WebSocketData} from './UseWebSocket.tsx';
import {formatLicensePlate} from '../format.ts';
import {RootStoreContext} from '../../store/RootStore.tsx';

interface WebSocketContextType {
  sendMessage: (message: Record<string, unknown>) => void;
  disconnect: () => void;
  isConnected: boolean;
  retryPlateDetection: () => void;
  isRetrying: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({children}: WebSocketProviderProps) => {
  const rootUiStore = useContext(RootUiStoreContext);
  const [isRetrying, setIsRetrying] = useState(false);
  const ignoreMessagesUntil = useRef<number>(0);
  const retryTimeoutRef = useRef<number | null>(null);
  const timeoutMs = parseInt(import.meta.env.VITE_PLATE_DETECTION_DELAY || '300000');
  const rootStore = useContext(RootStoreContext);
  const washSelectionStore = rootStore.washSelectionStore;

  const retryPlateDetection = () => {
    console.log('Retrying plate detection...');
    setIsRetrying(true);

    ignoreMessagesUntil.current = Date.now() + timeoutMs;

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    washSelectionStore.retryPlateDetection();

    rootUiStore.setAppState('splash');
    rootUiStore.setLicensePlate('');

    retryTimeoutRef.current = setTimeout(() => {
      setIsRetrying(false);
      console.log('Retry period ended, resuming normal operation');
    }, timeoutMs);
  };

  const handleMessage = (data: WebSocketData) => {
    // Check if we should ignore messages due to ongoing retry
    if (Date.now() < ignoreMessagesUntil.current) {
      console.log('Ignoring WebSocket message during retry period:', data);
      return;
    }

    // console.log('WebSocket message received:', data);

    if (data.status && data.plate && rootUiStore.currentAppState === 'splash') {
      rootUiStore.setAppState('wash-selection');
      rootUiStore.setLicensePlate(formatLicensePlate(data.plate));
    } else if (
      data.wash_cancelled &&
      (rootUiStore.currentAppState === 'wash-in-progress' ||
        rootUiStore.currentAppState === 'out-of-order')
    ) {
      console.log('Wash cancelled message received, resetting app state');
      rootUiStore.reset();
    }
  };

  const {sendMessage, disconnect, isConnected} = useWebSocket({
    url: 'ws://localhost:8000/api/ws/start',
    onMessage: handleMessage,
    onOpen: () => {
      console.log('Global WebSocket connected successfully');
    },
    onClose: () => {
      console.log('Global WebSocket disconnected');
      // Clear retry timeout if connection closes
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        setIsRetrying(false);
      }
    },
    onError: error => {
      console.error('Global WebSocket connection error:', error);
    },
    reconnectInterval: 3000,
    maxReconnectAttempts: 10,
    shouldReconnect: true,
  });

  const contextValue: WebSocketContextType = {
    sendMessage,
    disconnect,
    isConnected,
    retryPlateDetection,
    isRetrying,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};
