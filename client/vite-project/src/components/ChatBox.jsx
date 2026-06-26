import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { socket } from "../socket/socket";
import { AuthContext } from "../context/AuthContext";

export default function ChatBox({ currentChat }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { user } = useContext(AuthContext);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!currentChat) return;
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/messages/${currentChat._id}`,  
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [currentChat]);

  useEffect(() => {
    const handleMessage = (data) => {
      if (data.senderId === currentChat?._id) {
        setMessages((prev) => [...prev, data]);
      }
    };
    socket.on("getMessage", handleMessage);
    return () => socket.off("getMessage", handleMessage);
  }, [currentChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !currentChat) return;
    const newMsg = { senderId: user._id, receiverId: currentChat._id, message: text };
    socket.emit("sendMessage", newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setText("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/messages`,  // ✅ changed
        newMsg,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  if (!currentChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-900">
        <p className="text-slate-500 text-lg">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
          {currentChat.username?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-medium text-sm">{currentChat.username}</p>
          <p className="text-green-400 text-xs">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
              m.senderId === user._id
                ? "bg-blue-500 text-white self-end rounded-br-sm"
                : "bg-slate-700 text-white self-start rounded-bl-sm"
            }`}
          >
            {m.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-slate-800 border-t border-slate-700 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          className="flex-1 p-3 rounded-xl bg-slate-700 text-white placeholder-slate-400 text-sm outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 rounded-xl text-sm font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}