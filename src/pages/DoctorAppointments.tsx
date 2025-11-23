// ============================================
// CareSync • DoctorAppointments.tsx
// Hybrid Futuristic Medical Console (Doctor)
// ============================================

import { useState, useEffect } from "react";
import { appointmentService } from "../services/appointmentService";
import type { Appointment } from "../types";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Video,
  User,
  Phone,
  AlertCircle,
  X,
} from "lucide-react";
import { format } from "date-fns";
import VideoCall from "./VideoCall";
import { useAuth } from "../context/AuthContext";

const FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"] as const;
type FilterType = (typeof FILTERS)[number];

type PendingActionType = "confirm" | "reject" | "complete" | null;

interface PendingActionState {
  type: PendingActionType;
  appointment: Appointment | null;
  title: string;
  ctaLabel: string;
  noteLabel: string;
  statusToSet: string | null;
}

const statusStyleMap: Record<string, string> = {
  pending:
    "bg-amber-50/90 text-amber-900 border-amber-200",
  confirmed:
    "bg-emerald-50/90 text-emerald-900 border-emerald-200",
  completed:
    "bg-sky-50/90 text-sky-900 border-sky-200",
  cancelled:
    "bg-rose-50/90 text-rose-900 border-rose-200",
  rejected:
    "bg-slate-50/90 text-slate-800 border-slate-200",
};

