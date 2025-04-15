const { WebSocketServer } = require('ws');

// Keep track of all connected clients
function peerProxy(httpServer) {
  // Create a websocket server
  const wss = new WebSocketServer({ server: httpServer });
  
  // Track connected clients
  const clients = new Set();
  
  // Handle new connections
  wss.on('connection', (ws) => {
    // Add this client to our tracking
    clients.add(ws);
    
    // Send current user count to everyone
    broadcastUserCount();
    
    // Handle disconnection
    ws.on('close', () => {
      clients.delete(ws);
      broadcastUserCount();
    });
    
    // Set up ping-pong to keep connection alive
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });
  });
  
  // Broadcast the user count to all connected clients
  function broadcastUserCount() {
    const count = clients.size;
    const message = JSON.stringify({
      type: 'userCount',
      count: count
    });
    
    for (const client of clients) {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(message);
      }
    }
  }
  
  // Ping clients every 30 seconds to keep connections alive and remove dead connections
  setInterval(() => {
    for (const client of clients) {
      if (client.isAlive === false) {
        client.terminate();
        clients.delete(client);
        continue;
      }
      
      client.isAlive = false;
      client.ping();
    }
    
    // Update counts after cleaning up
    if (clients.size > 0) {
      broadcastUserCount();
    }
  }, 10000);
}