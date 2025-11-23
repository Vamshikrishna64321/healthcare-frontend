// ========================================================
// CareSync • DoctorList.tsx
// Clean Futuristic Medical Directory (Unified UI)
// Matches DoctorDashboard & DoctorAppointments
// ========================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userService } from "../services/userService";
import type { User } from "../types";
import {
  Search,
  Filter,
  Award,
  DollarSign,
  Users,
} from "lucide-react";

const DoctorList = () => {
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const specializations = [
    "All",
    "General Practice",
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
  ];

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialization]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedSpecialization && selectedSpecialization !== "All") {
        params.specialization = selectedSpecialization;
      }

      const response = await userService.getDoctors(params);
      if (response.success) {
        // @ts-ignore API structure
        setDoctors(response.data.doctors);
      }
    } catch {
      setError("Unable to load doctors. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const q = searchTerm.toLowerCase();
    const name = `${doctor.profile.firstName} ${doctor.profile.lastName}`.toLowerCase();
    const specialization = doctor.doctorProfile?.specialization?.toLowerCase() || "";
    return name.includes(q) || specialization.includes(q);
  });

  // ================================
  // LOADING
  // ================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="h-10 w-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* ================================
            HEADER
        ================================ */}
        <header className="mb-10">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-sky-400 uppercase mb-2">
            CareSync / Directory
          </p>
          <h1 className="text-3xl font-semibold text-white">Find a Doctor</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse trusted CareSync healthcare specialists
          </p>
        </header>

        {/* ================================
            SEARCH + FILTER
        ================================ */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-xl mb-10">
          <div className="grid md:grid-cols-2 gap-4">

            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or specialization…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-slate-200 placeholder-slate-500 pl-12 pr-4 py-3 rounded-2xl backdrop-blur-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Specialization */}
            <div className="relative">
              <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-slate-200 pl-12 pr-4 py-3 rounded-2xl appearance-none backdrop-blur-lg focus:ring-2 focus:ring-sky-500"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec} className="text-black">
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Showing{" "}
            <span className="text-sky-300 font-medium">{filteredDoctors.length}</span>{" "}
            specialists
          </p>
        </div>

        {/* ================================
            ERROR
        ================================ */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-2xl backdrop-blur-xl mb-8">
            {error}
          </div>
        )}

        {/* ================================
            DOCTOR CARDS
        ================================ */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-white/5 border border-white/10 p-16 rounded-3xl text-center backdrop-blur-xl shadow-xl">
            <Search size={48} className="mx-auto text-slate-500 mb-4" />
            <h3 className="text-lg text-white font-semibold">No doctors found</h3>
            <p className="text-sm text-slate-400 mt-1">Try changing your filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => {
              const initials =
                doctor.profile.firstName[0] + doctor.profile.lastName[0];

              return (
                <div
                  key={doctor.id}
                  className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-lg hover:border-sky-500/30 hover:bg-white/10 transition"
                >
                  {/* HEADER */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-600 to-emerald-500 flex items-center justify-center text-white text-xl font-semibold shadow-md">
                      {initials}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Dr. {doctor.profile.firstName} {doctor.profile.lastName}
                      </h3>
                      <p className="text-sky-300 text-sm">
                        {doctor.doctorProfile?.specialization}
                      </p>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="space-y-3 text-sm text-slate-300">

                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-purple-300" />
                      <span>
                        {doctor.doctorProfile?.yearsOfExperience} years experience
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-emerald-300" />
                      <span>
                        ${doctor.doctorProfile?.consultationFee} / session
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-sky-300" />
                      <span>Trusted by 120+ patients</span>
                    </div>

                    {doctor.doctorProfile?.qualifications &&
                      doctor.doctorProfile.qualifications.slice(0, 3).map((q, i) => (
                        <span
                          key={i}
                          className="inline-block px-2 py-1 bg-white/10 border border-white/20 rounded-xl text-[11px] text-sky-200"
                        >
                          {q}
                        </span>
                      ))}
                  </div>

                  {/* BUTTON */}
                  <Link
                    to={`/book-appointment/${doctor.id}`}
                    className="block mt-6 w-full rounded-2xl bg-gradient-to-r from-sky-600 to-emerald-500 text-white text-center py-2.5 font-medium hover:opacity-90 transition"
                  >
                    Book Appointment
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
