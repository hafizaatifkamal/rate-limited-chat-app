import React, { useState, useEffect, useRef } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import { WebSocketAPI, Message } from "../WebSocketAPI";
import Notification from "./Notification";

interface Props {
  username: string;
  onLogout: () => void;
}

const ChatRoom: React.FC<Props> = ({ username, onLogout }) => {
  //   const [username, setUsername] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!username) {
      alert("Please enter a username before sending a message.");
      return;
    }

    const newMessage: Message = {
      sender: username,
      content: message,
      timestamp: Date.now(),
    };

    // Send the message via WebSocket
    WebSocketAPI.sendMessage(newMessage);

    // Send the message to the backend API
    const API_URL = "http://localhost:3000/api/messages"; // API endpoint for sending messages

    // WebSocketAPI.sendToAPI(newMessage)
    const sendToAPI = (message: Message) => {
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })
        .then((response) => {
          if (
            response.status === 429 &&
            response.statusText === "Too Many Requests"
          ) {
            setIsRateLimited(true);
            setTimeout(() => {
              setIsRateLimited(false);
            }, 30000); // Hide the notification after 30 seconds
          }
          response.json();
        })
        .catch((error) => {
          console.error("Error sending message to API:", error);
        });
    };

    sendToAPI(newMessage);

    setMessage("");
  };

  // Handle logout
  const handleLogout = () => {
    // Close the WebSocket connection
    WebSocketAPI.socket.close();

    // Call the onLogout function to clear the username
    onLogout();
  };

  // Handle receiving a new message from WebSocket
  const handleReceiveMessage = (message: Message) => {
    // Update the messages state with the new message
    setMessages((prevMessages) => [...prevMessages, message]);

    // Scroll to the bottom of the chat box to show the latest message
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  };

  const convertTime = (milliseconds: number) =>
    new Date(milliseconds).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

  useEffect(() => {
    // Connect to WebSocket server and set up message handler
    WebSocketAPI.connect(handleReceiveMessage);

    // Fetch last 50 messages from the backend when the component mounts
    fetch("http://localhost:3000/api/messages")
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => console.error("Error fetching messages:", error));
  }, []);

  return (
    <div className="flex h-full flex-col max-w-4xl">
      {isRateLimited && (
        <Notification
          message={
            "You have exceeded the rate limit(15 messages/per minute). Please, try again later."
          }
        />
      )}
      <div className="flex flex-col lg:flex-row p-4 border-b items-center justify-between lg:px-8">
        <UserIcon className="h-6 w-6 mr-2 text-slate-500" />
        <div className="flex-grow">
          <span className="text-xs lg:text-base font-bold">{username}</span>
        </div>
        <button
          className="px-4 py-2 text-white text-xs lg:text-base bg-red-500 rounded hover:bg-red-800"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div
        className="flex-1 p-4 border overflow-y-scroll bg-slate-100"
        style={{ maxHeight: "50vh" }}
        ref={chatBoxRef}
      >
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === username ? `justify-end` : `justify-start`
              }`}
            >
              <div
                className={`${
                  message.sender === username ? `bg-slate-200` : `bg-blue-200`
                } p-2 rounded-lg shadow-md max-w-md`}
              >
                <div
                  className={`text-xs font-bold
                ${
                  message.sender === username ? "text-red-800" : "text-blue-800"
                }
                 mb-1`}
                >
                  {message.sender}
                </div>
                <div>
                  {message.content}
                  <span className="justify-end items-end text-xs pl-4">
                    {convertTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-1/5 flex flex-col lg:flex-row items-center p-4 border-t">
        <input
          type="text"
          className="flex-grow p-2 mr-2 text-xs lg:text-base border rounded w-auto lg:w-fit"
          placeholder="Enter your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className={`px-4 py-2 text-white text-xs lg:text-base justify-between rounded ${
            isRateLimited
              ? `bg-slate-300 cursor-not-allowed`
              : `bg-slate-500 hover:bg-slate-800`
          }`}
          onClick={handleSendMessage}
          disabled={isRateLimited}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
