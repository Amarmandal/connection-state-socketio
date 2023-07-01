import React, { useState, useEffect } from "react";
import { socket } from "./socket";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState([]);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);

    const onDisconnect = () => setIsConnected(false);

    const onMsgReceive = (msg) => {
      setMessagesList((previous) => [...previous, msg]);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("client:channel", onMsgReceive);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("client:channel", onMsgReceive);
    };
  }, []);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can send the chat message to your server or perform any desired action
    socket.emit("message", message);
    setMessage("");
  };

  const handleSocketConnect = () => (!isConnected ? socket.connect() : socket.disconnect());

  return (
    <div className="bg-slate-800 h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center py-6 text-white">Chat App</h1>
      <p className="font-bold px-10 py-10">
        User Status: <span className="text-green-400">{"" + isConnected}</span>
        <button
          onClick={handleSocketConnect}
          className="bg-green-500 text-white px-4 py-2 rounded-md mt-2 mx-6"
        >
          {!isConnected ? "Connect" : "Disconnect"}
        </button>
      </p>
      <form
        className="bg-slate-600 container mx-auto p-10 border border-sky-500"
        onSubmit={handleSubmit}
      >
        <ul className="space-y-2">
          {messagesList.map((msg, index) => (
            <li key={index} className="p-2 bg-gray-100 rounded-md my-4">
              {msg}
            </li>
          ))}
        </ul>
        <input
          type="text"
          className="border border-gray-200 rounded p-2 mt-10"
          placeholder="Enter your message"
          value={message}
          onChange={handleChange}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 mx-6">
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
