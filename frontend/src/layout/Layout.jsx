import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <div className="relative flex min-h-screen bg-background overflow-hidden">
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-indigo/10 blur-3xl" />
      <div className="pointer-events-none absolute top-32 -right-20 h-80 w-80 rounded-full bg-cyan/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_8%,rgba(6,182,212,0.12),transparent_34%),radial-gradient(circle_at_10%_88%,rgba(99,102,241,0.16),transparent_36%)]" />

      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10">
        <Topbar />
        <main className="relative p-4 sm:p-6 lg:p-8 flex-1">
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.2)_1px,transparent_1px)] [background-size:36px_36px]" />
          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
