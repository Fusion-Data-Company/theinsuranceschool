import { useEffect, useRef, useState } from "react";

interface UseWebSocketOptions {
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export function useWebSocket(url: string, options: UseWebSocketOptions = {}) {
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    try {
      const websocket = new WebSocket(url);
      websocketRef.current = websocket;

      websocket.onopen = () => {
        setReadyState(WebSocket.OPEN);
        options.onOpen?.();
      };

      websocket.onclose = () => {
        setReadyState(WebSocket.CLOSED);
        options.onClose?.();
      };

      websocket.onerror = (error) => {
        setReadyState(WebSocket.CLOSED);
        options.onError?.(error);
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          options.onMessage?.(data);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      return () => {
        websocket.close();
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setReadyState(WebSocket.CLOSED);
    }
  }, [url]);

  const sendMessage = (message: any) => {
    if (websocketRef.current && readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify(message));
    }
  };

  return {
    readyState,
    lastMessage,
    sendMessage,
    isConnecting: readyState === WebSocket.CONNECTING,
    isOpen: readyState === WebSocket.OPEN,
    isClosed: readyState === WebSocket.CLOSED,
  };
}
