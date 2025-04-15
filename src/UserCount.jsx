import React from 'react';
import { useWebSocket } from './useWebSocket';

/**
 * Component to display the number of active users
 */
export default function UserCount() {
  const { userCount, isConnected } = useWebSocket();
  
  // Only show when connected and count is available
  if (!isConnected || userCount === 0) {
    return null;
  }
  
  return (
    <div className="user-count">
      <span className="user-count-dot"></span>
      <span className="user-count-number">{userCount}</span>
      <span className="user-count-text">{userCount === 1 ? 'person' : 'people'} online</span>
    </div>
  );
}