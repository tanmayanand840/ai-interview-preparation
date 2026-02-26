import { Link } from "react-router-dom";
import { LayoutDashboard, BookOpen, Brain, LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/Authcontext.jsx";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <aside className="w-64 bg-surface hidden lg:flex flex-col p-6 border-r border-white/5">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo to-cyan shadow-glow"></div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo to-cyan bg-clip-text text-transparent">
          VivaMind
        </h1>
      </div>

      <nav className="space-y-6 text-textMuted flex-1">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 hover:text-cyan transition"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          to="/learn"
          className="flex items-center gap-3 hover:text-cyan transition"
        >
          <BookOpen size={18} />
          Learn Mode
        </Link>

        <Link
          to="/practice"
          className="flex items-center gap-3 hover:text-cyan transition"
        >
          <Brain size={18} />
          Practice Mode
        </Link>

        <Link
          to="/adaptive"
          className="flex items-center gap-3 hover:text-cyan transition"
        >
          <Brain size={18} />
          Adaptive Mode
        </Link>
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 text-textMuted hover:text-red-400 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
