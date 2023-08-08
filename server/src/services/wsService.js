// src/services/websocketService.js
const WebSocket = require("ws");

let clients = [];

function broadcastMessage(message) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function handleConnection(ws) {
  clients.push(ws);
  ws.on("message", (data) => {
    // Handle incoming messages from clients (if needed)
  });
  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
  });
}

function startWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });
  wss.on("connection", (ws) => {
    handleConnection(ws);
  });
  return wss;
}

module.exports = {
  broadcastMessage,
  startWebSocketServer,
};
