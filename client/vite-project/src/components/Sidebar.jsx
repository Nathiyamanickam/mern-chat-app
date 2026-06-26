import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ setCurrentChat, currentChat }) {
  const { user, setUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.filter((u) => u._id !== user._id));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [user._id]);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const getInitials = (name) =>
    name ? name.slice(0, 2).toUpperCase() : "??";

  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-yellow-500"];

  return (
    <div className="w-1/3 bg-slate-800 flex flex-col border-r border-slate-700">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-white font-bold text-lg">Messages</h2>
          <p className="text-slate-400 text-xs">Hi, {user?.username}</p>
        </div>
        <button
          onClick={logout}
          className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="overflow-y-auto flex-1">
        {users.length === 0 && (
          <p className="text-slate-500 text-sm text-center mt-8">No other users yet</p>
        )}
        {users.map((u, i) => (
          <div
            key={u._id}
            onClick={() => setCurrentChat(u)}
            className={`flex items-center gap-3 p-4 cursor-pointer border-b border-slate-700 hover:bg-slate-700 transition-colors ${
              currentChat?._id === u._id ? "bg-slate-700" : ""
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${colors[i % colors.length]}`}>

              {getInitials(u.username)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">{u.username}</p>
              <p className="text-slate-400 text-xs truncate">{u.email}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 shrink-0"></div>
          </div>
        ))}
      </div>
    </div>
  );
}