// ============================================
// CareSync • HomePage.tsx
// Clean Futuristic Medical Landing (Dark Mode)
// ============================================

import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Clock,
  Shield,
  Video,
  Star,
  ArrowRight,
  Check,
  Stethoscope,
} from "lucide-react";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* =========================
          HERO
      ========================== */}
      <section className="pt-10 pb-16 lg:pt-14 lg:pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* CareSync label */}
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-sky-400 font-semibold mb-1">
              CareSync / Platform
            </p>
            <p className="text-xs text-slate-400">
              A connected console for patients and providers
            </p>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-10 items-center">
            {/* LEFT: main copy */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-50 mb-4">
                Healthcare that feels{" "}
                <span className="text-sky-300">coordinated</span>, not chaotic.
              </h1>

              <p className="text-sm md:text-base text-slate-400 max-w-xl mb-7">
                CareSync connects patients and clinicians in one streamlined
                workspace. Book visits, join video consultations, and follow
                up — all in a single, secure interface.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-7">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(37,99,235,0.6)] hover:from-sky-600 hover:to-emerald-600 transition"
                >
                  Get started with CareSync
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/doctors"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-white/15 bg-white/5 text-sm font-medium text-slate-100 hover:bg-white/10 transition"
                >
                  Browse doctors
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div>
                  <p className="text-lg font-semibold text-slate-50">
                    1,000+
                  </p>
                  <p>licensed specialists</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-50">
                    50,000+
                  </p>
                  <p>patients connected</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star
                    className="text-yellow-300 fill-yellow-300"
                    size={16}
                  />
                  <p className="text-lg font-semibold text-slate-50">4.9</p>
                  <p className="ml-1">average rating</p>
                </div>
              </div>
            </div>

            {/* RIGHT: compact glass panel */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-[1.8rem] bg-gradient-to-tr from-sky-500/30 via-transparent to-emerald-500/30 blur-2xl opacity-60" />
              <div className="relative rounded-[1.8rem] border border-white/12 bg-white/5 backdrop-blur-2xl p-5 shadow-[0_20px_60px_rgba(15,23,42,0.85)]">
                {/* header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-200 border border-sky-500/40">
                      <Stethoscope size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-300">
                        CareSync availability
                      </p>
                      <p className="text-sm font-semibold text-slate-50">
                        Today&apos;s schedule snapshot
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                    Live view
                  </span>
                </div>

                {/* mini metrics */}
                <div className="grid grid-cols-3 gap-3 mb-5 text-xs">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <p className="text-[11px] text-slate-400">Appointments</p>
                    <p className="mt-1 text-sm font-semibold text-sky-300 flex items-center gap-1">
                      <Calendar size={14} /> 24 booked
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <p className="text-[11px] text-slate-400">Video ready</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-300 flex items-center gap-1">
                      <Video size={14} /> 14 online
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <p className="text-[11px] text-slate-400">Wait time</p>
                    <p className="mt-1 text-sm font-semibold text-slate-50 flex items-center gap-1">
                      <Clock size={14} /> &lt; 10 min
                    </p>
                  </div>
                </div>

                {/* small patient tile */}
                <div className="rounded-xl bg-slate-900/70 border border-slate-700/70 p-3 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-xs font-semibold text-white">
                      JD
                    </div>
                    <div className="text-xs">
                      <p className="font-medium text-slate-50">Follow-up visit</p>
                      <p className="text-slate-400 text-[11px]">
                        Next in queue • 18:30
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-sky-500/15 text-sky-200 border border-sky-500/40">
                    In line
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-slate-400">
                  Patients see a clean booking view, while providers manage their
                  day in a unified CareSync console.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
      ========================== */}
      <section className="py-14 border-t border-slate-800/70">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-9">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-sky-400 font-semibold mb-2">
                Why CareSync
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                Built for both patients and clinicians.
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              From first booking to follow-up notes, CareSync keeps everyone on
              the same page — securely and in real time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl">
              <div className="h-10 w-10 rounded-xl bg-sky-500/15 flex items-center justify-center mb-3">
                <Calendar className="text-sky-300" size={22} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Fast, clear booking
              </h3>
              <p className="text-xs text-slate-400">
                See real-time availability, pick your slot, and confirm in
                seconds — no calls or back-and-forth emails.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center mb-3">
                <Video className="text-emerald-300" size={22} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Video consults built-in
              </h3>
              <p className="text-xs text-slate-400">
                Join encrypted video visits with one tap — no separate apps, no
                meeting links to manage.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl">
              <div className="h-10 w-10 rounded-xl bg-purple-500/15 flex items-center justify-center mb-3">
                <Users className="text-purple-300" size={22} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Specialists in one network
              </h3>
              <p className="text-xs text-slate-400">
                Cardiology, dermatology, pediatrics and more — verified
                professionals connected through CareSync.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl">
              <div className="h-10 w-10 rounded-xl bg-rose-500/15 flex items-center justify-center mb-3">
                <Shield className="text-rose-300" size={22} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Security by default
              </h3>
              <p className="text-xs text-slate-400">
                We use strict access controls and encryption so patient
                information stays private and compliant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          HOW IT WORKS
      ========================== */}
      <section className="py-14 border-t border-slate-800/70">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-9">
            <p className="text-[11px] uppercase tracking-[0.25em] text-sky-400 font-semibold mb-2">
              Workflow
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
              Three steps to connected care.
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              Whether you&apos;re a patient or a provider, CareSync simplifies the
              journey from first booking to follow-up.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: 1,
                title: "Create your profile",
                text: "Sign up in under a minute and add your basic details to personalize your CareSync space.",
              },
              {
                step: 2,
                title: "Match with a specialist",
                text: "Filter by specialty, experience and availability to find the right clinician for your needs.",
              },
              {
                step: 3,
                title: "Book & consult online",
                text: "Confirm a slot, receive reminders, and join your consult directly from CareSync.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-xl"
              >
                <div className="absolute -top-4 left-4 h-8 w-8 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                  {item.step}
                </div>
                <div className="pt-4">
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          FINAL CTA
      ========================== */}
      <section className="py-16 border-t border-slate-800/70">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-sky-200 mb-4">
            <Check size={14} />
            Designed for both patients and providers
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
            Ready to bring your care into one place?
          </h2>
          <p className="text-sm text-slate-400 mb-8 max-w-xl mx-auto">
            Join teams and patients who use CareSync every day to coordinate
            visits, video consults, and follow-ups in a single experience.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(37,99,235,0.7)] hover:from-sky-600 hover:to-emerald-600 transition"
          >
            Get started free
            <ArrowRight size={18} />
          </Link>

          <div className="grid md:grid-cols-3 gap-4 mt-9 text-xs text-slate-300">
            <div className="flex items-center gap-2 justify-center">
              <Check size={16} className="text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check size={16} className="text-emerald-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check size={16} className="text-emerald-400" />
              <span>24/7 remote access</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
