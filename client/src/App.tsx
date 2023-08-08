import React, { useState } from "react";
import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";
import { WebSocketAPI } from "./WebSocketAPI";

const App: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);

  const handleLogin = (username: string) => {
    setUsername(username);
  };

  const handleLogout = () => {
    setUsername(null);
  };

  return (
    <div className="h-screen bg-slate-50">
      {username && WebSocketAPI.socket.OPEN ? (
        <div className="container mx-auto h-screen max-w-screen-lg flex items-center justify-center">
          <div className="w-1/2 border shadow-lg rounded max-w-screen-lg">
            <div className="p-4 bg-slate-500 text-white text-center">
              <h1 className="text-2xl font-bold">Chat Room</h1>
            </div>
            <div className="p-4">
              <ChatRoom username={username} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
