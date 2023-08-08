// src/Login.tsx
import React, { useState } from "react";
import { WebSocketAPI } from "../WebSocketAPI";

interface Props {
  onLogin: (username: string) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (username.trim() === "") {
      alert("Please enter a valid username.");
      return;
    }

    // Set the username in the WebSocket connection header
    WebSocketAPI.setUsername(username);

    // Notify the parent component (App) about the login
    onLogin(username);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-xs">
        <div className="bg-slate-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 items-center">
          <h2 className="text-xl text-center font-bold mb-4">Login</h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-slate-500 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleLogin}
            >
              Join Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
