// ============================================
// CareSync • BookAppointment.tsx
// Hybrid Futuristic Medical Booking
// ============================================

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { appointmentService } from "../services/appointmentService";
import type { User, TimeSlot } from "../types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { format, addDays } from "date-fns";

const BookAppointment = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [reason, setReason] = useState("");
  const [patientNotes, setPatientNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Generate next 7 days
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i + 1);
    return {
      value: format(date, "yyyy-MM-dd"),
      labelDay: format(date, "EEE"),
      labelFull: format(date, "MMM dd"),
    };
  });

  // Load doctor
  useEffect(() => {
    const loadDoctor = async () => {
      if (!doctorId) return;
      try {
        setLoading(true);
        const response = await userService.getDoctorById(doctorId);
        if (response.success) {
          // @ts-ignore backend shape
          setDoctor(response.data.user);
        }
      } catch (err) {
        setError("Unable to load doctor details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [doctorId]);

  // Load slots when date changes
  useEffect(() => {
    const loadSlots = async () => {
      if (!doctorId || !selectedDate) return;

      try {
        const response = await appointmentService.getAvailableSlots(
          doctorId,
          selectedDate
        );

        if (response.success) {
          // @ts-ignore backend shape
          setAvailableSlots(response.data.availableSlots || []);
        } else {
          setAvailableSlots([]);
        }
      } catch {
        setAvailableSlots([]);
      }
    };

    loadSlots();
  }, [doctorId, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }
    if (!selectedSlot) {
      setError("Please choose a time slot.");
      return;
    }
    if (reason.trim().length < 10) {
      setError("Please describe your reason (at least 10 characters).");
      return;
    }

    try {
      setSubmitting(true);
      const response = await appointmentService.createAppointment({
        doctorId: doctorId!,
        date: selectedDate,
        timeSlot: selectedSlot,
        reason,
        patientNotes,
      });

      if (response.success) {
        setSuccess("Your appointment has been scheduled.");
        setTimeout(() => navigate("/patient/appointments"), 1500);
      } else {
        setError("Could not create appointment. Please try again.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to book the appointment at the moment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ===================== STATES =====================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-2 border-sky-400/40 border-t-sky-400 rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Preparing your booking…
          </p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
        <div className="max-w-sm w-full rounded-3xl bg-slate-900/80 border border-rose-500/30 px-6 py-8 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="text-rose-400 mb-3" size={40} />
            <h2 className="text-lg font-semibold text-white mb-1">
              Doctor not available
            </h2>
            <p className="text-sm text-slate-400 mb-5">
              We couldn&apos;t find the doctor you were trying to book with.
            </p>
            <button
              onClick={() => navigate("/doctors")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-xs font-semibold text-white hover:from-sky-600 hover:to-emerald-600 transition shadow-[0_0_18px_rgba(56,189,248,0.6)]"
            >
              <ArrowLeft size={14} />
              Back to doctor list
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===================== MAIN UI =====================

  const initials =
    (doctor.profile.firstName?.[0] || "") +
    (doctor.profile.lastName?.[0] || "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top header */}
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/doctors")}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to doctors
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 shadow-inner">
            <span className="h-6 w-6 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center text-[10px] font-semibold text-white">
              CS
            </span>
            <span className="text-[11px] font-medium text-slate-200">
              CareSync · Smart Booking
            </span>
          </div>
        </header>

        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)] gap-6 items-start">
          {/* Doctor overview card */}
          <section className="relative">
            <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="rounded-3xl bg-slate-900/80 border border-slate-700/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.9)] relative overflow-hidden">
              <div className="flex gap-4 items-start mb-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center text-xl font-semibold text-white shadow-lg">
                  {initials || "DR"}
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-sky-400 mb-1">
                    CareSync Specialist
                  </p>
                  <h1 className="text-xl font-semibold text-white">
                    Dr. {doctor.profile.firstName} {doctor.profile.lastName}
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    {doctor.doctorProfile?.specialization ||
                      "General Practitioner"}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-4 text-[11px] text-slate-300">
                    {doctor.doctorProfile?.yearsOfExperience && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {doctor.doctorProfile.yearsOfExperience}+ years
                        experience
                      </div>
                    )}

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700">
                      <DollarSign size={14} className="text-emerald-400" />
                      <span className="font-semibold">
                        {doctor.doctorProfile?.consultationFee || 0}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        per session
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-gradient-to-r from-slate-800/90 to-slate-900/90 border border-slate-700 px-4 py-3 text-[11px] text-slate-200">
                <p className="font-semibold mb-1 text-sky-100">
                  How your CareSync visit works
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Select a date and time that fits your schedule.</li>
                  <li>
                    Share a short summary so your doctor is ready before the
                    call.
                  </li>
                  <li>
                    Get confirmation & reminders directly inside CareSync.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Booking form */}
          <section className="rounded-3xl bg-slate-900/80 border border-slate-700/70 p-6 lg:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
            <header className="mb-5">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-400 uppercase mb-1">
                Step 1 of 2
              </p>
              <h2 className="text-lg font-semibold text-white">
                Schedule your consultation
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose a date, pick a time, and tell your doctor what you need
                help with.
              </p>
            </header>

            {success && (
              <div className="mb-4 flex items-start gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
                <CheckCircle2 size={16} className="mt-px" />
                <span>{success}</span>
              </div>
            )}

            {error && !success && (
              <div className="mb-4 flex items-start gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">
                <AlertCircle size={16} className="mt-px" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date & time */}
              <div className="grid sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] gap-4">
                {/* Date selector */}
                <div>
                  <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-200 mb-2 uppercase tracking-wide">
                    <Calendar size={14} className="text-sky-400" />
                    Date
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {availableDates.map((d) => {
                      const active = selectedDate === d.value;
                      return (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => {
                            setSelectedDate(d.value);
                            setSelectedSlot(null);
                            setError("");
                            setSuccess("");
                          }}
                          className={`min-w-[92px] px-3 py-2 rounded-2xl border text-xs flex flex-col items-center justify-center transition ${
                            active
                              ? "border-sky-400 bg-sky-500/20 text-sky-50 shadow-[0_0_18px_rgba(56,189,248,0.6)]"
                              : "border-slate-700 bg-slate-800/80 text-slate-200 hover:border-sky-500/60"
                          }`}
                        >
                          <span className="font-semibold">{d.labelDay}</span>
                          <span className="text-[11px] opacity-80">
                            {d.labelFull}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                <div>
                  <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-200 mb-2 uppercase tracking-wide">
                    <Clock size={14} className="text-emerald-400" />
                    Time slot
                  </label>

                  {!selectedDate ? (
                    <div className="text-[11px] text-slate-400 border border-dashed border-slate-700 rounded-2xl px-3 py-3 bg-slate-900/70">
                      Select a date first to view available times.
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-[11px] text-amber-100 border border-amber-500/40 rounded-2xl px-3 py-3 bg-amber-500/10">
                      No slots available for this day. Try another date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((slot, idx) => {
                        const active =
                          selectedSlot?.startTime === slot.startTime &&
                          selectedSlot?.endTime === slot.endTime;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedSlot(slot);
                              setError("");
                            }}
                            className={`px-2.5 py-2 rounded-2xl border text-[11px] font-medium transition ${
                              active
                                ? "border-emerald-400 bg-emerald-500/20 text-emerald-50 shadow-[0_0_18px_rgba(16,185,129,0.6)]"
                                : "border-slate-700 bg-slate-900/70 text-slate-200 hover:border-emerald-400/70"
                            }`}
                          >
                            {slot.startTime}
                            <span className="block text-[10px] opacity-70">
                              {slot.endTime}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="text-[11px] font-semibold text-slate-200 mb-1 block uppercase tracking-wide">
                  Reason for visit
                  <span className="text-rose-400 ml-0.5">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full text-sm rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-transparent text-slate-100 placeholder:text-slate-500"
                  placeholder="Describe your main symptoms or the purpose of this consultation so your doctor can prepare."
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Minimum 10 characters.
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] font-semibold text-slate-200 mb-1 block uppercase tracking-wide">
                  Additional notes (optional)
                </label>
                <textarea
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  rows={2}
                  className="w-full text-sm rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-transparent text-slate-100 placeholder:text-slate-500"
                  placeholder="Allergies, medications, or anything else your doctor should know."
                />
              </div>

              {/* Summary + actions */}
              <div className="space-y-4 pt-2">
                {selectedDate && selectedSlot && (
                  <div className="border border-slate-700 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900 to-slate-900/90 px-4 py-3 text-xs text-slate-100">
                    <p className="font-semibold mb-1 text-sky-100">
                      Appointment summary
                    </p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <div>
                        <p className="text-[11px] text-slate-400">Doctor</p>
                        <p className="font-medium">
                          Dr. {doctor.profile.firstName}{" "}
                          {doctor.profile.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400">
                          Date & time
                        </p>
                        <p className="font-medium">
                          {format(new Date(selectedDate), "EEE, MMM dd")} ·{" "}
                          {selectedSlot.startTime} – {selectedSlot.endTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400">Session fee</p>
                        <p className="font-semibold text-emerald-300">
                          ${doctor.doctorProfile?.consultationFee || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400">Mode</p>
                        <p className="font-medium text-slate-100">
                          Online / in-clinic as agreed
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/doctors")}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-slate-700 bg-slate-900/80 text-xs font-medium text-slate-200 hover:bg-slate-800"
                  >
                    Cancel and go back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !selectedSlot || !selectedDate}
                    className="w-full sm:flex-1 px-4 py-2.5 rounded-2xl text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-emerald-500 shadow-[0_14px_30px_rgba(37,99,235,0.45)] hover:from-sky-600 hover:to-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? "Booking your appointment…"
                      : "Confirm appointment"}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
