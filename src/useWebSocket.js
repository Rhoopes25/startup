import { useState, useEffect } from 'react';

/**
 * Custom hook to use WebSocket across the app
 */
export function useWebSocket() {
  const [socket, setSocket] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Determine the correct WebSocket URL based on the environment
    let protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    let wsUrl = `${protocol}//${window.location.host}/ws`;
    
    // In development, Vite handles the proxy differently
    if (import.meta.env.DEV) {
      wsUrl = `${protocol}//${window.location.hostname}:${window.location.port}/ws`;
    }
    
    // Create the WebSocket connection
    const newSocket = new WebSocket(wsUrl);
    
    // Connection opened
    newSocket.addEventListener('open', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });
    
    // Connection closed
    newSocket.addEventListener('close', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });
    
    // Handle messages
    newSocket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle user count updates
        if (data.type === 'userCount') {
          setUserCount(data.count);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    // Store the socket in state
    setSocket(newSocket);
    
    // Clean up on unmount
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  return { socket, userCount, isConnected };
}