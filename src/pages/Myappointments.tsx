// ============================================
// CareSync • MyAppointments.tsx
// Futuristic Neon Glass (Dark Mode) — Clean Version
// (Video call notice + 10 min message removed)
// ============================================

import { useState, useEffect } from "react";
import { appointmentService } from "../services/appointmentService";
import type { Appointment } from "../types";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Video,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import VideoCall from "./VideoCall";
import { useAuth } from "../context/AuthContext";

const MyAppointments = () => {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Inline cancel
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filter !== "all") params.status = filter;

      const response = await appointmentService.getMyAppointments(params);
      if (response.success && response.data) {
        // @ts-ignore
        setAppointments(response.data.appointments || []);
      }
    } catch {
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      setCancelLoading(true);
      await appointmentService.cancelAppointment(appointmentId);
      setConfirmCancelId(null);
      setInfo("Appointment cancelled successfully.");
      fetchAppointments();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to cancel appointment."
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const handleJoinVideoCall = (appointment: Appointment) => {
    if (appointment.status !== "confirmed") {
      setInfo("Only confirmed appointments can join video calls.");
      return;
    }
    setSelectedAppointment(appointment);
    setIsVideoCallOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/10 border border-yellow-500/40 text-yellow-200",
      confirmed:
        "bg-emerald-500/10 border border-emerald-500/40 text-emerald-200",
      completed: "bg-sky-500/10 border border-sky-500/40 text-sky-200",
      cancelled: "bg-rose-500/10 border border-rose-500/40 text-rose-200",
      rejected: "bg-slate-500/10 border border-slate-500/40 text-slate-200",
    };

    const icons: Record<string, JSX.Element> = {
      pending: <Clock size={14} />,
      confirmed: <CheckCircle size={14} />,
      completed: <CheckCircle size={14} />,
      cancelled: <XCircle size={14} />,
      rejected: <XCircle size={14} />,
    };

    const base =
      styles[status] ||
      "bg-slate-500/10 border border-slate-500/40 text-slate-200";

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium ${base}`}
      >
        {icons[status]}
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  // -------------------------
  // LOADING SCREEN
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="h-10 w-10 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black py-10">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <header className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.25em] text-sky-400 font-semibold mb-2">
            CareSync / Appointments
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            My Appointments
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage upcoming visits and join video calls.
          </p>
        </header>

        {/* Error & Info */}
        {(error || info) && (
          <div className="mb-6 space-y-3">
            {error && (
              <div className="text-sm text-rose-200 bg-rose-500/10 border border-rose-500/30 px-4 py-3 rounded-xl backdrop-blur-xl">
                {error}
              </div>
            )}
            {info && (
              <div className="text-sm text-emerald-200 bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 rounded-xl backdrop-blur-xl">
                {info}
              </div>
            )}
          </div>
        )}

        {/* Filter */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-xl bg-sky-500/20 flex items-center justify-center">
              <Filter size={16} className="text-sky-300" />
            </div>
            <p className="text-xs text-slate-300">Filter by status</p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {["all", "pending", "confirmed", "completed", "cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilter(status);
                    setInfo("");
                    setError("");
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap border transition ${
                    filter === status
                      ? "bg-gradient-to-r from-sky-500 to-emerald-500 text-white border-transparent shadow-[0_0_18px_rgba(56,189,248,0.6)]"
                      : "bg-white/5 border-white/15 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Empty */}
        {appointments.length === 0 ? (
          <div className="rounded-3xl bg-white/5 border border-white/10 p-12 text-center backdrop-blur-xl shadow-xl">
            <Calendar size={48} className="mx-auto text-slate-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No appointments found
            </h3>
            <p className="text-sm text-slate-400 mb-5">
              {filter === "all"
                ? "Book your first appointment."
                : `No ${filter} appointments.`}
            </p>
            <a
              href="/doctors"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition"
            >
              Find a doctor
            </a>
          </div>
        ) : (
          <div className="space-y-5">
            {appointments.map((appointment) => {
              const isConfirmed = appointment.status === "confirmed";
              const isPending = appointment.status === "pending";
              const showCancelConfirm = confirmCancelId === appointment.id;

              return (
                <div
                  key={appointment.id}
                  className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl shadow-xl"
                >
                  {/* Top Row */}
                  <div className="flex justify-between items-start mb-4">
                    <div>{getStatusBadge(appointment.status)}</div>
                    <div className="text-[11px] text-slate-400">
                      Booked:{" "}
                      {format(new Date(appointment.createdAt), "MMM dd, yyyy")}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Details */}
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-3">
                        Appointment details
                      </h3>

                      <div className="space-y-2 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-sky-300" />
                          {format(
                            new Date(appointment.date),
                            "EEEE, MMMM dd, yyyy"
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-emerald-300" />
                          {appointment.startTime} – {appointment.endTime}
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs font-medium text-slate-200 mb-1">
                          Reason
                        </p>
                        <p className="text-xs text-slate-300 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                          {appointment.reason}
                        </p>
                      </div>

                      {appointment.patientNotes && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-slate-200 mb-1">
                            Your notes
                          </p>
                          <p className="text-xs text-slate-300 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                            {appointment.patientNotes}
                          </p>
                        </div>
                      )}

                      {appointment.doctorNotes && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-sky-200 mb-1">
                            Doctor's notes
                          </p>
                          <p className="text-xs text-sky-100 bg-sky-500/10 border border-sky-500/40 rounded-xl px-3 py-2">
                            {appointment.doctorNotes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Doctor */}
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-3">
                        Doctor
                      </h3>

                      <div className="rounded-2xl bg-slate-900/60 border border-slate-700/70 p-4">
                        {typeof appointment.doctor === "object" &&
                        appointment.doctor ? (
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-xs font-semibold text-white">
                              {appointment.doctor.profile?.firstName?.[0] || "D"}
                              {appointment.doctor.profile?.lastName?.[0] || "R"}
                            </div>

                            <div className="text-xs">
                              <p className="font-semibold text-slate-50">
                                Dr. {appointment.doctor.profile?.firstName}{" "}
                                {appointment.doctor.profile?.lastName}
                              </p>
                              <p className="text-slate-400">
                                {appointment.doctor.doctorProfile
                                  ?.specialization || "Doctor"}
                              </p>
                              {appointment.doctor.doctorProfile
                                ?.consultationFee && (
                                <p className="text-slate-500">
                                  Fee: $
                                  {
                                    appointment.doctor.doctorProfile
                                      .consultationFee
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-11 w-11 rounded-full bg-sky-600 flex items-center justify-center text-xs font-semibold text-white">
                              Dr
                            </div>
                            <div className="text-xs">
                              <p className="font-semibold text-slate-50">
                                Doctor
                              </p>
                              <p className="text-slate-400">Loading…</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  {(isPending || isConfirmed) && (
                    <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                      <div className="flex flex-wrap gap-3">

                        {isConfirmed && (
                          <button
                            onClick={() => handleJoinVideoCall(appointment)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-xs font-semibold text-white shadow-lg hover:opacity-90 transition"
                          >
                            <Video size={16} />
                            Join video call
                          </button>
                        )}

                        <button
                          onClick={() =>
                            setConfirmCancelId(
                              confirmCancelId === appointment.id
                                ? null
                                : appointment.id
                            )
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/40 text-xs font-semibold text-rose-200 hover:bg-rose-500/20 transition"
                        >
                          <XCircle size={16} />
                          Cancel appointment
                        </button>
                      </div>

                      {/* Cancel confirm */}
                      {showCancelConfirm && (
                        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/40 px-4 py-3 text-[11px] text-rose-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <p>Are you sure? This cannot be undone.</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setConfirmCancelId(null)}
                              className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-100 hover:bg-white/10 transition"
                            >
                              Keep
                            </button>
                            <button
                              onClick={() =>
                                handleCancelAppointment(appointment.id)
                              }
                              disabled={cancelLoading}
                              className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 transition disabled:opacity-50"
                            >
                              {cancelLoading ? "Cancelling…" : "Yes, cancel"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

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
                selectedAppointment.doctor?.profile?.firstName || "Doctor",
              lastName: selectedAppointment.doctor?.profile?.lastName || "",
              role:
                selectedAppointment.doctor?.doctorProfile?.specialization ||
                "Doctor",
            }}
            currentUser={{
              id: user.id,
              profile: {
                firstName: user.profile.firstName,
                lastName: user.profile.lastName,
              },
              role: "patient",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
