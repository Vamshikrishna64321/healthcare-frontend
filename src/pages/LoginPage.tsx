// ============================================
// CareSync • LoginPage.tsx
// Futuristic Neon Glass (Dark Mode)
// ============================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { Mail, ArrowRight, Shield, KeyRound } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(formData);

      if (response.success) {
        login(response.data.user, response.data.token);

        if (response.data.user.role === "doctor") {
          navigate("/doctor/dashboard");
        } else if (response.data.user.role === "patient") {
          navigate("/patient/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-6 py-10 relative overflow-hidden">

      {/* Glowing Orbs Background */}
      <div className="absolute -top-40 -left-28 w-80 h-80 bg-sky-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-60px] w-[380px] h-[380px] bg-emerald-500/20 blur-3xl rounded-full"></div>

      {/* Floating Lines / subtle texture */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/dark-mosaic.png')]"></div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 shadow-[0_0_60px_rgba(56,189,248,0.25)] rounded-2xl p-8">

          {/* Branding */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_25px_rgba(56,189,248,0.7)]">
              <Shield size={26} />
            </div>
            <h1 className="text-3xl font-semibold text-white mt-4 tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to continue to CareSync</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 text-slate-100 px-10 py-3 rounded-xl focus:ring-2 focus:ring-sky-500/70 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <button className="text-xs text-sky-400 hover:text-sky-300">
                  Forgot?
                </button>
              </div>

              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 text-slate-100 px-10 py-3 rounded-xl focus:ring-2 focus:ring-sky-500/70 outline-none"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-sky-400" />
              <label htmlFor="remember" className="text-xs text-slate-400">
                Keep me signed in
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold py-3 rounded-xl shadow-[0_0_25px_rgba(56,189,248,0.6)] hover:from-sky-600 hover:to-emerald-600 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Link */}
        <p className="text-center text-slate-400 text-sm mt-6">
          Don't have an account?{" "}
          <Link className="text-sky-400 hover:text-sky-300 font-medium" to="/register">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
