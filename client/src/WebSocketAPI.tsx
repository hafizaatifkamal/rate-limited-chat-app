export interface Message {
  sender: string;
  content: string;
  timestamp: number;
}

const WS_URL = "ws://localhost:3000"; // WebSocket server URL

export const WebSocketAPI = {
  socket: new WebSocket(WS_URL),

  setUsername: (username: string) => {
    WebSocketAPI.socket.send(
      JSON.stringify({
        type: "setUsername",
        username,
      })
    );
  },

  connect: (onMessageReceived: (message: Message) => void) => {
    // Open WebSocket connection
    WebSocketAPI.socket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    // Handle incoming messages
    WebSocketAPI.socket.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      onMessageReceived(message);
    };

    // Handle WebSocket errors
    WebSocketAPI.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Handle WebSocket connection close
    WebSocketAPI.socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
    };
  },

  sendMessage: (message: Message) => {
    WebSocketAPI.socket.send(JSON.stringify(message));
  },
};
