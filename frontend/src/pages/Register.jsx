import { useState, useContext } from "react";
import { AuthContext } from "../context/Authcontext";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await api.post("/auth/register", form);
      login(res.data.token);
      toast.success("Account created successfully");
      navigate("/dashboard");
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10">
        <h1 className="text-3xl font-bold text-center mb-2">
          Join{" "}
          <span className="bg-gradient-to-r from-indigo to-cyan bg-clip-text text-transparent">
            VivaMind
          </span>
        </h1>

        <p className="text-center text-textMuted mb-6">
          Start your AI-powered interview journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-background border border-gray-700 focus:ring-2 focus:ring-indigo transition"
          />

          <input
            name="email"
            type="email"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-xl font-semibold bg-gradient-to-r from-indigo to-cyan shadow-glow hover:opacity-90 transition-all duration-300"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-6 text-textMuted">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
