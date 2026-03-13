import { useContext } from "react";
import { Sparkles } from "lucide-react";
import { AuthContext } from "../context/Authcontext.jsx";

const Topbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="h-16 sm:h-[72px] border-b border-white/10 bg-surface/70 backdrop-blur-xl flex items-center px-4 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium text-textPrimary">
          Dashboard Overview
        </p>
        <div className="h-0.5 w-28 mt-1 bg-gradient-to-r from-indigo to-cyan rounded-full" />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
          <Sparkles size={14} className="text-cyan" />
          <span className="text-xs text-textMuted">Pro Workspace</span>
        </div>

        <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo to-cyan shadow-glow flex items-center justify-center text-xs font-semibold text-white">
          {(user?.name || "U").charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
