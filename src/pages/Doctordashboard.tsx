// ============================================
// CareSync • DoctorDashboard.tsx
// Clean Futuristic Medical Interface (Professional UI)
// Matches DoctorAppointments + MyAppointments style
// ============================================

import {
  Calendar,
  Users,
  Activity,
  TrendingUp,
  FileText,
  Video,
  Clock,
  Stethoscope,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DoctorDashboard = () => {
  const { user } = useAuth();

  // Dummy data — replace with API later
  const todayAppointments = [
    { time: "09:00 AM", patient: "John Doe", type: "General Checkup" },
    { time: "11:30 AM", patient: "Sarah Smith", type: "Follow-up Review" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* ====================================
            HEADER
        ====================================== */}
        <header className="mb-10">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-sky-400 uppercase mb-2">
            CareSync / Doctor
          </p>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-semibold text-white">
                Welcome back, Dr. {user?.profile.lastName}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                {user?.doctorProfile?.specialization} •{" "}
                {user?.doctorProfile?.yearsOfExperience} years experience
              </p>
            </div>

            {/* Doctor Identity Card */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/15 px-5 py-3 rounded-2xl backdrop-blur-xl shadow-md">
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                {user?.profile.firstName?.[0] || "D"}
                {user?.profile.lastName?.[0] || ""}
              </div>
              <div className="text-xs text-slate-200">
                <p className="font-medium">
                  Dr. {user?.profile.firstName} {user?.profile.lastName}
                </p>
                <p className="text-slate-400">CareSync Provider</p>
              </div>
            </div>
          </div>
        </header>

        {/* ====================================
            STAT CARDS — Clean, Professional
        ====================================== */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: "Today's Appointments",
              value: "8",
              icon: <Calendar size={20} className="text-sky-300" />,
            },
            {
              label: "Pending Approvals",
              value: "3",
              icon: <Clock size={20} className="text-yellow-300" />,
            },
            {
              label: "Patients This Month",
              value: "45",
              icon: <Users size={20} className="text-emerald-300" />,
            },
            {
              label: "Consultation Fee",
              value: `$${user?.doctorProfile?.consultationFee}`,
              icon: <Stethoscope size={20} className="text-purple-300" />,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl shadow-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  {stat.icon}
                </div>
                <p className="text-sm text-slate-300">{stat.label}</p>
              </div>
              <p className="text-3xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </section>

        {/* ====================================
            MAIN GRID
        ====================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT COLUMN — Schedule + Performance */}
          <div className="lg:col-span-2 space-y-10">

            {/* ============================
                TODAY'S SCHEDULE
            ============================== */}
            <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-xl">
              <div className="px-6 py-5 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">Today's Schedule</h2>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date().toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="p-6">
                {todayAppointments.length === 0 ? (
                  <div className="text-center py-10">
                    <Calendar className="mx-auto text-slate-600 mb-4" size={48} />
                    <p className="text-slate-500 text-sm">No appointments today.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayAppointments.map((apt, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-sky-300 font-semibold text-sm w-20 text-center">
                            {apt.time}
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{apt.patient}</h4>
                            <p className="text-xs text-slate-400">{apt.type}</p>
                          </div>
                        </div>

                        <button className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition">
                          <Video size={18} className="text-sky-300" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ============================
                MONTHLY PERFORMANCE
            ============================== */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-6">This Month</h2>

              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    label: "Consultations",
                    value: "45",
                    icon: <Activity size={28} className="text-sky-300 mx-auto mb-2" />,
                  },
                  {
                    label: "Satisfaction",
                    value: "95%",
                    icon: <TrendingUp size={28} className="text-emerald-300 mx-auto mb-2" />,
                  },
                  {
                    label: "Reports",
                    value: "38",
                    icon: <FileText size={28} className="text-purple-300 mx-auto mb-2" />,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="text-center bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl"
                  >
                    {item.icon}
                    <p className="text-xl font-semibold text-white">{item.value}</p>
                    <p className="text-xs text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR — Quick Actions */}
          <div className="space-y-8">

            {/* Quick Actions */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-5">
                Quick Actions
              </h3>

              <div className="space-y-3">
                {[
                  { label: "View Schedule", icon: <Calendar size={18} className="text-sky-300" /> },
                  { label: "Patient List", icon: <Users size={18} className="text-emerald-300" /> },
                  { label: "Medical Records", icon: <FileText size={18} className="text-purple-300" /> },
                ].map((action, idx) => (
                  <button
                    key={idx}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                      {action.icon}
                    </div>
                    <span className="text-sm text-white font-medium">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;
