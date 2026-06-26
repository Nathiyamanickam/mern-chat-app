import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const login = async () => {
    setError("");
    setLoading(true);
    try {
     const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { 
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      setUser(res.data.user);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-2xl w-96 shadow-xl">
        <h1 className="text-white text-2xl font-bold mb-6">Login</h1>

        {error && (
          <div className="bg-red-500 text-white p-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        <input
          className="w-full p-3 mb-3 rounded bg-slate-700 text-white placeholder-slate-400"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKey}
        />
        <input
          type="password"
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white placeholder-slate-400"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKey}
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded font-medium disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-slate-400 text-sm text-center mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}