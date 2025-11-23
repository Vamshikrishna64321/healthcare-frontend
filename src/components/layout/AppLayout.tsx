import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Stethoscope, Menu, X } from "lucide-react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-black text-white">

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0f172a]/80 backdrop-blur-xl border-r border-white/10 shadow-xl transform transition-transform duration-300 z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-6 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <Stethoscope size={22} className="text-sky-400" />
            <span className="text-xl font-semibold text-white">CareSync</span>
          </div>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} className="text-slate-300" />
          </button>
        </div>

        <nav className="px-6 py-6 space-y-4">
          <Link
            to="/"
            className={`block px-4 py-2 rounded-xl text-sm font-medium ${
              location.pathname === "/"
                ? "bg-sky-500 text-white shadow"
                : "text-slate-300 hover:bg-white/10"
            }`}
          >
            Home
          </Link>

          <Link
            to="/doctors"
            className={`block px-4 py-2 rounded-xl text-sm font-medium ${
              location.pathname === "/doctors"
                ? "bg-sky-500 text-white shadow"
                : "text-slate-300 hover:bg-white/10"
            }`}
          >
            Find Doctors
          </Link>
        </nav>
      </aside>

      {/* TOP BAR */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0b1120]/60 backdrop-blur-xl border-b border-white/10 flex items-center px-4 z-40">
        <button onClick={() => setSidebarOpen(true)}>
          <Menu size={26} className="text-white" />
        </button>

        <div className="mx-auto text-lg font-semibold text-white tracking-wide">
          CareSync
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 pt-20 px-6 pb-10">{children}</main>
    </div>
  );
};

export default AppLayout;