const DoctorAppointments = () => {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Video call
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Custom glass dialog for confirm / reject / complete
  const [pendingAction, setPendingAction] = useState<PendingActionState>({
    type: null,
    appointment: null,
    title: "",
    ctaLabel: "",
    noteLabel: "",
    statusToSet: null,
  });
  const [pendingNote, setPendingNote] = useState("");

  // -----------------------------
  // Data loading
  // -----------------------------
  useEffect(() => {
    void fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const params: any = {};
      if (filter !== "all") params.status = filter;

      const response = await appointmentService.getMyAppointments(params);
      if (response.success && response.data) {
        // @ts-ignore backend shape
        setAppointments(response.data.appointments || []);
      }
    } catch {
      setError("Unable to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Action dialog helpers
  // -----------------------------
  const openActionModal = (type: PendingActionType, appointment: Appointment) => {
    if (!type) return;

    let title = "";
    let ctaLabel = "";
    let noteLabel = "";
    let statusToSet: string | null = null;

    if (type === "confirm") {
      title = "Confirm this appointment";
      ctaLabel = "Confirm appointment";
      noteLabel = "Optional note for your patient";
      statusToSet = "confirmed";
    } else if (type === "reject") {
      title = "Reject this appointment";
      ctaLabel = "Reject appointment";
      noteLabel = "Reason for rejection (optional)";
      statusToSet = "rejected";
    } else if (type === "complete") {
      title = "Mark appointment as completed";
      ctaLabel = "Save & mark as completed";
      noteLabel = "Consultation notes (optional, for your records)";
      statusToSet = "completed";
    }

    setPendingAction({
      type,
      appointment,
      title,
      ctaLabel,
      noteLabel,
      statusToSet,
    });
    setPendingNote("");
  };

  const closeActionModal = () => {
    setPendingAction({
      type: null,
      appointment: null,
      title: "",
      ctaLabel: "",
      noteLabel: "",
      statusToSet: null,
    });
    setPendingNote("");
  };

  const handleApplyAction = async () => {
    if (
      !pendingAction.type ||
      !pendingAction.statusToSet ||
      !pendingAction.appointment
    ) {
      return;
    }

    try {
      setUpdatingId(pendingAction.appointment.id);
      await appointmentService.updateAppointmentStatus(
        pendingAction.appointment.id,
        pendingAction.statusToSet,
        pendingNote || undefined
      );
      closeActionModal();
      await fetchAppointments();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Unable to update appointment at the moment."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // -----------------------------
  // Video call
  // -----------------------------
  const handleStartVideoCall = (appointment: Appointment) => {
    if (appointment.status !== "confirmed") {
      setError("Only confirmed appointments can start a video consultation.");
      setTimeout(() => setError(""), 2500);
      return;
    }

    setSelectedAppointment(appointment);
    setIsVideoCallOpen(true);
  };

  // -----------------------------
  // UI helpers
  // -----------------------------
  const renderStatusBadge = (status: string) => {
    const style = statusStyleMap[status] || statusStyleMap.rejected;
    return (
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium border ${style}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // -----------------------------
  // Loading screen
  // -----------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="bg-white/10 border border-white/20 rounded-3xl px-8 py-6 backdrop-blur-xl flex flex-col items-center gap-3 shadow-[0_18px_45px_rgba(0,0,0,0.5)]">
          <div className="h-9 w-9 border-2 border-slate-500 border-t-sky-400 rounded-full animate-spin" />
          <p className="text-xs text-slate-200 tracking-wide">
            Syncing your CareSync schedule…
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.25em] text-sky-400 uppercase mb-2">
              CareSync / Doctor
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-white">
              Consultation queue
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Review incoming requests, confirm or complete visits, and join
              live video consultations in one streamlined console.
            </p>
          </div>

          {user && (
            <div className="flex items-center gap-3 bg-white/5 border border-white/15 rounded-2xl px-4 py-3 backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.45)]">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-xs font-semibold text-white">
                {user.profile.firstName?.[0] || "D"}
                {user.profile.lastName?.[0] || ""}
              </div>
              <div className="text-[11px] text-slate-200">
                <p className="font-medium">
                  Dr. {user.profile.firstName} {user.profile.lastName}
                </p>
                <p className="text-slate-400">
                  {user.doctorProfile?.specialization || "CareSync provider"}
                </p>
              </div>
            </div>
          )}
        </header>

        {/* Filters */}
        <section className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 mb-6 backdrop-blur-xl">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((s) => {
                const active = filter === s;
                return (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium transition ${
                      active
                        ? "bg-white text-slate-900 shadow-sm"
                        : "bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {s === "all"
                      ? "All"
                      : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                );
              })}
            </div>
            {appointments.length > 0 && (
              <p className="text-[11px] text-slate-400">
                {appointments.length} result
                {appointments.length > 1 ? "s" : ""} in this view
              </p>
            )}
          </div>
        </section>

        {/* Error banner */}
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-50 flex items-start gap-2">
            <AlertCircle size={16} className="mt-px" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty state */}
        {appointments.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl px-8 py-12 text-center backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.65)]">
            <Calendar size={48} className="mx-auto text-slate-500 mb-3" />
            <h2 className="text-lg font-semibold text-white mb-1">
              No appointments in this view
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {filter === "all"
                ? "You have no scheduled appointments yet."
                : `There are no ${filter} appointments to show right now.`}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {appointments.map((appointment) => {
              const patient: any = (appointment as any).patient || null;
              const first = patient?.profile?.firstName || "Patient";
              const last = patient?.profile?.lastName || "";
              const initials =
                (first?.[0] || "P") + (last?.[0] || "").toUpperCase();

              const isPending = appointment.status === "pending";
              const isConfirmed = appointment.status === "confirmed";

              return (
                <article
                  key={appointment.id}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.7)]"
                >
                  {/* Top row */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      {renderStatusBadge(appointment.status)}
                      <span className="text-[11px] text-slate-400">
                        Booked{" "}
                        {format(
                          new Date(appointment.createdAt),
                          "MMM dd, yyyy • HH:mm"
                        )}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      ID: {appointment.id.slice(0, 8)}…
                    </div>
                  </div>

                  {/* Content grid */}
                  <div className="grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-5">
                    {/* Appointment details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-slate-200">
                        <Calendar size={16} className="text-sky-400" />
                        <span>
                          {format(
                            new Date(appointment.date),
                            "EEEE, MMM dd, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-200">
                        <Clock size={16} className="text-sky-400" />
                        <span>
                          {appointment.startTime} – {appointment.endTime}
                        </span>
                      </div>

                      <div className="pt-2">
                        <p className="text-[11px] font-medium text-slate-300 mb-1">
                          Reason for visit
                        </p>
                        <div className="text-xs text-slate-100 bg-white/5 border border-white/10 rounded-2xl px-3 py-2">
                          {appointment.reason}
                        </div>
                      </div>

                      {appointment.patientNotes && (
                        <div>
                          <p className="text-[11px] font-medium text-slate-300 mb-1">
                            Patient notes
                          </p>
                          <div className="text-xs text-sky-50 bg-sky-500/15 border border-sky-500/30 rounded-2xl px-3 py-2">
                            {appointment.patientNotes}
                          </div>
                        </div>
                      )}

                      {appointment.doctorNotes && (
                        <div>
                          <p className="text-[11px] font-medium text-slate-300 mb-1">
                            Your notes
                          </p>
                          <div className="text-xs text-emerald-50 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl px-3 py-2">
                            {appointment.doctorNotes}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Patient card */}
                    <div className="space-y-3">
                      <p className="text-[11px] font-medium text-slate-300">
                        Patient
                      </p>
                      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-3 py-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-xs font-semibold text-white">
                          {initials}
                        </div>
                        <div className="text-xs text-slate-100">
                          <div className="flex items-center gap-1">
                            <User size={14} className="text-slate-400" />
                            <span>
                              {first} {last}
                            </span>
                          </div>
                          {patient?.id && (
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              ID: {patient.id.slice(0, 8)}…
                            </p>
                          )}
                          {patient?.profile?.phone && (
                            <p className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                              <Phone size={12} className="text-slate-500" />
                              {patient.profile.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      {isConfirmed && (
                        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-[11px] text-blue-100">
                          💡 Video consultation can be started from this page at
                          the scheduled time.
                        </div>
                      )}

                      {appointment.status === "completed" &&
                        appointment.doctorNotes && (
                          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-100">
                            ✅ Completed with saved consultation notes.
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-3">
                    {isPending && (
                      <>
                        <button
                          onClick={() =>
                            openActionModal("confirm", appointment)
                          }
                          disabled={updatingId === appointment.id}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500 text-xs font-semibold text-white hover:bg-emerald-600 shadow-sm disabled:opacity-60"
                        >
                          <CheckCircle2 size={16} />
                          Confirm
                        </button>
                        <button
                          onClick={() =>
                            openActionModal("reject", appointment)
                          }
                          disabled={updatingId === appointment.id}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500 text-xs font-semibold text-white hover:bg-rose-600 shadow-sm disabled:opacity-60"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
                      </>
                    )}

                    {isConfirmed && (
                      <>
                        <button
                          onClick={() => handleStartVideoCall(appointment)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500 text-xs font-semibold text-white hover:bg-emerald-600 shadow-sm"
                        >
                          <Video size={16} />
                          Start video call
                        </button>
                        <button
                          onClick={() =>
                            openActionModal("complete", appointment)
                          }
                          disabled={updatingId === appointment.id}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-sky-500 text-xs font-semibold text-white hover:bg-sky-600 shadow-sm disabled:opacity-60"
                        >
                          <CheckCircle2 size={16} />
                          Mark as completed
                        </button>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Video call fullscreen overlay */}
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

        {/* Glass action modal */}
        {pendingAction.type && pendingAction.appointment && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md mx-4 bg-slate-900/90 border border-white/20 rounded-3xl p-5 backdrop-blur-2xl shadow-[0_24px_65px_rgba(0,0,0,0.75)]">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[11px] text-sky-400 uppercase tracking-[0.18em] mb-1">
                    {pendingAction.type === "confirm"
                      ? "Confirm"
                      : pendingAction.type === "reject"
                      ? "Reject"
                      : "Complete"}{" "}
                    appointment
                  </p>
                  <h3 className="text-sm font-semibold text-white">
                    {pendingAction.title}
                  </h3>
                </div>
                <button
                  onClick={closeActionModal}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-[11px] text-slate-400 mb-3">
                For appointment on{" "}
                <span className="text-slate-100 font-medium">
                  {format(
                    new Date(pendingAction.appointment.date),
                    "EEE, MMM dd • HH:mm"
                  )}
                </span>
                .
              </p>

              <label className="block text-[11px] text-slate-300 mb-1">
                {pendingAction.noteLabel}
              </label>
              <textarea
                value={pendingNote}
                onChange={(e) => setPendingNote(e.target.value)}
                rows={3}
                className="w-full text-xs rounded-2xl border border-white/20 bg-white/5 text-slate-100 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-transparent mb-4"
              />

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={closeActionModal}
                  className="px-3 py-2 rounded-2xl text-[11px] font-medium text-slate-200 bg-white/5 border border-white/15 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyAction}
                  disabled={!!updatingId}
                  className="px-4 py-2 rounded-2xl text-[11px] font-semibold text-white bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 shadow-[0_14px_35px_rgba(37,99,235,0.55)] disabled:opacity-60"
                >
                  {pendingAction.ctaLabel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
