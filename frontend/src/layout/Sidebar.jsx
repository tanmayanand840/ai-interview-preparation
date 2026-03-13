import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  ListChecks,
  Shield,
  LogOut,
  FileText,
  Code2,
} from "lucide-react";
import { useContext } from "react";
import vivamindLogo from "../assets/ChatGPT Image Feb 25, 2026, 12_08_44 PM.png";
import { AuthContext } from "../context/Authcontext.jsx";

const menuSections = [
  {
    title: "Workspace",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/learn", label: "Learn Mode", icon: BookOpen },
      { to: "/practice", label: "Practice Mode", icon: Brain },
      { to: "/adaptive", label: "Adaptive Mode", icon: Brain },
    ],
  },
  {
    title: "Interview Tools",
    items: [
      { to: "/practice-overview", label: "DSA Practice", icon: ListChecks },
      { to: "/resume-match", label: "Resume Match", icon: FileText },
      { to: "/ai-coding", label: "AI Coding Practice", icon: Code2 },
    ],
  },
];

const navItemClass = ({ isActive }) =>
  [
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
    isActive
      ? "bg-gradient-to-r from-indigo/30 to-cyan/20 text-textPrimary border border-cyan/25 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
      : "text-textMuted hover:text-textPrimary hover:bg-white/5 border border-transparent",
  ].join(" ");

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const initials = (user?.name || "User").charAt(0).toUpperCase();

  return (
    <aside className="w-72 bg-surface/90 hidden lg:flex flex-col p-5 border-r border-white/10 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-2 mb-8">
        <Link to="/" className="relative w-32 h-10 flex items-center shrink-0">
          <img
            src={vivamindLogo}
            alt="VivaMind logo"
            className="absolute inset-0 w-full h-full object-contain opacity-25 pointer-events-none select-none"
          />
          <h1 className="relative text-xl font-bold bg-gradient-to-r from-indigo to-cyan bg-clip-text text-transparent">
            VivaMind
          </h1>
        </Link>
      </div>

      <nav className="flex-1 space-y-7">
        {menuSections.map((section) => (
          <div key={section.title}>
            <p className="px-2 mb-2 text-[11px] uppercase tracking-[0.14em] text-textMuted/90">
              {section.title}
            </p>
            <div className="space-y-1.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} className={navItemClass}>
                    <span className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyan/30 transition-colors">
                      <Icon size={16} />
                    </span>
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}

        {user?.role === "admin" && (
          <div>
            <p className="px-2 mb-2 text-[11px] uppercase tracking-[0.14em] text-textMuted/90">
              Admin
            </p>
            <NavLink to="/admin-practice" className={navItemClass}>
              <span className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-colors">
                <Shield size={16} />
              </span>
              <span>Admin Practice</span>
            </NavLink>
          </div>
        )}
      </nav>

      <div className="pt-4 mt-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl bg-white/5 border border-white/10">
          <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo to-cyan flex items-center justify-center text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.name || "Developer"}
            </p>
            <p className="text-xs text-textMuted capitalize">
              {user?.role || "user"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-textMuted hover:text-red-300 hover:bg-red-500/10 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
