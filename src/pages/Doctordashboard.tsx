// ============================================
// CareSync • DoctorDashboard.tsx
// Clean Futuristic Medical Interface (Option 2 + Filters + Logout)
// - Stat cards
// - Pending Requests (Accept / Reject)
// - Schedule filters: Today | Tomorrow | Week | All (Next 7 days)
// - Join Video Call
// Matches BookAppointment / DoctorAppointments / MyAppointments styling
// ============================================

import { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  Activity,
  TrendingUp,
  FileText,
  Video,
  Clock,
  Stethoscope,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { format, isSameDay, addDays } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { appointmentService } from "../services/appointmentService";
import type { Appointment } from "../types";
import VideoCall from "./VideoCall";
import { useNavigate } from "react-router-dom";

type ScheduleFilter = "today" | "tomorrow" | "week" | "all";

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Video call state
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Schedule filter state
  const [scheduleFilter, setScheduleFilter] =
    useState<ScheduleFilter>("today");

  // Fetch all doctor appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await appointmentService.getMyAppointments({});
        if (response.success && response.data) {
          // @ts-ignore backend shape
          setAppointments(response.data.appointments || []);
        }
      } catch (err) {
        setError("Unable to load your schedule. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const weekEnd = addDays(today, 7);

  // Derived data
  const pendingRequests = appointments.filter(
    (apt) => apt.status === "pending"
  );

  const confirmedAppointments = appointments.filter(
    (apt) => apt.status === "confirmed"
  );

  const todaysAppointments = confirmedAppointments.filter((apt) =>
    isSameDay(new Date(apt.date), today)
  );

  const filteredScheduleAppointments = confirmedAppointments.filter((apt) => {
    const date = new Date(apt.date);
    switch (scheduleFilter) {
      case "today":
        return isSameDay(date, today);
      case "tomorrow":
        return isSameDay(date, tomorrow);
      case "week":
        return date >= today && date <= weekEnd;
      case "all":
      default:
        return true;
    }
  });

  const todaysCount = todaysAppointments.length;
  const pendingCount = pendingRequests.length;
  const patientsThisMonth = new Set(
    appointments
      .filter((apt) => (apt as any).patient?.id)
      .map((apt) => (apt as any).patient.id)
  ).size;

  const consultationsCount = appointments.filter(
    (apt) => apt.status === "completed"
  ).length;

  // ---- Quick status change (Accept / Reject) ----
  const handleQuickStatusChange = async (
    appointment: Appointment,
    status: "confirmed" | "rejected"
  ) => {
    try {
      setUpdatingId(appointment.id);
      setError("");
      await appointmentService.updateAppointmentStatus(
        appointment.id,
        status
      );
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointment.id ? { ...a, status } : a
        )
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to update appointment. Please try again."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ---- Start video call ----
  const handleStartVideoCall = (appointment: Appointment) => {
    if (appointment.status !== "confirmed") return;

    setSelectedAppointment(appointment);
    setIsVideoCallOpen(true);
  };

  // ---- Logout ----
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const scheduleFilterLabelMap: Record<ScheduleFilter, string> = {
    today: "Today",
    tomorrow: "Tomorrow",
    week: "Next 7 days",
    all: "All confirmed",
  };

  // -------------------------
  // LOADING STATE
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="bg-white/5 border border-white/10 rounded-3xl px-8 py-6 backdrop-blur-xl flex flex-col items-center gap-3 shadow-[0_18px_45px_rgba(0,0,0,0.6)]">
          <div className="h-9 w-9 border-2 border-slate-500 border-t-sky-400 rounded-full animate-spin" />
          <p className="text-xs text-slate-300 tracking-wide">
            Loading your CareSync dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* ====================================
            HEADER
        ====================================== */}
        <header className="mb-8">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-sky-400 uppercase mb-2">
            CareSync / Doctor
          </p>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-semibold text-white">
                Welcome back, Dr. {user?.profile.lastName}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                {user?.doctorProfile?.specialization || "CareSync Specialist"} •{" "}
                {user?.doctorProfile?.yearsOfExperience || 0} years experience
              </p>
            </div>

            {/* Doctor Identity + Logout */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/15 px-5 py-3 rounded-2xl backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.6)]">
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
              <button
                onClick={handleLogout}
                className="ml-2 inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:bg-white/10 transition"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* ====================================
            ERROR BANNER
        ====================================== */}
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-50 flex items-start gap-2">
            <AlertCircle size={16} className="mt-px" />
            <span>{error}</span>
          </div>
        )}

        {/* ====================================
            STAT CARDS — Clean Futuristic
        ====================================== */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            {
              label: "Today's Appointments",
              value: todaysCount.toString(),
              icon: <Calendar size={20} className="text-sky-300" />,
            },
            {
              label: "Pending Requests",
              value: pendingCount.toString(),
              icon: <Clock size={20} className="text-yellow-300" />,
            },
            {
              label: "Patients This Month",
              value: patientsThisMonth.toString(),
              icon: <Users size={20} className="text-emerald-300" />,
            },
            {
              label: "Consultations Completed",
              value: consultationsCount.toString(),
              icon: <Activity size={20} className="text-emerald-300" />,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.6)]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  {stat.icon}
                </div>
                <p className="text-sm text-slate-300">{stat.label}</p>
              </div>
              <p className="text-3xl font-semibold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {/* ====================================
            MAIN STACK (Option 2)
        ====================================== */}
        <section className="space-y-8">
          {/* ============================
              PENDING REQUESTS
          ============================== */}
          <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.7)]">
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Pending requests
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  New appointment requests awaiting your confirmation.
                </p>
              </div>
              {pendingCount > 0 && (
                <span className="inline-flex items-center justify-center rounded-full bg-amber-500/20 border border-amber-400/60 px-3 py-1 text-[11px] text-amber-100">
                  {pendingCount} waiting
                </span>
              )}
            </div>

            <div className="p-6">
              {pendingRequests.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-400">
                  No pending requests at the moment.
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.slice(0, 5).map((apt) => {
                    const patient: any = (apt as any).patient || null;
                    const first = patient?.profile?.firstName || "Patient";
                    const last = patient?.profile?.lastName || "";
                    const dateLabel = format(
                      new Date(apt.date),
                      "EEE, MMM dd"
                    );

                    return (
                      <div
                        key={apt.id}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-semibold text-white">
                            {(first[0] || "P") +
                              (last[0] || "").toUpperCase()}
                          </div>
                          <div className="text-xs text-slate-100">
                            <p className="font-medium">
                              {first} {last}
                            </p>
                            <p className="text-slate-400">
                              {dateLabel} • {apt.startTime} – {apt.endTime}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">
                              {apt.reason}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuickStatusChange(apt, "rejected")
                            }
                            disabled={updatingId === apt.id}
                            className="px-3 py-2 rounded-2xl text-[11px] font-medium bg-rose-500/10 border border-rose-500/40 text-rose-100 hover:bg-rose-500/20 transition disabled:opacity-50"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() =>
                              handleQuickStatusChange(apt, "confirmed")
                            }
                            disabled={updatingId === apt.id}
                            className="px-3 py-2 rounded-2xl text-[11px] font-semibold bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm transition disabled:opacity-50"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ============================
              SCHEDULE (FILTERED)
          ============================== */}
          <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.7)]">
            <div className="px-6 py-5 border-b border-white/10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Schedule
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {scheduleFilter === "today" && format(today, "EEEE, MMMM dd")}
                  {scheduleFilter === "tomorrow" &&
                    `Tomorrow · ${format(tomorrow, "EEEE, MMM dd")}`}
                  {scheduleFilter === "week" &&
                    `Next 7 days · ${format(
                      today,
                      "MMM dd"
                    )} – ${format(weekEnd, "MMM dd")}`}
                  {scheduleFilter === "all" &&
                    "All confirmed upcoming appointments"}
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {([
                  { key: "today", label: "Today" },
                  { key: "tomorrow", label: "Tomorrow" },
                  { key: "week", label: "Week" },
                  { key: "all", label: "All" },
                ] as { key: ScheduleFilter; label: string }[]).map((tab) => {
                  const active = scheduleFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setScheduleFilter(tab.key)}
                      className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium border transition ${
                        active
                          ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white border-transparent shadow-[0_0_18px_rgba(56,189,248,0.7)]"
                          : "bg-white/5 border-white/15 text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              {filteredScheduleAppointments.length === 0 ? (
                <div className="text-center py-10">
                  <Calendar className="mx-auto text-slate-600 mb-3" size={40} />
                  <p className="text-sm text-slate-400">
                    No confirmed appointments in this view.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredScheduleAppointments.map((apt) => {
                    const patient: any = (apt as any).patient || null;
                    const first = patient?.profile?.firstName || "Patient";
                    const last = patient?.profile?.lastName || "";
                    const dateLabel = format(
                      new Date(apt.date),
                      "EEE, MMM dd"
                    );

                    return (
                      <div
                        key={apt.id}
                        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-sky-300 font-semibold text-xs w-28 text-center">
                            <div>{dateLabel}</div>
                            <div className="mt-1 text-slate-100">
                              {apt.startTime}
                            </div>
                          </div>
                          <div className="text-xs text-slate-100">
                            <p className="font-medium">
                              {first} {last}
                            </p>
                            <p className="text-slate-400">
                              {apt.reason || "Consultation"}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleStartVideoCall(apt)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 text-xs font-semibold text-white shadow-[0_0_18px_rgba(56,189,248,0.7)] hover:from-emerald-600 hover:to-sky-600 transition"
                        >
                          <Video size={18} />
                          Join video call
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =======================
            VIDEO CALL MODAL
           ======================= */}
        {isVideoCallOpen && selectedAppointment && user && (
          <VideoCall
            isOpen={isVideoCallOpen}
            onClose={() => {
              setIsVideoCallOpen(false);
              setSelectedAppointment(null);
            }}
            appointmentId={selectedAppointment.id}
            otherUser={{
              firstName:
                (selectedAppointment as any).patient?.profile?.firstName ||
                "Patient",
              lastName:
                (selectedAppointment as any).patient?.profile?.lastName || "",
              role: "patient",
            }}
            currentUser={{
              id: user.id,
              profile: {
                firstName: user.profile.firstName,
                lastName: user.profile.lastName,
              },
              role: "doctor",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
