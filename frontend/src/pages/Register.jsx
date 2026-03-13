import { useState, useContext } from "react";
import { AuthContext } from "../context/Authcontext";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { User, Mail, Lock, Sparkles } from "lucide-react";

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
    <div className="min-h-screen relative overflow-hidden px-4 py-10 sm:py-14 flex items-center justify-center">
      <div className="pointer-events-none absolute -top-16 -left-12 h-72 w-72 rounded-full bg-indigo/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-cyan/20 blur-3xl" />

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="hidden lg:flex rounded-2xl border border-white/10 bg-surface/70 backdrop-blur-xl p-8 flex-col justify-between shadow-[0_16px_30px_rgba(2,6,23,0.35)]">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-cyan/90 mb-3">
              Create Account
            </p>
            <h1 className="text-4xl font-bold leading-tight">
              Start your journey with
              <span className="block bg-gradient-to-r from-indigo to-cyan bg-clip-text text-transparent">
                VivaMind AI
              </span>
            </h1>
            <p className="text-textMuted mt-4">
              Build confidence with structured practice, AI insights, and
              adaptive coding sessions.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-textMuted w-fit">
            <Sparkles size={16} className="text-cyan" />
            Personalized roadmap from day one
          </div>
        </div>

        <div className="w-full bg-card/75 backdrop-blur-xl p-7 sm:p-8 rounded-2xl shadow-2xl border border-white/10">
          <h2 className="text-3xl font-bold text-center mb-2">
            Join
            <span className="ml-2 bg-gradient-to-r from-indigo to-cyan bg-clip-text text-transparent">
              VivaMind
            </span>
          </h2>

          <p className="text-center text-textMuted text-sm mb-6">
            Start your AI-powered coding interview journey.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted"
              />
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-background/90 border border-white/10 focus:border-cyan/50 focus:ring-2 focus:ring-indigo/30 transition outline-none"
              />
            </div>

            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-background/90 border border-white/10 focus:border-cyan/50 focus:ring-2 focus:ring-indigo/30 transition outline-none"
              />
            </div>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-background/90 border border-white/10 focus:border-cyan/50 focus:ring-2 focus:ring-indigo/30 transition outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 rounded-xl font-semibold bg-gradient-to-r from-indigo to-cyan shadow-glow hover:opacity-90 transition-all duration-300 disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-6 text-textMuted text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
