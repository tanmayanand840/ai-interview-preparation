import { useState, useContext } from "react";
import { AuthContext } from "../context/Authcontext.jsx";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

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

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const res = await api.post("/auth/google-firebase", { idToken });
      login(res.data.token);
      toast.success("Logged in with Google");
      navigate("/dashboard");
    } catch (err) {
      const message = err?.response?.data?.message || "Google login failed";
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

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-4 w-full flex items-center justify-center gap-3 p-3 rounded-xl font-semibold bg-white text-gray-900 hover:bg-gray-100 transition border border-gray-300 shadow-sm"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
            <svg viewBox="0 0 48 48" className="h-5 w-5">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6 1.54 7.38 2.83l5.42-5.42C33.6 3.58 29.3 1.5 24 1.5 14.91 1.5 7.13 6.98 3.64 14.86l6.71 5.21C11.64 13.83 17.27 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.48 24.5c0-1.57-.14-3.08-.4-4.5H24v9h12.7c-.55 2.9-2.23 5.36-4.74 7.03l7.61 5.9C43.98 37.68 46.48 31.62 46.48 24.5z"
              />
              <path
                fill="#FBBC05"
                d="M10.35 28.79c-.48-1.42-.75-2.94-.75-4.49 0-1.56.27-3.07.75-4.49l-6.71-5.21C2.48 17.09 1.5 20.43 1.5 24c0 3.57.98 6.91 2.64 9.89l6.21-5.1z"
              />
              <path
                fill="#34A853"
                d="M24 46.5c5.3 0 9.74-1.74 12.99-4.71l-7.61-5.9C27.33 37.36 25.8 37.9 24 37.9c-6.73 0-12.36-4.33-14.65-10.29l-6.71 5.21C7.13 41.02 14.91 46.5 24 46.5z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
          </span>
          <span>Continue with Google</span>
        </button>

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
