// ============================================
// CareSync • Sidebar.tsx
// Futuristic Neon Glass Sidebar
// ============================================

import { Link, useNavigate } from "react-router-dom";
import { X, Calendar, Home, LogOut, User, Video } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login");
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all ${
        isOpen ? "bg-black/60 backdrop-blur-sm" : "pointer-events-none opacity-0"
      }`}
    >
      {/* Panel */}
      <aside
        className={`absolute left-0 top-0 w-72 h-full bg-white/10 backdrop-blur-2xl border-r border-white/20 shadow-[0_0_25px_rgba(56,189,248,0.3)] transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-300 hover:text-white transition"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="px-6 py-8">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
            Menu
          </h2>
          {user && (
            <p className="mt-2 text-xs text-slate-300">
              {user.profile.firstName} {user.profile.lastName} ·{" "}
              <span className="capitalize">{user.role}</span>
            </p>
          )}
        </div>

        {/* Links */}
        <nav className="px-3 space-y-2 text-sm">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:bg-white/10 transition"
          >
            <Home size={18} className="text-sky-300" />
            <span>Home</span>
          </Link>

          {/* Patient links */}
          {user?.role === "patient" && (
            <>
              <Link
                to="/doctors"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:bg-white/10 transition"
              >
                <User size={18} className="text-emerald-300" />
                <span>Find Doctors</span>
              </Link>

              <Link
                to="/patient/appointments"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:bg-white/10 transition"
              >
                <Calendar size={18} className="text-sky-300" />
                <span>My Appointments</span>
              </Link>
            </>
          )}

          {/* Doctor links */}
          {user?.role === "doctor" && (
            <>
              <Link
                to="/doctor/dashboard"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:bg-white/10 transition"
              >
                <Home size={18} className="text-emerald-300" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/doctor/appointments"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-200 hover:bg-white/10 transition"
              >
                <Calendar size={18} className="text-sky-300" />
                <span>Appointments</span>
              </Link>
            </>
          )}

          {/* (Optional) Video Call Hub in future */}
          <button
            type="button"
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-200 hover:bg-white/10 transition"
            disabled
          >
            <Video size={18} className="text-purple-300" />
            <span className="opacity-60">Video Consultations (soon)</span>
          </button>

          {/* Logout */}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-rose-300 hover:bg-rose-500/10 transition mt-4 text-sm"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          )}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
