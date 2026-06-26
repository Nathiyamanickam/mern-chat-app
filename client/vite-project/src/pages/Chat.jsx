import { useState, useContext, useEffect } from "react";
import { socket } from "../socket/socket";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    if (user?._id) socket.emit("addUser", user._id);
  }, [user?._id]);

  return (
    <div className="h-screen flex bg-slate-900 text-white">
      <Sidebar setCurrentChat={setCurrentChat} currentChat={currentChat} />
      <ChatBox currentChat={currentChat} />
    </div>
  );
}