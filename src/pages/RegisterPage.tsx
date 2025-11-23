// ============================================
// CareSync • RegisterPage.tsx
// Futuristic Neon Glass (Dark Mode)
// ============================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { User, Building2, ArrowRight, Shield, Mail, Phone } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    specialization: "",
    licenseNumber: "",
    yearsOfExperience: 0,
    consultationFee: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const registerData: any = {
        email: formData.email.trim(),
        password: formData.password,
        role,
        profile: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
        },
      };

      if (role === "doctor") {
        registerData.doctorProfile = {
          specialization: formData.specialization,
          licenseNumber: formData.licenseNumber,
          yearsOfExperience: Number(formData.yearsOfExperience),
          qualifications: ["MD"],
          consultationFee: Number(formData.consultationFee),
          availability: [
            {
              day: "Monday",
              slots: [{ startTime: "09:00", endTime: "17:00" }],
            },
          ],
        };
      }

      const response = await authService.register(registerData);

      if (response.success) {
        login(response.data.user, response.data.token);
        navigate(
          response.data.user.role === "doctor"
            ? "/doctor/dashboard"
            : "/patient/dashboard"
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* Glowing Orbs */}
      <div className="absolute -top-40 -left-32 h-72 w-72 rounded-full bg-sky-500/30 blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-80px] h-80 w-80 rounded-full bg-emerald-500/30 blur-3xl" />

      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_0_0,#38bdf8_0,transparent_55%),radial-gradient(circle_at_100%_100%,#22c55e_0,transparent_55%)]" />

      <div className="relative w-full max-w-2xl">
        {/* Glass Card */}
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(15,23,42,0.9)] p-8 md:p-10">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_25px_rgba(56,189,248,0.8)]">
              <Shield size={26} />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-white mt-4 tracking-tight text-center">
              Create your CareSync account
            </h1>
            <p className="text-slate-400 text-sm mt-1 text-center">
              Choose your role and begin your connected care journey.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 text-sm text-rose-200 bg-rose-500/10 border border-rose-500/40 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <p className="text-xs font-medium text-slate-200 mb-2">
              I am signing up as:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`relative flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border text-xs font-medium transition ${
                  role === "patient"
                    ? "border-sky-400 bg-sky-500/20 text-sky-50 shadow-[0_0_22px_rgba(56,189,248,0.7)]"
                    : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-sky-500/30 flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span>Patient</span>
                </div>
                {role === "patient" && (
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setRole("doctor")}
                className={`relative flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border text-xs font-medium transition ${
                  role === "doctor"
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-50 shadow-[0_0_22px_rgba(16,185,129,0.7)]"
                    : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/30 flex items-center justify-center">
                    <Building2 size={16} />
                  </div>
                  <span>Doctor</span>
                </div>
                {role === "doctor" && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                )}
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-xs md:text-sm">
            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-[11px] font-medium text-slate-200 mb-1"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-[11px] font-medium text-slate-200 mb-1"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-medium text-slate-200 mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-[11px] font-medium text-slate-200 mb-1"
              >
                Phone (optional)
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-[11px] font-medium text-slate-200 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-[11px] font-medium text-slate-200 mb-1"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
                />
              </div>
            </div>

            {/* Doctor Fields */}
            {role === "doctor" && (
              <div className="pt-5 mt-2 border-t border-white/10 space-y-4">
                <h3 className="text-sm font-semibold text-slate-100">
                  Professional details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="specialization"
                      className="block text-[11px] font-medium text-slate-200 mb-1"
                    >
                      Specialization
                    </label>
                    <select
                      id="specialization"
                      name="specialization"
                      required
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                    >
                      <option value="">Select…</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="General">General Practice</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="licenseNumber"
                      className="block text-[11px] font-medium text-slate-200 mb-1"
                    >
                      License number
                    </label>
                    <input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      required
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="MD12345"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="yearsOfExperience"
                      className="block text-[11px] font-medium text-slate-200 mb-1"
                    >
                      Experience (years)
                    </label>
                    <input
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      type="number"
                      min="0"
                      required
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="consultationFee"
                      className="block text-[11px] font-medium text-slate-200 mb-1"
                    >
                      Consultation fee ($)
                    </label>
                    <input
                      id="consultationFee"
                      name="consultationFee"
                      type="number"
                      min="0"
                      required
                      value={formData.consultationFee}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl 
                bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold text-sm 
                shadow-[0_0_28px_rgba(56,189,248,0.7)] hover:from-sky-600 hover:to-emerald-600 
                transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Creating your account…</span>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom link */}
        <p className="text-center text-slate-400 text-xs mt-5">
          Already have a CareSync account?{" "}
          <Link
            to="/login"
            className="text-sky-400 hover:text-sky-300 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
