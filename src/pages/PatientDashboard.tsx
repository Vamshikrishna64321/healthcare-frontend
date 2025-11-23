// ========================================================
// CareSync • PatientDashboard.tsx
// Futuristic Neon Glass (Dark Mode)
// Matches entire CareSync redesign system
// ========================================================

import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Heart,
  Activity,
  Plus,
  ArrowRight,
  Video,
} from "lucide-react";

const PatientDashboard = () => {
  const { user, logout } = useAuth();

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "Nov 25, 2024",
      time: "10:00 AM",
      status: "confirmed",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* ================================
            HEADER (NOW WITH LOGOUT)
        ================================ */}
        <header className="mb-10 flex justify-between items-start">

          {/* LEFT: Welcome */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-sky-400 mb-2 font-semibold">
              CareSync / Patient
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-1">
              Welcome back, {user?.profile.firstName}! 👋
            </h1>

            <p className="text-slate-400 text-sm">
              Here’s your personalized health overview.
            </p>
          </div>

          {/* RIGHT: Identity + Logout */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.4)]">

            {/* User Initials */}
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 
                            flex items-center justify-center text-white font-semibold text-sm">
              {user?.profile.firstName?.[0]}
              {user?.profile.lastName?.[0]}
            </div>

            {/* User name + role */}
            <div className="text-[11px] text-slate-200 leading-tight">
              <p className="font-medium">
                {user?.profile.firstName} {user?.profile.lastName}
              </p>
              <p className="text-slate-400">Patient</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="ml-3 px-3 py-1.5 text-[11px] font-semibold text-white 
                         bg-rose-600/80 hover:bg-rose-600 transition rounded-xl"
            >
              Logout
            </button>
          </div>
        </header>

        {/* ================================
            STATS GRID
        ================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: <Calendar className="text-sky-300" size={26} />,
              label: "Appointments • This Month",
              value: "4",
              accent: "from-sky-500/30 to-blue-500/20",
            },
            {
              icon: <Clock className="text-emerald-300" size={26} />,
              label: "Upcoming • Next 7 Days",
              value: "2",
              accent: "from-emerald-500/30 to-green-500/20",
            },
            {
              icon: <User className="text-purple-300" size={26} />,
              label: "Active Doctors",
              value: "3",
              accent: "from-purple-500/30 to-pink-500/20",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.4)]"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                  {item.icon}
                </div>

                <div
                  className={`px-3 py-1 bg-gradient-to-r ${item.accent} text-[10px] uppercase text-white font-semibold rounded-full`}
                >
                  Live
                </div>
              </div>

              <p className="text-3xl font-semibold text-white mb-1">
                {item.value}
              </p>

              <p className="text-xs text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* =====================================
              LEFT: APPOINTMENTS + METRICS
          ===================================== */}
          <div className="lg:col-span-2 space-y-10">

            {/* ================================
                UPCOMING APPOINTMENTS
            ================================ */}
            <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-xl">
              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Upcoming Appointments</h2>

                <Link
                  to="/patient/appointments"
                  className="text-sky-300 hover:text-sky-200 text-sm font-medium flex items-center gap-1"
                >
                  View All <ArrowRight size={16} />
                </Link>
              </div>

              <div className="p-6">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-slate-600 mb-4" />
                    <h3 className="text-lg font-semibold text-white">
                      No upcoming appointments
                    </h3>
                    <p className="text-slate-400 text-sm mt-2 mb-4">
                      Book your first consultation
                    </p>

                    <Link
                      to="/doctors"
                      className="inline-flex items-center gap-2 px-6 py-2 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 text-sm font-semibold shadow hover:opacity-90"
                    >
                      <Plus size={18} />
                      Book Now
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white text-lg font-semibold shadow-xl">
                            {apt.doctor.split(" ").map((x) => x[0]).join("")}
                          </div>

                          <div>
                            <h4 className="text-white font-medium">{apt.doctor}</h4>
                            <p className="text-sky-300 text-sm">{apt.specialty}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium text-white">{apt.date}</p>
                          <p className="text-sm text-slate-400">{apt.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ================================
                HEALTH METRICS
            ================================ */}
            <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-xl p-6">
              <h2 className="text-lg font-semibold mb-6">Health Metrics</h2>

              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-2xl p-5 bg-gradient-to-br from-sky-500/10 to-sky-600/10 border border-sky-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="text-sky-300" size={20} />
                    <span className="text-sm text-slate-300">Blood Pressure</span>
                  </div>
                  <p className="text-2xl font-semibold text-white">120/80</p>
                  <p className="text-xs text-slate-400 mt-1">Normal</p>
                </div>

                <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="text-emerald-300" size={20} />
                    <span className="text-sm text-slate-300">Heart Rate</span>
                  </div>
                  <p className="text-2xl font-semibold text-white">72 bpm</p>
                  <p className="text-xs text-slate-400 mt-1">Normal</p>
                </div>
              </div>
            </div>

          </div>

          {/* ================================
              RIGHT SIDEBAR
          ================================ */}
          <div className="space-y-8">

            {/* QUICK ACTIONS */}
            <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-5">Quick Actions</h3>

              <div className="space-y-3">
                <Link
                  to="/doctors"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                >
                  <div className="h-10 w-10 rounded-xl bg-sky-500/20 flex items-center justify-center border border-sky-500/40">
                    <Calendar className="text-sky-300" size={20} />
                  </div>
                  <span className="text-sm text-white font-medium">
                    Book Appointment
                  </span>
                </Link>

                <Link
                  to="/patient/appointments"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                >
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
                    <Clock className="text-emerald-300" size={20} />
                  </div>
                  <span className="text-sm text-white font-medium">
                    View Appointments
                  </span>
                </Link>

                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/40">
                    <Video className="text-purple-300" size={20} />
                  </div>
                  <span className="text-sm text-white font-medium">
                    Video Consultation
                  </span>
                </button>
              </div>
            </div>

            {/* HEALTH TIP */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-sky-600 to-emerald-600 shadow-xl text-white">
              <h3 className="text-lg font-bold mb-2">💡 Health Tip</h3>
              <p className="text-sm text-slate-100 mb-3">
                Stay hydrated — drink at least 8 cups of water each day.
              </p>
              <button className="text-sm underline hover:no-underline">
                Learn More →
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
