import { useEffect, useRef, useState } from 'react';
import { Client, type StompSubscription } from '@stomp/stompjs';

// Type for WebSocket message data - can be extended as needed
interface WebSocketMessage {
  [key: string]: unknown;
}

// Type for subscription callback
type SubscriptionCallback = (data: WebSocketMessage) => void;

// Type for subscription return object
interface SubscriptionObject {
  unsubscribe: () => void;
}

interface WebSocketHook {
  isConnected: boolean;
  error: string | null;
  sendMessage: (destination: string, message: WebSocketMessage) => void;
  subscribe: (destination: string, callback: SubscriptionCallback) => SubscriptionObject | null;
  unsubscribe: (destination: string) => void;
  client: Client | null;
}

export const useWebSocket = (): WebSocketHook => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, StompSubscription>>(new Map());

  useEffect(() => {
    // Create STOMP client with native WebSocket
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws/party',
      connectHeaders: {},
      debug: (str: string) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log('Connected to WebSocket:', frame);
      setIsConnected(true);
      setError(null);
    };

    client.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    };

    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
      setError(frame.headers['message'] || 'WebSocket error');
    };

    client.activate();
    clientRef.current = client;

    return () => {
      // Cleanup all subscriptions
      subscriptionsRef.current.forEach(sub => sub.unsubscribe());
      subscriptionsRef.current.clear();
      client.deactivate();
    };
  }, []);

  const sendMessage = (destination: string, message: WebSocketMessage): void => {
    if (clientRef.current && isConnected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(message)
      });
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  };

  const subscribe = (destination: string, callback: SubscriptionCallback): SubscriptionObject | null => {
    if (clientRef.current && isConnected) {
      const subscription = clientRef.current.subscribe(destination, (message) => {
        try {
          const data: WebSocketMessage = JSON.parse(message.body);
          callback(data);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
      
      // Store subscription for cleanup
      subscriptionsRef.current.set(destination, subscription);
      
      return {
        unsubscribe: () => {
          subscription.unsubscribe();
          subscriptionsRef.current.delete(destination);
        }
      };
    }
    return null;
  };

  const unsubscribe = (destination: string): void => {
    const subscription = subscriptionsRef.current.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      subscriptionsRef.current.delete(destination);
    }
  };

  return {
    isConnected,
    error,
    sendMessage,
    subscribe,
    unsubscribe,
    client: clientRef.current
  };
};