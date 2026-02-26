import { useState, useContext } from "react";
import { AuthContext } from "../context/Authcontext.jsx";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Invalid email or password";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10">
        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-indigo to-cyan bg-clip-text text-transparent">
            VivaMind
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-background border border-gray-700 focus:ring-2 focus:ring-indigo transition"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-background border border-gray-700 focus:ring-2 focus:ring-indigo transition"
          />

          <button className="w-full p-3 rounded-xl font-semibold bg-gradient-to-r from-indigo to-cyan shadow-glow hover:opacity-90 transition">
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-textMuted">
          Don’t have an account?{" "}
          <Link to="/register" className="text-cyan hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
